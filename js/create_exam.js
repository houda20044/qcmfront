document.addEventListener('DOMContentLoaded', () => {
    // 1) Guard: ensure user is logged in and is a MENTOR
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
  
    // 2) Hook the form
    const form = document.getElementById('examForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const title       = document.getElementById('examTitle').value.trim();
      const description = document.getElementById('examDescription').value.trim();
      const createdBy   = user.userId;  // from localStorage
  
      try {
        const res = await fetch('http://localhost:8082/api/exams/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, createdBy })
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Examen créé avec succès !');
        form.reset();
        // Redirect to the "Ajouter des Questions" page, passing the new examId:
        const locationHeader = res.headers.get('Location');
        // If you set a Location header with the new exam ID on the back-end,
        // you can extract it here. Otherwise, use a fixed redirect:
        window.location.href = 'creer_questions.html';
      } catch (err) {
        console.error(err);
        alert('Erreur: ' + err.message);
      }
    });
  });
  