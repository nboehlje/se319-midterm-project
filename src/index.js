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
            let bonusShots = 0; // Track the number of bonus shots
            let score = 0; // Player score

            if (!gameArea) {
                console.error("gameArea element not found!");
                return;
            }

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
                // Always shoot the regular bullet
                const bullet = document.createElement('div');
                bullet.classList.add('bullet');
                bullet.style.left = `${parseInt(window.getComputedStyle(player).left) + 20}px`;
                bullet.style.bottom = '60px';
                gameArea.appendChild(bullet);

                // Shoot additional bullets based on bonusShots
                for (let i = 0; i < bonusShots; i++) {
                    const bonusBullet = document.createElement('div');
                    bonusBullet.classList.add('bullet');
                    bonusBullet.style.left = `${parseInt(window.getComputedStyle(player).left) - (i + 1) * 10}px`; // Shoot from left side
                    bonusBullet.style.bottom = '60px';
                    gameArea.appendChild(bonusBullet);
                }
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

            function createMeteor() {
                const meteor = document.createElement('img');
                meteor.src = './styles/images/meteor.png';
                meteor.classList.add('enemy');
                meteor.style.left = `${Math.random() * (gameAreaWidth - 100)}px`;
                meteor.style.top = '0px';
                meteor.dataset.type = 'meteor';
                gameArea.appendChild(meteor);
            }

            function createEnemySpaceship() {
                const spaceship = document.createElement('img');
                spaceship.src = './styles/images/enemySpaceship.webp';
                spaceship.classList.add('enemySpaceship');
                spaceship.dataset.health = enemyHealth;
                spaceship.dataset.type = 'spaceship';
                spaceship.style.top = '0px';
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
                shootAtPlayer(spaceship);
            }

            function shootAtPlayer(spaceship) {
                setInterval(() => {
                    const enemyBullet = document.createElement('div');
                    enemyBullet.classList.add('enemyBullet');
                    enemyBullet.style.left = `${parseInt(window.getComputedStyle(spaceship).left) + 20}px`;
                    enemyBullet.style.top = `${parseInt(window.getComputedStyle(spaceship).top) + 60}px`;
                    gameArea.appendChild(enemyBullet);
                }, 1500);
            }

            function moveEnemyBullets() {
                const enemyBullets = document.querySelectorAll('.enemyBullet');
                enemyBullets.forEach(bullet => {
                    const bulletTop = parseInt(window.getComputedStyle(bullet).top);
                    if (bulletTop > gameAreaHeight) {
                        bullet.remove();
                    } else if (detectBulletCollision(bullet, player)) {
                        bullet.remove();
                        takeDamage(playerDamage);
                    } else {
                        bullet.style.top = `${bulletTop + bulletSpeed}px`;
                    }
                });
            }

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
                    if (enemy.dataset.type === 'meteor') {
                        if (enemyTop > gameAreaHeight - 50) {
                            endGame();
                        } else {
                            enemy.style.top = `${enemyTop + enemySpeed}px`;
                        }
                    }
                });
            }

            function moveBonusDrops() {
                const bonuses = document.querySelectorAll('.bonus');
                bonuses.forEach(bonus => {
                    const bonusTop = parseInt(window.getComputedStyle(bonus).top);
                    if (bonusTop > gameAreaHeight) {
                        bonus.remove(); // Remove if it goes off screen
                    } else {
                        bonus.style.top = `${bonusTop + enemySpeed + 10}px`; // Move the bonus down
                    }

                    // Check collision with player
                    if (detectBulletCollision(bonus, player)) {
                        bonusShots += 1; // Increase the bonus shots
                        bonus.remove(); // Remove the bonus after collecting it
                    }
                });
            }

            function spawnBonusDrop() {
                const bonus = document.createElement('div');
                bonus.classList.add('bonus');
                bonus.style.width = '30px';
                bonus.style.height = '30px';
                bonus.style.position = 'absolute';
                bonus.style.left = `${Math.random() * (gameAreaWidth - 30)}px`;
                bonus.style.top = '0px'; // Start at the top
                bonus.style.backgroundColor = 'blue'; // Bonus color
                gameArea.appendChild(bonus);
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
                            let enemyCurrentHealth = parseInt(enemy.dataset.health) || 1;
                            enemyCurrentHealth -= 1;
                            if (enemyCurrentHealth <= 0) {
                                enemy.remove();
                                score += 100;
                                updateScore();
                                if (score % 500 === 0 && !document.querySelector('.bonus')) { // Check score for bonus drop every 500
                                    spawnBonusDrop(); // Spawn bonus drop if score is a multiple of 500
                                }
                            } else {
                                enemy.dataset.health = enemyCurrentHealth;
                            }
                        }
                    });
                });
            }

            function updateScore() {
                scoreElement.innerText = `Score: ${score}`;
            }

            function endGame() {
                const gameOverDiv = document.createElement('div');
                gameOverDiv.id = 'gameOverDiv';
                gameOverDiv.innerHTML = `
                    <div class="gameOverModal">
                        <p>Game over! Your score is: ${score}. What would you like to do?</p>
                        <button id="submitScoreBtn">Submit Score</button>
                        <button id="goToLeaderboardBtn">No, take me to leaderboard</button>
                    </div>
                `;
                document.body.appendChild(gameOverDiv);
                document.getElementById('submitScoreBtn').addEventListener('click', () => {
                    const playerName = prompt("Enter your name to submit your score:");
                    if (playerName) {
                        postScoreToLeaderboard(playerName, score);
                    } else {
                        alert("You must enter a name to submit your score.");
                    }
                });
                document.getElementById('goToLeaderboardBtn').addEventListener('click', () => {
                    window.location.href = '/leaderboard.html';
                });
            }

            function postScoreToLeaderboard(playerName, score) {
                const playerData = { playerName, score };
                fetch('/submit-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(playerData),
                })
                .then(response => response.json())
                .then(data => {
                    alert('Score submitted successfully!');
                    window.location.href = '/leaderboard.html';
                })
                .catch(error => console.error('Error submitting score:', error));
            }

            setInterval(createMeteor, 2000);
            setInterval(createEnemySpaceship, 10000);
            setInterval(moveBonusDrops, 100); // Check bonus drops frequently

            gameLoop();

            function gameLoop() {
                movePlayer();
                moveBullets();
                moveEnemies();
                moveEnemyBullets();
                detectCollisions();
                requestAnimationFrame(gameLoop);
            }
        });
});
