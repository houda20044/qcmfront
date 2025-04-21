document.getElementById("qcmConfigForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const titre = document.getElementById("titre").value;
    const nombreQuestions = parseInt(document.getElementById("nombreQuestions").value);
  
    const container = document.getElementById("questionsContainer");
    container.innerHTML = ""; // Reset
  
    for (let i = 1; i <= nombreQuestions; i++) {
      container.innerHTML += `
        <div class="question-block">
          <h3>Question ${i}</h3>
          <textarea placeholder="Énoncé de la question" required></textarea>
          <input type="text" placeholder="Choix A" required>
          <input type="text" placeholder="Choix B" required>
          <input type="text" placeholder="Choix C" required>
          <input type="text" placeholder="Choix D" required>
          <select required>
            <option value="">Bonne réponse</option>
            <option value="A">Choix A</option>
            <option value="B">Choix B</option>
            <option value="C">Choix C</option>
            <option value="D">Choix D</option>
          </select>
          <hr>
        </div>
      `;
    }
  
    // Cacher config, afficher questions
    document.getElementById("qcmConfigForm").style.display = "none";
    document.getElementById("qcmQuestionsForm").style.display = "block";
  
    // Enregistrer titre globalement
    document.getElementById("qcmQuestionsForm").dataset.titre = titre;
  });
  
  document.getElementById("qcmQuestionsForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const titre = e.target.dataset.titre;
    const blocks = document.querySelectorAll(".question-block");
  
    const questions = Array.from(blocks).map(block => {
      const inputs = block.querySelectorAll("input, textarea, select");
  
      return {
        question: inputs[0].value,
        choix: {
          A: inputs[1].value,
          B: inputs[2].value,
          C: inputs[3].value,
          D: inputs[4].value
        },
        bonneReponse: inputs[5].value
      };
    });
  
    const qcm = {
      titre,
      questions
    };
  
    let qcms = JSON.parse(localStorage.getItem("qcms")) || [];
    qcms.push(qcm);
    localStorage.setItem("qcms", JSON.stringify(qcms));
  
    alert("QCM enregistré avec succès !");
    window.location.href = "dashboard-professeur.html";
  });
  