document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Récupération des valeurs du formulaire
  const email = e.target.querySelector("input[type='email']").value;
  const password = e.target.querySelector("input[type='password']").value;

  
  fetch('http://localhost:8082/api/users/login', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }) 
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Connexion réussie !");
      console.log("Role reçu :", data.user.role);
      
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      // Redirection en fonction du rôle
      if (data.user.role === "STUDENT") {
        window.location.href = "dashboard-etudiant.html";
      } else if (data.user.role === "MENTOR") {
        window.location.href = "dashboard-professeur.html";
      } else if (data.user.role === "ADMIN") {    // ← new
        window.location.href = "admin_dashboard.html"; 
      } else {
        alert("Rôle inconnu !");
      }
    } else {
      alert("Email ou mot de passe incorrect.");
    }
  })
  .catch(error => {
    console.error("Erreur lors de la connexion:", error);
    alert("Une erreur est survenue.");
  });
});
