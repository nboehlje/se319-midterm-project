document.addEventListener("DOMContentLoaded", () => {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const {
                gameAreaWidth,
                gameAreaHeight,
                playerSpeed,
                bulletSpeed,
                enemySpeed,
                enemySpawnInterval,
                playerHealth,
                playerDamage,
                enemyHealth
            } = config.gameSettings;

            const gameArea = document.getElementById('gameArea');
            let currentPlayerHealth = playerHealth;

            if (!gameArea) {
                console.error("gameArea element not found!");
                return;
            }

            let score = 0;
            gameArea.style.width = `${gameAreaWidth}px`;
            gameArea.style.height = `${gameAreaHeight}px`;
            gameArea.style.position = 'relative';
            gameArea.style.overflow = 'hidden';

            const player = document.createElement('img');
            player.src = './styles/images/spaceship.png';
            player.id = 'player';
            gameArea.appendChild(player);

            const healthElement = document.createElement('div');
            healthElement.id = 'health';
            healthElement.innerText = `Health: ${currentPlayerHealth}`;
            gameArea.appendChild(healthElement);

            const scoreElement = document.createElement('div');
            scoreElement.id = 'score';
            scoreElement.innerText = 'Score: 0';
            gameArea.appendChild(scoreElement);

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

            function movePlayer() {
                const currentLeft = parseInt(window.getComputedStyle(player).left);
                if (moveLeft && currentLeft > 0) player.style.left = `${currentLeft - playerSpeed}px`;
                if (moveRight && currentLeft < gameAreaWidth - 50) player.style.left = `${currentLeft + playerSpeed}px`;
            }

            function shootBullet() {
                const bullet = document.createElement('div');
                bullet.classList.add('bullet');
                bullet.style.left = `${parseInt(window.getComputedStyle(player).left) + 20}px`;
                bullet.style.bottom = '60px';
                gameArea.appendChild(bullet);
            }

            function moveBullets() {
                const bullets = document.querySelectorAll('.bullet');
                bullets.forEach(bullet => {
                    const bulletBottom = parseInt(window.getComputedStyle(bullet).bottom);
                    if (bulletBottom > gameAreaHeight) {
                        bullet.remove();
                    } else {
                        bullet.style.bottom = `${bulletBottom + bulletSpeed}px`;
                    }
                });
            }

            // Create meteors that fall
            function createMeteor() {
                const meteor = document.createElement('img');
                meteor.src = './styles/images/meteor.png';
                meteor.classList.add('enemy');
                meteor.style.left = `${Math.random() * (gameAreaWidth - 100)}px`; // Random spawn location
                meteor.style.top = '0px'; // Start at the top
                meteor.dataset.type = 'meteor'; // Mark it as a meteor
                gameArea.appendChild(meteor);
            }

            // Create enemy spaceships that are stationary at the top and shoot at the player
            function createEnemySpaceship() {
                const spaceship = document.createElement('img');
                spaceship.src = './styles/images/enemySpaceship.webp';
                spaceship.classList.add('enemySpaceship');
                spaceship.dataset.health = enemyHealth; // Assign health to spaceship
                spaceship.dataset.type = 'spaceship'; // Mark it as a spaceship
                spaceship.style.top = '0px'; // Stay at the top

                // Ensure spaceships spawn at random positions without overlap
                let randomLeft;
                let overlapping;
                do {
                    randomLeft = Math.floor(Math.random() * (gameAreaWidth - 50));
                    overlapping = false;
                    const spaceships = document.querySelectorAll('.enemySpaceship');
                    spaceships.forEach(otherSpaceship => {
                        const otherLeft = parseInt(window.getComputedStyle(otherSpaceship).left);
                        if (Math.abs(randomLeft - otherLeft) < 50) {
                            overlapping = true;
                        }
                    });
                } while (overlapping);

                spaceship.style.left = `${randomLeft}px`;
                gameArea.appendChild(spaceship);

                shootAtPlayer(spaceship); // Spaceship starts shooting
            }

            // Spaceships shoot bullets at the player every 1.5 seconds
            function shootAtPlayer(spaceship) {
                setInterval(() => {
                    const enemyBullet = document.createElement('div');
                    enemyBullet.classList.add('enemyBullet');
                    enemyBullet.style.left = `${parseInt(window.getComputedStyle(spaceship).left) + 20}px`;
                    enemyBullet.style.top = `${parseInt(window.getComputedStyle(spaceship).top) + 60}px`; // Adjust starting position of bullet
                    gameArea.appendChild(enemyBullet);
                }, 1500); // Enemy shoots every 1.5 seconds
            }

            // Move enemy bullets
            function moveEnemyBullets() {
                const enemyBullets = document.querySelectorAll('.enemyBullet');
                enemyBullets.forEach(bullet => {
                    const bulletTop = parseInt(window.getComputedStyle(bullet).top);
                    if (bulletTop > gameAreaHeight) {
                        bullet.remove(); // Remove if bullet goes off screen
                    } else if (detectBulletCollision(bullet, player)) {
                        bullet.remove();
                        takeDamage(playerDamage); // Player takes damage
                    } else {
                        bullet.style.top = `${bulletTop + bulletSpeed}px`; // Move bullet downward
                    }
                });
            }

            // Detect bullet collisions
            function detectBulletCollision(bullet, target) {
                const bulletRect = bullet.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
                return (
                    bulletRect.left < targetRect.right &&
                    bulletRect.right > targetRect.left &&
                    bulletRect.top < targetRect.bottom &&
                    bulletRect.bottom > targetRect.top
                );
            }

            function moveEnemies() {
                const enemies = document.querySelectorAll('.enemy');
                enemies.forEach(enemy => {
                    const enemyTop = parseInt(window.getComputedStyle(enemy).top);

                    // Only meteors should fall
                    if (enemy.dataset.type === 'meteor') {
                        if (enemyTop > gameAreaHeight - 50) {
                            endGame(); // End game if meteor reaches bottom
                        } else {
                            enemy.style.top = `${enemyTop + enemySpeed}px`; // Move meteor down
                        }
                    }
                });
            }

            function takeDamage(amount) {
                currentPlayerHealth -= amount;
                if (currentPlayerHealth <= 0) {
                    endGame();
                } else {
                    updateHealth();
                }
            }

            function updateHealth() {
                healthElement.innerText = `Health: ${currentPlayerHealth}`;
            }

            // Detect collisions between player's bullets and enemies
            function detectCollisions() {
                const bullets = document.querySelectorAll('.bullet');
                const enemies = document.querySelectorAll('.enemy, .enemySpaceship');

                bullets.forEach(bullet => {
                    const bulletRect = bullet.getBoundingClientRect();
                    enemies.forEach(enemy => {
                        const enemyRect = enemy.getBoundingClientRect();
                        if (
                            bulletRect.left < enemyRect.right &&
                            bulletRect.right > enemyRect.left &&
                            bulletRect.top < enemyRect.bottom &&
                            bulletRect.bottom > enemyRect.top
                        ) {
                            bullet.remove();
                            let enemyCurrentHealth = parseInt(enemy.dataset.health) || 1; // Meteors don't have health, spaceships do
                            enemyCurrentHealth -= 1;
                            if (enemyCurrentHealth <= 0) {
                                enemy.remove();
                                score += 100;
                                updateScore();
                            } else {
                                enemy.dataset.health = enemyCurrentHealth; // Update spaceship health
                            }
                        }
                    });
                });
            }

            function updateScore() {
                scoreElement.innerText = `Score: ${score}`;
            }

            function gameLoop() {
                movePlayer();
                moveBullets();
                moveEnemies(); // Only meteors move, spaceships stay stationary
                moveEnemyBullets();
                detectCollisions();
                requestAnimationFrame(gameLoop);
            }

            function endGame() {
                alert("Game over! Your score is: " + score);
                location.reload();
            }

            // Spawn meteors every 2 seconds and spaceships every 10 seconds
            setInterval(createMeteor, 2000);
            setInterval(createEnemySpaceship, 10000);

            gameLoop();
        });
});
