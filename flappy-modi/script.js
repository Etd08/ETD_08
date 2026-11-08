// ===== Canvas & context =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== Audio =====
const bgMusic = document.getElementById("bgMusic");
const bgMusic2 = document.getElementById("bgMusic2");
let currentMusic = bgMusic;

// ===== Constants =====
const GRAVITY = 0.3;
const JUMP_STRENGTH = -5.5;

const PIPE_GAP = 190;
const PIPE_WIDTH = 50;
const PIPE_INTERVAL = 1600;
const BIRD_SIZE = 45;

// ===== Bird (Modi) =====
let birdX = canvas.width / 4;
let birdY = canvas.height / 2;
let birdVelocity = 0;

const birdImg = new Image();
birdImg.src = "Modi.png";

// ===== Pipes =====
let pipes = []; // { x, topHeight, passed }

// ===== Game state =====
let score = 0;
let bestScore = Number(localStorage.getItem("flappyBestScore") || 0);
let gameOver = false;
let lastPipeTime = 0;
let lastTime = 0;
let started = false;

document.getElementById("bestScore").textContent = bestScore;

// ===== Music helpers =====
function stopMusic() {
  if (!bgMusic2) return;
  bgMusic2.pause();
  bgMusic2.currentTime = 0;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function startMusic() {
  if (!bgMusic2) return;
  bgMusic2.volume = 0.7;
  bgMusic.volume = 0.7;
  bgMusic2.play().catch(() => {});
}

bgMusic.addEventListener("ended", () => {
  currentMusic = bgMusic2;
  bgMusic2.play().catch(() => {});
});

bgMusic2.addEventListener("ended", () => {
  currentMusic = bgMusic;
  bgMusic.play().catch(() => {});
});

// ===== Game helpers =====
function resetGame() {
  birdX = canvas.width / 4;
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  started = false;
  lastPipeTime = 0;
  lastTime = 0;
  document.getElementById("score").textContent = 0;
  stopMusic();
}

function jump() {
  if (!started) {
    started = true;
    startMusic();
  }
  if (!gameOver) {
    birdVelocity = JUMP_STRENGTH;
  }
}

// ===== Pipes =====
function addPipe() {
  const minHeight = 40;
  const maxHeight = canvas.height - PIPE_GAP - 80;
  const topHeight = Math.floor(
    Math.random() * (maxHeight - minHeight + 1) + minHeight
  );

  pipes.push({
    x: canvas.width,
    topHeight,
    passed: false,
  });
}

// ===== Collision =====
function checkCollision(pipe) {
  const topPipe = {
    x: pipe.x,
    y: 0,
    width: PIPE_WIDTH,
    height: pipe.topHeight,
  };
  const bottomPipe = {
    x: pipe.x,
    y: pipe.topHeight + PIPE_GAP,
    width: PIPE_WIDTH,
    height: canvas.height - (pipe.topHeight + PIPE_GAP),
  };

  const birdRect = {
    x: birdX - BIRD_SIZE / 2,
    y: birdY - BIRD_SIZE / 2,
    width: BIRD_SIZE,
    height: BIRD_SIZE,
  };

  function rectsOverlap(r1, r2) {
    return !(
      r1.x + r1.width < r2.x ||
      r1.x > r2.x + r2.width ||
      r1.y + r1.height < r2.y ||
      r1.y > r2.y + r2.height
    );
  }

  if (rectsOverlap(birdRect, topPipe) || rectsOverlap(birdRect, bottomPipe)) {
    return true;
  }

  if (birdY + BIRD_SIZE / 2 >= canvas.height || birdY - BIRD_SIZE / 2 <= 0) {
    return true;
  }

  return false;
}

// ===== Drawing =====
function drawBird() {
  ctx.save();
  ctx.translate(birdX, birdY);
  const angle = Math.min(
    Math.max(birdVelocity * 0.12, -0.5),
    1.0
  );
  ctx.rotate(angle);

  const size = BIRD_SIZE;
  if (birdImg.complete) {
    ctx.drawImage(birdImg, -size / 2, -size / 2, size, size);
  } else {
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

    const bottomY = pipe.topHeight + PIPE_GAP;
    ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(pipe.x - 1, pipe.topHeight - 8, PIPE_WIDTH + 2, 8);
    ctx.fillRect(pipe.x - 1, bottomY, PIPE_WIDTH + 2, 8);
  });
}

function drawScore() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
  ctx.font = "28px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(score, canvas.width / 2, 40);
}

function drawIntro() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
  ctx.font = "20px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Tap / SPACE to start", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "15px system-ui";
  ctx.fillText("then tap to flap", canvas.width / 2, canvas.height / 2 + 18);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
  ctx.fillRect(
    canvas.width / 2 - 130,
    canvas.height / 2 - 70,
    260,
    140
  );

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    canvas.width / 2 - 130,
    canvas.height / 2 - 70,
    260,
    140
  );

  ctx.fillStyle = "#facc15";
  ctx.font = "24px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 25);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "15px system-ui";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 5);
  ctx.fillText(`Best: ${bestScore}`, canvas.width / 2, canvas.height / 2 + 28);
  ctx.fillText("Tap / SPACE to restart", canvas.width / 2, canvas.height / 2 + 52);
}

// ===== Input =====
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (gameOver) {
      resetGame();
      return;
    }
    jump();
  }
});

canvas.addEventListener("mousedown", () => {
  if (gameOver) {
    resetGame();
    return;
  }
  jump();
});

canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    if (gameOver) {
      resetGame();
      return;
    }
    jump();
  },
  { passive: false }
);

document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
});

// ===== Game loop =====
function update(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ground
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, canvas.height - 32, canvas.width, 8);

  if (!started && !gameOver) {
    drawBird();
    drawIntro();
    requestAnimationFrame(update);
    return;
  }

  if (!gameOver) {
    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    pipes.forEach((pipe) => {
      pipe.x -= 2.5;
    });

    pipes = pipes.filter((p) => p.x + PIPE_WIDTH > 0);

    if (timestamp - lastPipeTime > PIPE_INTERVAL) {
      addPipe();
      lastPipeTime = timestamp;
    }

    pipes.forEach((pipe) => {
      if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
        pipe.passed = true;
        score++;
        document.getElementById("score").textContent = score;
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("flappyBestScore", bestScore);
          document.getElementById("bestScore").textContent = bestScore;
        }
      }
      if (checkCollision(pipe)) {
        gameOver = true;
        stopMusic();
      }
    });
  }

  drawPipes();
  drawBird();
  drawScore();

  if (gameOver) {
    drawGameOver();
  }

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

