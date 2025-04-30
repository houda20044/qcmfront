// src/main/resources/static/js/admin_dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // 1) Guard: only ADMIN
    const raw = localStorage.getItem('loggedInUser');
    if (!raw) {
      alert('Veuillez vous connecter.');
      return window.location.href = 'index.html';
    }
    const user = JSON.parse(raw);
    if (user.role !== 'ADMIN') {
      alert('Accès réservé aux admins.');
      return window.location.href = 'index.html';
    }
  
    // 2) Fetch all users
    fetch('http://localhost:8082/api/users/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(users => {
        const tbody = document.querySelector('#usersTable tbody');
        if (users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4">Aucun utilisateur trouvé.</td></tr>';
          return;
        }
        tbody.innerHTML = users.map(u => `
          <tr>
            <td>${u.userId}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
          </tr>
        `).join('');
      })
      .catch(err => {
        console.error('Erreur chargement utilisateurs :', err);
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = `<tr><td colspan="4">Erreur: ${err.message}</td></tr>`;
      });
  });
  