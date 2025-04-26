// Fonction utilitaire pour les requêtes API
async function apiFetch(url, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    options.headers = {
        ...defaultHeaders,
        ...options.headers
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorDetail = await response.text();
            throw new Error(errorDetail || `Erreur HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de l'appel à ${url}:`, error.message);
        throw error;
    }
}

// Fonction pour charger les examens disponibles
async function loadExams() {
    try {
        const exams = await apiFetch('http://localhost:8082/api/exams/exams');
        const selectExam = document.getElementById('examSelect');
        exams.forEach(exam => {
            const option = document.createElement('option');
            option.value = exam.id;
            option.textContent = exam.title;
            selectExam.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des examens :', error);
    }
}

// Variables globales
let currentExamId = null;
let questions = [];
let currentQuestionIndex = 0;
let attemptId = null;

document.getElementById('startExamBtn').addEventListener('click', async () => {
    currentExamId = document.getElementById('examSelect').value;
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const attempt = await apiFetch('http://localhost:8082/api/attempts/create', {
            method: 'POST',
            body: JSON.stringify({ examId: currentExamId, studentId: user.id })
        });

        attemptId = attempt.id;

        questions = await apiFetch(`http://localhost:8082/api/questions/exam/${currentExamId}`);
        currentQuestionIndex = 0;
        showQuestion();
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'examen :', error);
    }
});

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.text;

    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    question.choices.forEach(choice => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="choice" value="${choice.id}"> ${choice.text}`;
        choicesContainer.appendChild(label);
    });

    document.getElementById('questionContainer').style.display = 'block';
}

document.getElementById('nextQuestionBtn').addEventListener('click', async () => {
    const selectedChoice = document.querySelector('input[name="choice"]:checked');
    if (!selectedChoice) {
        alert('Veuillez sélectionner une réponse.');
        return;
    }

    try {
        await apiFetch('http://localhost:8082/api/responses/create', {
            method: 'POST',
            body: JSON.stringify({
                attemptId: attemptId,
                questionId: questions[currentQuestionIndex].id,
                choiceId: selectedChoice.value
            })
        });

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            alert('Examen terminé !');
            document.getElementById('questionContainer').style.display = 'none';
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la réponse :', error);
    }
});

// Initialisation
loadExams();
