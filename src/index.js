document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById('gameArea');
    
    if (!gameArea) {
        console.error("gameArea element not found!");
        return;
    }

    const gameAreaWidth = 800;
    const gameAreaHeight = 600;
    const playerSpeed = 5;
    const bulletSpeed = 7;
    const enemySpeed = 2;
    let score = 0;

    gameArea.style.width = `${gameAreaWidth}px`;
    gameArea.style.height = `${gameAreaHeight}px`;
    gameArea.style.position = 'relative';
    gameArea.style.backgroundImage = "url('./styles/images/background.jpg')";
    gameArea.style.overflow = 'hidden';

    const player = document.createElement('img');
    player.src = './styles/images/spaceship.png';
    player.style.position = 'absolute';
    player.style.bottom = '10px';
    player.style.left = `${gameAreaWidth / 2 - 25}px`;
    player.style.width = '50px';
    gameArea.appendChild(player);

    let moveLeft = false;
    let moveRight = false;

    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft') moveLeft = true;
        if (e.code === 'ArrowRight') moveRight = true;
        if (e.code === 'Space') shootBullet();
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft') moveLeft = false;
        if (e.code === 'ArrowRight') moveRight = false;
    });