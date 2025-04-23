document.addEventListener("DOMContentLoaded", function () {
    const configForm = document.getElementById("qcmConfigForm");
    const questionsForm = document.getElementById("qcmQuestionsForm");
    const questionsContainer = document.getElementById("questionsContainer");
  
    let nombreQuestions = 0;
  
    configForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const titre = document.getElementById("titre").value.trim();
      nombreQuestions = parseInt(document.getElementById("nombreQuestions").value);
  
      if (!titre || isNaN(nombreQuestions) || nombreQuestions <= 0) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
      }
  
      configForm.style.display = "none";
      questionsForm.style.display = "block";
  
      questionsContainer.innerHTML = ""; // Réinitialiser
  
      for (let i = 1; i <= nombreQuestions; i++) {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-block");
  
        questionDiv.innerHTML = `
          <h4>Question ${i}</h4>
          <input type="text" name="question${i}" placeholder="Texte de la question" required><br>
          <input type="text" name="choix${i}_1" placeholder="Choix 1" required>
          <input type="text" name="choix${i}_2" placeholder="Choix 2" required>
          <input type="text" name="choix${i}_3" placeholder="Choix 3" required>
          <input type="text" name="choix${i}_4" placeholder="Choix 4" required><br>
          <label>Bonne réponse :</label>
          <select name="bonneReponse${i}" required>
            <option value="">--Choisir--</option>
            <option value="1">Choix 1</option>
            <option value="2">Choix 2</option>
            <option value="3">Choix 3</option>
            <option value="4">Choix 4</option>
          </select>
          <hr>
        `;
  
        questionsContainer.appendChild(questionDiv);
      }
    });
  
    questionsForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const titre = document.getElementById("titre").value.trim();
      const duration = document.getElementById("qcmDuration").value;
      const niveau = document.getElementById("niveau").value;
  
      const questions = [];
  
      for (let i = 1; i <= nombreQuestions; i++) {
        const questionText = document.querySelector(`input[name="question${i}"]`).value.trim();
        const choix1 = document.querySelector(`input[name="choix${i}_1"]`).value.trim();
        const choix2 = document.querySelector(`input[name="choix${i}_2"]`).value.trim();
        const choix3 = document.querySelector(`input[name="choix${i}_3"]`).value.trim();
        const choix4 = document.querySelector(`input[name="choix${i}_4"]`).value.trim();
        const bonneReponse = document.querySelector(`select[name="bonneReponse${i}"]`).value;
  
        if (!questionText || !choix1 || !choix2 || !choix3 || !choix4 || !bonneReponse) {
          alert(`Veuillez remplir tous les champs pour la question ${i}`);
          return;
        }
  
        questions.push({
          question: questionText,
          choix: [choix1, choix2, choix3, choix4],
          bonneReponse: parseInt(bonneReponse)
        });
      }
  
      // Données du QCM complet
      const qcm = {
        titre,
        niveau,
        duration,
        questions
      };
  
      console.log("QCM enregistré :", qcm);
  
      // Tu peux ici faire un envoi vers un backend via fetch() si besoin
      alert("QCM enregistré avec succès !");
      window.location.href = "dashboard-professeur.html";
    });
  });
  