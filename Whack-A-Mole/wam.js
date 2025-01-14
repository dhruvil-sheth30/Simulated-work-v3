const squares = document.querySelectorAll('.square');
const score = document.querySelector('#score');
const timeLeft = document.querySelector('#time-left');
const levelDisplay = document.createElement('h2');
levelDisplay.innerHTML = 'Level: <span id="level">1</span>';
document.body.insertBefore(levelDisplay, document.querySelector('.grid'));

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let moleSpeed = 1000; // Starting speed
let currentLevel = 1;
let lastSpeedUpdate = 0;
const speedDecreaseInterval = 5; // Points needed for speed increase

function updateLevel() {
    const newLevel = Math.floor(result / speedDecreaseInterval) + 1;
    if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        document.querySelector('#level').textContent = currentLevel;
        updateGameSpeed();
    }
}

function updateGameSpeed() {
    // Decrease mole appearance time (make it faster)
    // Minimum speed of 400ms to keep it playable
    moleSpeed = Math.max(400, 1000 - (currentLevel - 1) * 100);
    
    // Restart mole movement with new speed
    clearInterval(timerId);
    timerId = setInterval(randomSquare, moleSpeed);
    
    // Visual feedback for level up
    const grid = document.querySelector('.grid');
    grid.style.animation = 'levelUp 0.5s';
    setTimeout(() => grid.style.animation = '', 500);
}

// Function to remove mole from all squares
function removeMole() {
    squares.forEach(square => {
        square.classList.remove('mole');
        const moleImg = square.querySelector('img');
        if (moleImg) {
            moleImg.remove();
        }
    });
}

// Function to randomly place the mole in a square
function randomSquare() {
    removeMole();
    
    const randomSquare = squares[Math.floor(Math.random() * squares.length)];
    randomSquare.classList.add('mole');

    const moleImg = document.createElement('img');
    moleImg.src = './img/mole.jpg';
    moleImg.style.display = 'block';
    moleImg.style.width = '100%';
    moleImg.style.height = '100%';
    randomSquare.appendChild(moleImg);

    hitPosition = randomSquare.id;
}

// Add click event listener to each square
squares.forEach(square => {
    square.addEventListener('click', () => {
        if (square.id === hitPosition) {
            result++;
            score.textContent = result;
            hitPosition = null;
            updateLevel();
        }
    });
});

// Function to move the mole
function moveMole() {
    timerId = setInterval(randomSquare, moleSpeed);
}

// Countdown timer for the game
function countdown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime === 0) {
        clearInterval(timerId);
        clearInterval(countdownTimerId);
        showGameOver();
    }
}

function showGameOver() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
        <p>Final Score: ${result}</p>
        <p>Level Reached: ${currentLevel}</p>
        <button onclick="restartGame()">Play Again</button>
    `;
    document.body.appendChild(gameOverDiv);
}

function restartGame() {
    result = 0;
    currentTime = 60;
    currentLevel = 1;
    moleSpeed = 1000;
    score.textContent = 0;
    timeLeft.textContent = currentTime;
    document.querySelector('#level').textContent = 1;
    
    const gameOverDiv = document.querySelector('.game-over');
    if (gameOverDiv) {
        gameOverDiv.remove();
    }
    
    startGame();
}

function startGame() {
    moveMole();
    countdownTimerId = setInterval(countdown, 1000);
}

// Add CSS for new features
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes levelUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    .game-over {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        text-align: center;
    }

    .game-over button {
        padding: 10px 20px;
        font-size: 1.1rem;
        background: #ff5722;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .game-over button:hover {
        background: #f4511e;
    }

    #level {
        color: #ff5722;
        font-weight: bold;
    }
`;
document.head.appendChild(styleSheet);

startGame();