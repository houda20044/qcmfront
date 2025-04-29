document.addEventListener('DOMContentLoaded', () => {
    // ——————————————
    // 0) Client-side guard
    // ——————————————
    const raw = localStorage.getItem('loggedInUser');
    if (!raw) {
      alert('Veuillez vous connecter.');
      return window.location.href = 'index.html';
    }
    const user = JSON.parse(raw);
    if (user.role !== 'MENTOR') {
      alert('Accès réservé aux enseignants.');
      return window.location.href = 'index.html';
    }
  
    // ——————————————
    // 1) Fetch exams
    // ——————————————
    const examSelect = document.getElementById('examSelect');
    fetch('/api/exams/all')
      .then(r => r.json())
      .then(exams => {
        exams.forEach(e => {
          const opt = document.createElement('option');
          opt.value = e.examId;
          opt.textContent = e.title;
          examSelect.appendChild(opt);
        });
      })
      .catch(err => {
        console.error('Erreur chargement examens :', err);
        alert('Impossible de charger la liste des examens');
      });
  
    // ——————————————
    // 2) Generate question blocks
    // ——————————————
    const configForm    = document.getElementById('configForm');
    const questionsForm = document.getElementById('questionsForm');
    const container     = document.getElementById('questionsContainer');
    let currentExamId;
  
    configForm.addEventListener('submit', e => {
      e.preventDefault();
      currentExamId = +examSelect.value;
      const n = parseInt(document.getElementById('nombreQuestions').value, 10);
      if (!currentExamId || isNaN(n) || n < 1) return;
  
      container.innerHTML = '';
      for (let i = 1; i <= n; i++) {
        const div = document.createElement('div');
        div.classList.add('question-block');
        div.innerHTML = `
          <label>Question ${i} :</label>
          <textarea id="questionText-${i}"
                    placeholder="Texte de la question ${i}"
                    rows="2" required></textarea>
          <div class="choices-container">
            <p>Choix pour question ${i} :</p>
            ${[1,2,3,4].map(j => `
              <div class="choice-item">
                <input type="radio"
                       name="correct-${i}"
                       id="correct-${i}-${j}"
                       value="${j}"
                       required />
                <label for="correct-${i}-${j}">Correct ?</label>
                <input type="text"
                       id="choice-${i}-${j}"
                       placeholder="Texte du choix ${j}"
                       required />
              </div>
            `).join('')}
          </div>
          <hr/>
        `;
        container.appendChild(div);
      }
  
      configForm.style.display    = 'none';
      questionsForm.style.display = 'block';
    });
  
    // ——————————————
    // 3) Submit questions + choices
    // ——————————————
    questionsForm.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        for (let i = 1; i <= container.children.length; i++) {
          // 3.1) create question
          const text = document.getElementById(`questionText-${i}`).value.trim();
          let resQ = await fetch('/api/questions/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              examId: currentExamId,
              createdBy: user.userId     // ← send creator
            })
          });
          if (!resQ.ok) throw new Error(await resQ.text());
          const savedQ = await resQ.json();
          const questionId = savedQ.questionId;
  
          // 3.2) create 4 choices
          const correctIndex = document.querySelector(`input[name="correct-${i}"]:checked`).value;
          for (let j = 1; j <= 4; j++) {
            const choiceText = document.getElementById(`choice-${i}-${j}`).value.trim();
            const isCorrect  = (parseInt(correctIndex, 10) === j);
            let resC = await fetch('/api/choices/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ questionId, text: choiceText, isCorrect })
            });
            if (!resC.ok) throw new Error(await resC.text());
          }
        }
  
        alert('Toutes les questions et choix ont été enregistrés !');
        window.location.reload();
  
      } catch (err) {
        console.error(err);
        alert('Échec : ' + err.message);
      }
    });
  });
  