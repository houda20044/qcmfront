document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rawRole = document.getElementById("role").value;
    let role;
    if (rawRole === "etudiant")      role = "STUDENT";
    else if (rawRole === "professeur") role = "MENTOR";
    else if (rawRole === "admin")     role = "ADMIN";     // ← new


    const userData = {
        name: name,
        email: email,
        password: password,
        role: role
    };

    console.log("Données envoyées : ", userData);

    fetch("http://localhost:8082/api/users/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        // Vérifie si le type de contenu est JSON
        const contentType = response.headers.get("Content-Type");

        if (response.ok) {
            if (contentType && contentType.includes("application/json")) {
                return response.json(); // Parse la réponse comme JSON
            } else {
                return response.text(); // Si ce n'est pas du JSON, le traiter comme texte
            }
        } else {
            return response.text().then(text => {
                throw new Error(text); // Si la réponse n'est pas OK, renvoyer l'erreur
            });
        }
    })
    .then(data => {
        console.log("Réponse du serveur : ", data);
        
        // Si la réponse est un message texte (par exemple "Utilisateur créé avec succès !")
        if (typeof data === "string" && data.includes("Utilisateur créé avec succès !")) {
            alert(data); // Affiche le message de succès
            window.location.href = "./login.html"; 
        } else if (data && data.message) {
            alert("Erreur : " + data.message); // Affiche une erreur si elle est dans le format JSON
        } else {
            alert("Erreur inconnue");
        }
    })
    .catch(error => {
        console.error("Erreur:", error.message);
        alert("Une erreur est survenue lors de l'inscription. Détails : " + error.message);
    });
});
