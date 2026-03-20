const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const startScreen = document.getElementById('startScreen');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsScreen = document.getElementById('settingsScreen');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const speedSelect = document.getElementById('speedSelect');
const snakeColorInput = document.getElementById('snakeColorInput');
const foodColorInput = document.getElementById('foodColorInput');

// Theme settings
let snakeBaseColor = '#10B981';
let foodCoreColor = '#EF4444';

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Game constants
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
let INITIAL_SPEED = 250; // ms per frame

// Game state
let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let nextDx = 0; // to prevent double cross back in one frame
let nextDy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoopInterval = null;
let isGameOver = false;
let isGameStarted = false;
let gameSpeed = INITIAL_SPEED;

// Initialize UI
highScoreElement.textContent = highScore;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    gameSpeed = INITIAL_SPEED;
    isGameOver = false;
    isGameStarted = true;
    scoreElement.textContent = score;
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    
    spawnFood();
    
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, gameSpeed);
}

function spawnFood() {
    let validPos = false;
    while (!validPos) {
        food = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        validPos = true;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validPos = false;
                break;
            }
        }
    }
}

function gameLoop() {
    update();
    draw();
}

function update() {
    if (isGameOver || !isGameStarted) return;

    // Apply exact queued direction
    dx = nextDx;
    dy = nextDy;

    // Move snake head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Collision Detection: Wall
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        handleGameOver();
        return;
    }

    // Collision Detection: Self
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            handleGameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Collision Detection: Food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // Speed up slightly as getting longer
        if (score % 50 === 0 && gameSpeed > 60) {
            gameSpeed -= 5;
            clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(gameLoop, gameSpeed);
        }
        
        spawnFood();
    } else {
        // Pop tail if no food eaten
        snake.pop();
    }
}

function handleGameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function draw() {
    // Background fill
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for(let i = 0; i < TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }

    // Draw Food
    const cx = food.x * GRID_SIZE + GRID_SIZE/2;
    const cy = food.y * GRID_SIZE + GRID_SIZE/2;
    const radius = GRID_SIZE/2 - 2;

    // Food Outer Glow
    ctx.beginPath();
    ctx.fillStyle = hexToRgba(foodCoreColor, 0.3);
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    // Food Inner Core
    ctx.beginPath();
    ctx.fillStyle = foodCoreColor;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        
        ctx.fillStyle = snakeBaseColor;
        
        const padding = 1;
        ctx.beginPath();
        ctx.roundRect(
            x + padding, 
            y + padding, 
            GRID_SIZE - padding*2, 
            GRID_SIZE - padding*2, 
            isHead ? 6 : 4
        );
        ctx.fill();
        
        if (isHead) {
            // Lighten head slightly
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.roundRect(
                x + padding, 
                y + padding, 
                GRID_SIZE - padding*2, 
                GRID_SIZE - padding*2, 
                6
            );
            ctx.fill();
            
            // Eye (Shine) for head
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            // simple position logic for eyes depending on dx/dy
            let eyeXOffset = dx === 1 ? 5 : dx === -1 ? -5 : 0;
            let eyeYOffset = dy === 1 ? 5 : dy === -1 ? -5 : 0;
            ctx.arc(x + GRID_SIZE/2 + eyeXOffset, y + GRID_SIZE/2 + eyeYOffset, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Draw initial state behind start screen
draw();

// Input handling
document.addEventListener('keydown', (e) => {
    // Handle UI inputs (Enter/Space to start/restart)
    if (!isGameStarted || isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
            if (!isGameStarted) startBtn.click();
            else if (isGameOver) restartBtn.click();
        }
        return;
    }

    // Prevent screen scroll
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy !== 1) { nextDx = 0; nextDy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy !== -1) { nextDx = 0; nextDy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx !== 1) { nextDx = -1; nextDy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx !== -1) { nextDx = 1; nextDy = 0; }
            break;
    }
});

// UI Event Listeners
restartBtn.addEventListener('click', initGame);
startBtn.addEventListener('click', initGame);

settingsBtn.addEventListener('click', () => {
    if (isGameStarted && !isGameOver && gameLoopInterval) {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null; // Mark as paused
    }
    settingsScreen.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    INITIAL_SPEED = parseInt(speedSelect.value);
    snakeBaseColor = snakeColorInput.value;
    foodCoreColor = foodColorInput.value;
    
    settingsScreen.classList.add('hidden');
    draw();
    
    // Resume game if it was paused while playing
    if (isGameStarted && !isGameOver && !gameLoopInterval) {
        // Adjust current game speed based on new INITIAL_SPEED if necessary
        gameSpeed = Math.min(gameSpeed, INITIAL_SPEED); 
        gameLoopInterval = setInterval(gameLoop, gameSpeed);
    }
});
