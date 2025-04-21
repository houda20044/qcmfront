const questions = [
  {
    question: "Quel langage est utilisé pour créer des pages web ?",
    options: ["Python", "HTML", "C++", "Java"],
    answer: "HTML"
  },
  {
    question: "Lequel est un système d’exploitation ?",
    options: ["Chrome", "Linux", "Python", "HTML"],
    answer: "Linux"
  },
  {
    question: "Quelle extension pour les fichiers JavaScript ?",
    options: [".java", ".js", ".py", ".html"],
    answer: ".js"
  }
];

const form = document.getElementById("qcmForm");

questions.forEach((q, index) => {
  const qBlock = document.createElement("div");
  qBlock.classList.add("form-group");
  qBlock.innerHTML = `<p><strong>Q${index + 1}. ${q.question}</strong></p>`;
  q.options.forEach(opt => {
    const id = `q${index}_${opt}`;
    qBlock.innerHTML += `
      <div>
        <input type="radio" name="q${index}" id="${id}" value="${opt}" required>
        <label for="${id}">${opt}</label>
      </div>
    `;
  });
  form.appendChild(qBlock);
});

function submitQCM() {
  let score = 0;
  questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.answer) {
      score++;
    }
  });

  const finalNote = (score / questions.length) * 20;
  document.getElementById("score").innerText = `Votre note : ${finalNote.toFixed(2)} / 20`;

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user && user.role === "etudiant") {
    const historique = JSON.parse(localStorage.getItem("historiqueQCM")) || [];

    const nouvelleNote = {
      nom: user.nom || user.email,
      email: user.email,
      note: finalNote.toFixed(2),
      date: new Date().toLocaleString()
    };

    historique.push(nouvelleNote);
    localStorage.setItem("historiqueQCM", JSON.stringify(historique));
  }
}
