document.addEventListener("DOMContentLoaded", () => {
    let meteorSpawnInterval;
    let enemySpaceshipSpawnInterval;

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
            let bonusShots = 0;
            let score = 0;
            let nextBonusScore = 500;
            let nextHealthDropScore = 750;

            meteorSpawnInterval = 2000;
            enemySpaceshipSpawnInterval = 10000;

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
                const bullet = document.createElement('div');
                bullet.classList.add('bullet');
                bullet.style.left = `${parseInt(window.getComputedStyle(player).left) + 20}px`;
                bullet.style.bottom = '60px';
                gameArea.appendChild(bullet);

                for (let i = 0; i < bonusShots; i++) {
                    const bonusBullet = document.createElement('div');
                    bonusBullet.classList.add('bullet');
                    bonusBullet.style.left = `${parseInt(window.getComputedStyle(player).left) - (i + 1) * 10}px`;
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
                spaceship.style.position = 'absolute';
                spaceship.style.top = '0px';
                gameArea.appendChild(spaceship);

                spaceship.onload = () => {
                    const spaceshipWidth = spaceship.offsetWidth;
                    const gameAreaWidth = gameArea.offsetWidth;
                    let randomLeft = Math.floor(Math.random() * (gameAreaWidth - spaceshipWidth));
                    spaceship.style.left = `${randomLeft}px`;
                    shootAtPlayer(spaceship);
                };

                spaceship.onerror = () => {
                    console.error("Failed to load spaceship image.");
                };
            }

            function shootAtPlayer(spaceship) {
                setInterval(() => {
                    const enemyBulletMiddle = document.createElement('div');
                    enemyBulletMiddle.classList.add('enemyBullet');
                    enemyBulletMiddle.style.left = `${parseInt(window.getComputedStyle(spaceship).left) + 20}px`;
                    enemyBulletMiddle.style.top = `${parseInt(window.getComputedStyle(spaceship).top) + 60}px`;
                    gameArea.appendChild(enemyBulletMiddle);

                    if (score >= 1000) {
                        const enemyBulletLeft = document.createElement('div');
                        enemyBulletLeft.classList.add('enemyBullet');
                        enemyBulletLeft.style.left = `${parseInt(window.getComputedStyle(spaceship).left)}px`;
                        enemyBulletLeft.style.top = `${parseInt(window.getComputedStyle(spaceship).top) + 60}px`;
                        enemyBulletLeft.dataset.direction = 'left';
                        gameArea.appendChild(enemyBulletLeft);

                        const enemyBulletRight = document.createElement('div');
                        enemyBulletRight.classList.add('enemyBullet');
                        enemyBulletRight.style.left = `${parseInt(window.getComputedStyle(spaceship).left) + 40}px`;
                        enemyBulletRight.style.top = `${parseInt(window.getComputedStyle(spaceship).top) + 60}px`;
                        enemyBulletRight.dataset.direction = 'right';
                        gameArea.appendChild(enemyBulletRight);
                    }
                }, 1500);
            }

            function moveEnemyBullets() {
                const enemyBullets = document.querySelectorAll('.enemyBullet');
                enemyBullets.forEach(bullet => {
                    const bulletTop = parseInt(window.getComputedStyle(bullet).top);
                    let bulletLeft = parseInt(window.getComputedStyle(bullet).left);
            
                    // Apply direction for boss bullets
                    const directionX = parseFloat(bullet.dataset.directionX || 0);
                    const directionY = parseFloat(bullet.dataset.directionY || 1); // Defaults to straight down
            
                    bulletLeft += directionX * 5; // Adjust speed for horizontal movement
                    const newBulletTop = bulletTop + directionY * 5; // Adjust speed for vertical movement
            
                    if (newBulletTop > gameAreaHeight) {
                        bullet.remove();
                    } else if (detectBulletCollision(bullet, player)) {
                        bullet.remove();
                        takeDamage(playerDamage);
                    } else {
                        bullet.style.top = `${newBulletTop}px`;
                        bullet.style.left = `${bulletLeft}px`;
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
                            // Meteor reaches player level or bottom of the screen
                            takeDamage(25);  // Take 25 HP damage
                            enemy.remove();  // Remove the meteor from the screen
                        } else {
                            // Move the meteor downward
                            enemy.style.top = `${enemyTop + enemySpeed}px`;
                        }
                    }
                });
            }
            

            function moveBonusDrops() {
                const bonuses = document.querySelectorAll('.bonus, .healthDrop');
                bonuses.forEach(bonus => {
                    const bonusTop = parseInt(window.getComputedStyle(bonus).top);
                    if (bonusTop > gameAreaHeight) {
                        bonus.remove();
                    } else {
                        bonus.style.top = `${bonusTop + enemySpeed + 15}px`;
                    }

                    if (detectBulletCollision(bonus, player)) {
                        if (bonus.classList.contains('bonus')) {
                            bonusShots += 1;
                        } else if (bonus.classList.contains('healthDrop')) {
                            currentPlayerHealth = Math.min(playerHealth, currentPlayerHealth + 25);
                            updateHealth();
                        }
                        bonus.remove();
                    }
                });
            }

            function spawnBonusDrop() {
                const bonus = document.createElement('img');
                bonus.src = './styles/images/damageDrop.webp'; // Use the damageDrop image
                bonus.classList.add('bonus');
                bonus.style.width = '30px';
                bonus.style.height = '30px';
                bonus.style.position = 'absolute';
                bonus.style.left = `${Math.random() * (gameAreaWidth - 30)}px`;
                bonus.style.top = '0px';
                gameArea.appendChild(bonus);
            }

            function spawnHealthDrop() {
                const healthDrop = document.createElement('img');
                healthDrop.src = './styles/images/healthDrop.webp'; // Use the healthDrop image
                healthDrop.classList.add('healthDrop');
                healthDrop.style.width = '30px';
                healthDrop.style.height = '30px';
                healthDrop.style.position = 'absolute';
                healthDrop.style.left = `${Math.random() * (gameAreaWidth - 30)}px`;
                healthDrop.style.top = '0px';
                gameArea.appendChild(healthDrop);
            }

            function takeDamage(amount) {
                currentPlayerHealth -= amount; // Reduce health by the damage amount
                if (currentPlayerHealth <= 0) {
                    endGame(); // If health reaches zero, end the game
                } else {
                    updateHealth(); // Otherwise, just update the health display
                }
            }
            function updateHealth() {
                healthElement.innerText = `Health: ${currentPlayerHealth}`;
            }
            
            function detectCollisions() {
                const bullets = document.querySelectorAll('.bullet');
                const boss = document.getElementById('boss');
                const enemies = document.querySelectorAll('.enemy, .enemySpaceship');
                bullets.forEach(bullet => {
                    const bulletRect = bullet.getBoundingClientRect();

                    if (boss) {
                        const bossRect = boss.getBoundingClientRect();
                        if (
                            bulletRect.left < bossRect.right &&
                            bulletRect.right > bossRect.left &&
                            bulletRect.top < bossRect.bottom &&
                            bulletRect.bottom > bossRect.top
                        ) {
                            bullet.remove();
                            let bossHealth = parseInt(boss.dataset.health) || 100;
                            bossHealth -= 1;
                            if (bossHealth <= 0) {
                                boss.remove();
                                alert('You defeated the boss!');
                            } else {
                                boss.dataset.health = bossHealth;
                            }
                        }
                    }

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

                                if (score >= nextBonusScore) {
                                    spawnBonusDrop();
                                    nextBonusScore += 1000;
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
                
                if (score === 5000) {
                    triggerBossBattle();
                }

                if (score % 1000 === 0 && score !== 0 && score < 5000) {
                    meteorSpawnInterval = Math.max(500, meteorSpawnInterval - 200);
                    enemySpaceshipSpawnInterval = Math.max(5000, enemySpaceshipSpawnInterval - 1000);
                    clearInterval(meteorSpawnTimer);
                    clearInterval(enemySpaceshipSpawnTimer);
                    meteorSpawnTimer = setInterval(createMeteor, meteorSpawnInterval);
                    enemySpaceshipSpawnTimer = setInterval(createEnemySpaceship, enemySpaceshipSpawnInterval);
                }

                if (score >= nextHealthDropScore) {
                    spawnHealthDrop();
                    nextHealthDropScore += 750;
                }

                if (score >= nextBonusScore) {
                    spawnBonusDrop();
                    nextBonusScore += 1000;
                }
            }

            function triggerBossBattle() {
                clearEnemiesAndBullets(); // Clear existing enemies and bullets from the game area
            
                const boss = document.createElement('img');
                boss.src = './styles/images/boss.webp'; // Add a boss image
                boss.id = 'boss';
                boss.style.width = '300px'; // 6 times the size of a 60px enemy spaceship
                boss.style.height = '300px';
                boss.style.position = 'absolute';
                boss.style.top = '0px';
                boss.style.left = `${(gameAreaWidth - 360) / 2}px`; // Center the boss horizontally
                boss.dataset.health = 100; // Takes 100 bullets to kill
                gameArea.appendChild(boss);
            
                moveBoss(boss); // Function to make the boss move back and forth
                bossShooting(boss); // Function for the boss to shoot
            }
            
            function clearEnemiesAndBullets() {
                const enemies = document.querySelectorAll('.enemy, .enemySpaceship, .bullet');
                enemies.forEach(enemy => enemy.remove()); // Remove all enemies and bullets from the screen
            }
            
            function moveBoss(boss) {
                let bossDirection = 1; // 1 for moving right, -1 for moving left
                const bossSpeed = 3; // Adjust speed if necessary
            
                setInterval(() => {
                    const currentLeft = parseInt(window.getComputedStyle(boss).left);
            
                    // Check if the boss hits the right or left edge, then reverse direction
                    if (currentLeft >= gameAreaWidth - boss.offsetWidth) {
                        bossDirection = -1; // Move left
                    } else if (currentLeft <= 0) {
                        bossDirection = 1; // Move right
                    }
            
                    // Update boss position
                    boss.style.left = `${currentLeft + bossSpeed * bossDirection}px`;
                }, 20); // Adjust interval for smoother/faster movement
            }
            
            
            
            

            function bossShooting(boss) {
                setInterval(() => {
                    // Straight down shot (angle 90 degrees is directly downward)
                    const bossBulletDown = createBossBullet(boss, 90);
                    gameArea.appendChild(bossBulletDown);
            
                    // Diagonal left shots
                    const bossBulletDiagLeft1 = createBossBullet(boss, 120); // Slight diagonal left
                    const bossBulletDiagLeft2 = createBossBullet(boss, 135); // More diagonal left
                    gameArea.appendChild(bossBulletDiagLeft1);
                    gameArea.appendChild(bossBulletDiagLeft2);
            
                    // Diagonal right shots
                    const bossBulletDiagRight1 = createBossBullet(boss, 60);  // Slight diagonal right
                    const bossBulletDiagRight2 = createBossBullet(boss, 45);  // More diagonal right
                    gameArea.appendChild(bossBulletDiagRight1);
                    gameArea.appendChild(bossBulletDiagRight2);
                }, 1500); // Boss shoots every 1.5 seconds
            }

            function createBossBullet(boss, angle) {
                const bossBullet = document.createElement('div');
                bossBullet.classList.add('enemyBullet');
                bossBullet.style.left = `${parseInt(window.getComputedStyle(boss).left) + boss.offsetWidth / 2}px`;
                bossBullet.style.top = `${parseInt(window.getComputedStyle(boss).top) + boss.offsetHeight}px`;
            
                // Set the bullet's direction based on the angle (in degrees)
                const radians = angle * (Math.PI / 180);
                bossBullet.dataset.directionX = Math.cos(radians); // Horizontal direction
                bossBullet.dataset.directionY = Math.sin(radians); // Vertical direction (should be downward)
            
                return bossBullet;
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

            let meteorSpawnTimer = setInterval(createMeteor, meteorSpawnInterval);
            let enemySpaceshipSpawnTimer = setInterval(createEnemySpaceship, enemySpaceshipSpawnInterval);
            setInterval(moveBonusDrops, 100);

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
