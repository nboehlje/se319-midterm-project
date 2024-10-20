
/**
 * Appends a player's record to the leaderboard in the DOM  
 * @param {Object} player 
 */
const appendPlayerData = (player) => {
    const tableBody = document.getElementById("player-append-area"); 
    const tableRow = document.createElement("tr"); 
    tableRow.innerHTML = `
        <th scope="row">${player.position}</th>
        <th scope="col">${player.score}</th>
        <td>
            <img class="border rounded-circle" width="30px" src="${player.img}"/>
            ${player.userName}
        </td>
    `; 
    tableBody.appendChild(tableRow); 
}

/**
 * Updates the leaderboard on the page, given an array 
 * of player data.  
 * @param {Array<Object>} leaderboardData 
 */
const updateLeaderboard = (leaderboardData) => { 
    console.log(leaderboardData); 
    leaderboardData.forEach(player => appendPlayerData(player)); 
}

/**
 * Uses the Fetch API to make an AJAX request to get 
 * the top ten player's data. 
 */
const loadLeaderboard = async () => {
    try { 
        const response = await fetch("./leaderboard.json");
        if (!response.ok) { 
            throw new Error(`Response status: ${response.status}`); 
        }

        const json = await response.json(); 
        updateLeaderboard(json.globalLeaderboard); 
    } catch (error) { 
        console.error(error.message); 
    }
}


document.addEventListener("DOMContentLoaded", async (event) => {
    await loadLeaderboard(); 
}); 

