const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
// Game state variables
let score = 0;
let lives = 3;
let gameRunning = false;
const livesElement = document.getElementById('lives');
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

// deducting lives everytime waste falls past the player

function updateLives(){
  livesElement.textContent ='❤️'.repeat(lives).trim();
};

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

const wasteType = [
  {
    type: 'paper',
    color: 'blue',
    point: 5
  },
  {
    type: 'plastic',
    color: 'red',
    point: 10
  },
  {
    type: 'metal',
    color: 'yellow',
    point: 15
  }
]

// Handle keyboard movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.dx = -player.speed;
  }
});

document.addEventListener('keyup', (e) => {
  if (
    e.key === 'ArrowRight' ||
    e.key === 'd' ||
    e.key === 'ArrowLeft' ||
    e.key === 'a'
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
    waste.x + waste.width >= player.x &&
    waste.x <= player.x + player.width
  ) {
    score += waste.point;
    scoreElement.textContent = score;
    resetWaste();
    
  }else if (waste.y > canvas.height) {
    // Check if waste fall pass the canva and controll lives
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

//setting the first waste to random
resetWaste();
// Start game
gameLoop();

//adding a start button
startButton.addEventListener('click', ()=>{
    gameRunning = true;
    startScreen.style.display = 'none';
});
//this is for restart button so it 
// doesn't restart on it's own

restartButton.addEventListener('click', ()=>{
  score = 0;
  lives = 3;
  gameRunning = true;

  scoreElement.textContent = score;
  updateLives();
  resetWaste();
  gameOver.style.display = 'none';
});

