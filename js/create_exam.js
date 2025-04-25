document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('examForm');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const title       = examTitle.value.trim();
      const description = examDescription.value.trim();
      const createdBy   = 1;
  
      try {
        const res = await fetch('http://localhost:8082/api/exams/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, createdBy })
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Examen créé avec succès !');
        form.reset();
      } catch (err) {
        console.error(err);
        alert('Erreur: ' + err.message);
      }
    });
  });
  