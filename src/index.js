
/**
 * Appends a game element to the DOM  
 * @param {Object} gameElement 
 */
const appendGameElement = (gameElement) => {
    console.log("hi there"); 
    const flexDiv = document.getElementById("ge-append-area"); 
    const h5 = document.createElement("h5"); 
    h5.classList = "border text-center p-4"; 
    h5.innerHTML = `
        <img width="40px" src="${gameElement.img}" />
        ${gameElement.description}
    `; 
    flexDiv.appendChild(h5); 
}

/**
 * Updates the game elements displayed on the page
 * when passed an array of objects containing game 
 * element data. 
 * @param {Array<Object>} gameElements 
 */
const updateGameElements = (gameElements) => { 
    console.log(gameElements); 
    gameElements.forEach(ge => appendGameElement(ge)); 
}

/**
 * Uses the Fetch API to make an AJAX request to get 
 * all the game elements (photos of in-game assets) 
 * that are encountered in the game. 
 */
const loadGameElements = async () => {
    try { 
        const response = await fetch("./index.json");
        if (!response.ok) { 
            throw new Error(`Response status: ${response.status}`); 
        }

        const json = await response.json(); 
        updateGameElements(json.gameElements); 
    } catch (error) { 
        console.error(error.message); 
    }
}


document.addEventListener("DOMContentLoaded", async (event) => {
    await loadGameElements(); 
}); 

