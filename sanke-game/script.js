//snack game javascript
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction;
let food = spawnFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let game;
let isPaused = false;

document.getElementById("highScore").textContent = `High Score: ${highScore}`;

// Keyboard controls
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Mobile button controls
function changeDirection(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

// Pause / Resume
function togglePause() {
  if (isPaused) {
    game = setInterval(draw, 120);
    isPaused = false;
  } else {
    clearInterval(game);
    isPaused = true;
  }
}

// Restart Game
function restartGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = spawnFood();
  score = 0;
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("overlay").classList.add("hidden");
  clearInterval(game);
  game = setInterval(draw, 120);
  isPaused = false;
}

// Food generator 
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#090";
    ctx.shadowColor = "#0f0";
    ctx.shadowBlur = 15;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#f00";
  ctx.shadowColor = "#f00";
  //ctx.shadowBlur = 20;
  //ctx.fillRect(food.x, food.y, box, box);
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Snake head
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Eat food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    food = spawnFood();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").textContent = `High Score: ${highScore}`;
    }
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // Game Over conditions
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    clearInterval(game);
    document.getElementById("overlay").classList.remove("hidden");
    return;
  }

  snake.unshift(newHead);
}

// Start Game
game = setInterval(draw, 120);
