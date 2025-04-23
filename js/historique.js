document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Récupérer l'historique depuis le backend
        const response = await fetch('http://localhost:8082/api/attempts/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            // Si erreur, utiliser l'historique local
            afficherHistoriqueLocal();
            return;
        }

        const attempts = await response.json();
        const tbody = document.querySelector("#historiqueTable tbody");
        tbody.innerHTML = "";

        if (attempts.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3'>Aucun résultat enregistré.</td></tr>";
            return;
        }

        for (const attempt of attempts) {
            // Pour chaque tentative, récupérer les détails de l'étudiant et de l'examen
            const [studentResponse, examResponse] = await Promise.all([
                fetch(`http://localhost:8082/api/users/${attempt.studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch(`http://localhost:8082/api/exams/${attempt.examId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            const student = await studentResponse.json();
            const exam = await examResponse.json();

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${student.name || student.email}</td>
                <td>${attempt.score != null ? attempt.score : 'Non noté'} / 20</td>
                <td>${new Date(attempt.startedAt).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        }
    } catch (error) {
        console.error("Erreur:", error);
        afficherHistoriqueLocal();
    }
});

function afficherHistoriqueLocal() {
    const tbody = document.querySelector("#historiqueTable tbody");
    const historique = JSON.parse(localStorage.getItem("historiqueQCM")) || [];

    if (historique.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>Aucun résultat enregistré.</td></tr>";
        return;
    }

    tbody.innerHTML = "";
    historique.forEach(entry => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${entry.nom}</td>
            <td>${entry.note} / 20</td>
            <td>${entry.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function effacerHistorique() {
    if (confirm("Êtes-vous sûr de vouloir effacer l'historique ?")) {
        localStorage.removeItem("historiqueQCM");
        window.location.reload();
    }
}
