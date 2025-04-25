document.addEventListener('DOMContentLoaded', () => {
    const configForm    = document.getElementById('configForm');
    const questionsForm = document.getElementById('questionsForm');
    const container     = document.getElementById('questionsContainer');
    const examSelect    = document.getElementById('examSelect');
  
    let currentExamId = null;
  
    // 0) Charger la liste des examens pour le <select>
    async function loadExams() {
      try {
        const res = await fetch('http://localhost:8082/api/exams/exams');
        if (!res.ok) throw new Error(await res.text());
        const exams = await res.json();
        exams.forEach(exam => {
          const opt = document.createElement('option');
          opt.value = exam.examId;
          opt.textContent = exam.title;
          examSelect.appendChild(opt);
        });
      } catch (err) {
        console.error('Erreur chargement examens :', err);
        alert('Impossible de charger la liste des examens');
      }
    }
    loadExams();
  
    // 1) Générer les blocs de question une fois examen + nombre saisis
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
                    rows="2"
                    required></textarea>
  
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
  
    // 2) Enregistrer questions + choix
    questionsForm.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        for (let i = 1; i <= container.children.length; i++) {
          // 2.1) Créer la question
          const text = document
            .getElementById(`questionText-${i}`)
            .value.trim();
  
          const resQ = await fetch('http://localhost:8082/api/questions/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, examId: currentExamId })
          });
          if (!resQ.ok) throw new Error(await resQ.text());
          const savedQ = await resQ.json();
          const questionId = savedQ.questionId;
  
          // 2.2) Créer les 4 choix
          const correctIndex = document.querySelector(`input[name="correct-${i}"]:checked`).value;
          for (let j = 1; j <= 4; j++) {
            const choiceText = document.getElementById(`choice-${i}-${j}`).value.trim();
            const isCorrect  = (parseInt(correctIndex, 10) === j);
  
            const resC = await fetch('http://localhost:8082/api/choices/create', {
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
  