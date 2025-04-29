// src/main/resources/static/js/prof_results.js
document.addEventListener('DOMContentLoaded', () => {
    // 0) Guard client-side: only mentors
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
  
    const container = document.getElementById('resultsContainer');
    const url = `http://localhost:8082/api/exams/my-results?mentorId=${user.userId}`;
  
    // 1) Fetch the data
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(exams => {
        if (exams.length === 0) {
          container.innerHTML = '<p>Aucun examen créé.</p>';
          return;
        }
        // 2) Render each exam
        exams.forEach(exam => {
          const div = document.createElement('div');
          div.classList.add('card');
          div.innerHTML = `
            <h3>${exam.title}</h3>
            ${exam.results.length === 0 
              ? '<p>Aucun étudiant n\'a passé cet examen.</p>'
              : `
            <table class="results-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Note /20</th>
                </tr>
              </thead>
              <tbody>
                ${exam.results.map(r => `
                  <tr>
                    <td>${r.studentName}</td>
                    <td>${
                      r.score != null
                        ? r.score.toFixed(2)
                        : 'N/a'
                    }</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`}
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error('Erreur chargement résultats :', err);
        container.innerHTML = `
          <p>Erreur lors du chargement :</p>
          <p>${err.message}</p>
        `;
      });
  });
  