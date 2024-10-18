document.addEventListener('DOMContentLoaded', () => {
    const leaderboardList = document.getElementById('leaderboard');

    function fetchLeaderboard() {
        fetch('/leaderboard')
            .then(response => response.json())
            .then(data => {
                leaderboardList.innerHTML = '';
                data.forEach((entry, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `#${index + 1} ${entry.playerName} - ${entry.score} points`;
                    leaderboardList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    }

    // Fetch leaderboard on page load
    fetchLeaderboard();
});
