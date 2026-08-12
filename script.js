const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

// Game state variables
let score = 0;
let lives = 3;
let gameRunning = false;

//Game Start Screen Variables
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

//Game over Screen variables
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton')

// Player (Bin / Defender) properties
const player = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  width: 80,
  height: 20,
  speed: 7,
  dx: 0
};

// Types of waste items
const wasteType = [
  { type: 'paper', color: 'blue', point: 5, speed: 3 },
  { type: 'plastic', color: 'red', point: 10, speed: 4 },
  { type: 'metal', color: 'yellow', point: 15, speed: 5 }
];

// Falling waste item properties
const waste = {
  x: Math.random() * (canvas.width - 20),
  y: 0,
  width: 20,
  height: 20,
  speed: 3,
  type: 'plastic',
  color: 'red',
  point: 10
};

// Update lives HUD

function updateLives(){
  livesElement.textContent ='❤️'.repeat(lives).trim();
};

// Handle keyboard movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    player.dx = -player.speed;
  }
});

document.addEventListener('keyup', (e) => {
  if (
    e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' ||  
    e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'
  ) {
    player.dx = 0;
  }
});

// Update game objects positions
function update() {
  // Move player
  player.x += player.dx;

  // Keep player inside canvas boundaries
  if (player.x < 0) { 
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Move waste down
  waste.y += waste.speed;

  // Collision detection: Player catching the waste
  if (
    waste.y + waste.height >= player.y &&
    waste.y <= player.y + player.height &&
    waste.x + waste.width >= player.x &&
    waste.x <= player.x + player.width
  ) {
    score += waste.point;
    scoreElement.textContent = score;
    resetWaste();
    
  } else if (waste.y > canvas.height) {
    // Waste fell past the basket
    lives--;
    updateLives();
    resetWaste();

    if (lives <= 0) {
      finalScore.textContent = score;
      gameOver.style.display = 'flex';
      gameRunning = false;
    }
  }
}

// Reset waste to the top with a random X position
function resetWaste() {
  waste.y = 0;
  waste.x = Math.random() * (canvas.width - waste.width);

  const randomType = wasteType[
    Math.floor(Math.random() * wasteType.length)
  ];

  waste.type = randomType.type;
  waste.color = randomType.color;
  waste.point = randomType.point;

  // Slight speed scaling as score increases
  const speedBonus = Math.floor(score / 50) * 0.5;
  waste.speed = randomType.speed + speedBonus;
}

// Reset entire game state
function resetGame() {
  score = 0;
  lives = 3;
  player.x = canvas.width / 2 - player.width / 2;
  player.dx = 0;
  scoreElement.textContent = score;
  updateLives();
  resetWaste();
}

// Draw game objects on the canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Player (Green Bin)
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw Waste Item (Red Square representing plastic waste)
  ctx.fillStyle = waste.color;
  ctx.fillRect(waste.x, waste.y, waste.width, waste.height);
}

// Main game loop 
// I added if inside to make sure 
function gameLoop() {
  if (gameRunning) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

//Initialize setup
resetWaste();
gameLoop();

//adding a start button
startButton.addEventListener('click', ()=>{
    resetGame();
    gameRunning = true;
    startScreen.style.display = 'none';
});

//this is for restart button so it 
restartButton.addEventListener('click', ()=>{
  resetGame();
  gameRunning = true;
  gameOver.style.display = 'none';
});

