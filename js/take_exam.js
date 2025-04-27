// src/main/resources/static/js/take_exam.js
document.addEventListener('DOMContentLoaded', () => {
    const startForm        = document.getElementById('startForm');
    const examForm         = document.getElementById('examForm');
    const examSelect       = document.getElementById('examSelect');
    const questionsContainer = document.getElementById('questionsContainer');
    let currentExamId, attemptId, studentId = 1; // replace with real userId
  
    // 1) load exams
    fetch('http://localhost:8082/api/exams/exams')
      .then(r => r.json())
      .then(list => {
        list.forEach(e => {
          const opt = document.createElement('option');
          opt.value = e.examId;
          opt.textContent = e.title;
          examSelect.appendChild(opt);
        });
      });
  
    // 2) start attempt
    startForm.addEventListener('submit', async e => {
      e.preventDefault();
      currentExamId = +examSelect.value;
      if (!currentExamId) return;
  
      const res = await fetch('http://localhost:8082/api/attempts/create', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ examId: currentExamId, studentId })
      });
      const data = await res.json();
      attemptId = data.attemptId;
  
      // load questions+choices
      const qs = await fetch(`http://localhost:8082/api/questions/exam/${currentExamId}`).then(r=>r.json());
      questionsContainer.innerHTML = qs.map((q,i) => `
        <div class="question-block">
          <p><strong>${i+1}. ${q.text}</strong></p>
          ${q.choices.map(c => `
            <div>
              <input type="radio"
                     name="q${q.questionId}"
                     id="q${q.questionId}-c${c.choiceId}"
                     value="${c.choiceId}"
                     required>
              <label for="q${q.questionId}-c${c.choiceId}">${c.text}</label>
            </div>
          `).join('')}
        </div>
      `).join('');
  
      startForm.style.display = 'none';
      examForm.style.display  = 'block';
    });
  
    // 3) submit responses
    examForm.addEventListener('submit', async e => {
      e.preventDefault();
      const inputs = examForm.querySelectorAll('input[type="radio"]:checked');
      for (let inp of inputs) {
        const [ , qid ] = inp.name.match(/^q(\d+)$/);
        await fetch('http://localhost:8082/api/responses/create', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({
            attemptId,
            questionId: +qid,
            choiceId: +inp.value
          })
        });
      }
      alert('Vos réponses ont bien été enregistrées !');
      // you could redirect or show score here ....
    });
  });
  