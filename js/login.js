document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    // Récupération des valeurs du formulaire
    const email = e.target.querySelector("input[type='email']").value;
    const password = e.target.querySelector("input[type='password']").value;
  
    // Simuler la récupération de l'utilisateur depuis le stockage local
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    const user = users.find(u => u.email === email && u.password === password);
  
    if (user) {
      alert("Connexion réussie !");
      
      
      localStorage.setItem("loggedInUser", JSON.stringify(user));
  
      // Redirection selon le rôle
      if (user.role === "etudiant") {
        window.location.href = "dashboard-etudient.html"; // Étudiant
      } else if (user.role === "professeur") {
        window.location.href = "dashboard-professeur.html"; // Prof
      } else {
        alert("Rôle inconnu !");
      }
    } else {
      alert("Email ou mot de passe incorrect.");
    }
  });
  