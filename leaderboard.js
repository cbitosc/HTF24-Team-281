// Function to fetch scores from local storage
function fetchScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    updateScoreTable(scores);
}

// Function to update the score table
function updateScoreTable(scores) {
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = ''; // Clear existing scores

    scores.forEach(score => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${score.teamId}</td>
            <td>${score.rounds ? score.rounds[0] || 0 : 0}</td>
            <td>${score.rounds ? score.rounds[1] || 0 : 0}</td>
            <td>${score.rounds ? score.rounds[2] || 0 : 0}</td>
            <td>${score.totalScore || 0}</td>
        `;
        scoreList.appendChild(row);
    });
}

// Function to handle score submission
function addScore(event) {
    event.preventDefault();

    const teamId = document.getElementById('teamId').value.trim();
    const round = parseInt(document.getElementById('round').value) - 1; // Convert to zero-based index
    const score = parseInt(document.getElementById('score').value);

    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    // Check if the team already has an entry
    const existingScoreIndex = scores.findIndex(s => s.teamId === teamId);
    if (existingScoreIndex > -1) {
        // Ensure rounds array exists before updating
        if (!scores[existingScoreIndex].rounds) {
            scores[existingScoreIndex].rounds = [0, 0, 0]; // Initialize rounds if undefined
        }
        scores[existingScoreIndex].rounds[round] = score; // Update the round score
    } else {
        // Create a new entry if it doesn't exist
        const newEntry = { teamId, rounds: [0, 0, 0], totalScore: 0 };
        newEntry.rounds[round] = score; // Set the score for the current round
        scores.push(newEntry);
    }

    // Update total scores
    scores.forEach(score => {
        score.totalScore = (score.rounds || []).reduce((a, b) => (a || 0) + (b || 0), 0);
    });

    localStorage.setItem('scores', JSON.stringify(scores)); // Save scores to local storage
    fetchScores(); // Refresh the displayed scores
}

// Event listeners
document.getElementById('refresh').addEventListener('click', fetchScores);
document.getElementById('add-form').addEventListener('submit', addScore);

// Initial fetch
fetchScores();

