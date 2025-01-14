const timeLeftDisplay = document.querySelector('#time-left')
const resultDisplay = document.querySelector('#result')
const startPauseButton = document.querySelector('#start-pause-button')
const squares = document.querySelectorAll('.grid div')
const logsLeft = document.querySelectorAll('.log-left')
const logsRight = document.querySelectorAll('.log-right')
const carsLeft = document.querySelectorAll('.car-left')
const carsRight = document.querySelectorAll('.car-right')
const scoreDisplay = document.createElement('span');
scoreDisplay.id = 'score';
const livesDisplay = document.createElement('span');
livesDisplay.id = 'lives';

let currentIndex = 76
const width = 9
let timerId
let outcomeTimerId
let currentTime = 20
let score = 0;
let lives = 3;

document.querySelector('.game-container').insertAdjacentHTML('afterbegin', `
    <div class="game-stats">
        <h3>Lives: <span id="lives">3</span></h3>
        <h3>Score: <span id="score">0</span></h3>
    </div>
`);

function moveFrog(e) {
    squares[currentIndex].classList.remove('frog')

    switch(e.key) {
        case 'ArrowLeft' :
             if (currentIndex % width !== 0) currentIndex -= 1
            break
        case 'ArrowRight' :
            if (currentIndex % width < width - 1) currentIndex += 1
            break
        case 'ArrowUp' :
            if (currentIndex - width >=0 ) currentIndex -= width
            break
        case 'ArrowDown' :
            if (currentIndex + width < width * width) currentIndex += width
            break
    }
    squares[currentIndex].classList.add('frog')
}

function autoMoveElements() {
    currentTime--
    timeLeftDisplay.textContent = currentTime
    logsLeft.forEach(logLeft => moveLogLeft(logLeft))
    logsRight.forEach(logRight => moveLogRight(logRight))
    carsLeft.forEach(carLeft => moveCarLeft(carLeft))
    carsRight.forEach(carRight => moveCarRight(carRight))
}

function checkOutComes() {
    lose()
    win()
}

function moveLogLeft(logLeft) {
    switch(true) {
        case logLeft.classList.contains('l1') :
            logLeft.classList.remove('l1')
            logLeft.classList.add('l2')
            break
        case logLeft.classList.contains('l2') :
            logLeft.classList.remove('l2')
            logLeft.classList.add('l3')
            break
        case logLeft.classList.contains('l3') :
            logLeft.classList.remove('l3')
            logLeft.classList.add('l4')
            break
        case logLeft.classList.contains('l4') :
            logLeft.classList.remove('l4')
            logLeft.classList.add('l5')
            break
        case logLeft.classList.contains('l5') :
            logLeft.classList.remove('l5')
            logLeft.classList.add('l1')
            break
    }
}

function moveLogRight(logRight) {
    switch(true) {
        case logRight.classList.contains('l1') :
            logRight.classList.remove('l1')
            logRight.classList.add('l5')
            break
        case logRight.classList.contains('l2') :
            logRight.classList.remove('l2')
            logRight.classList.add('l1')
            break
        case logRight.classList.contains('l3') :
            logRight.classList.remove('l3')
            logRight.classList.add('l2')
            break
        case logRight.classList.contains('l4') :
            logRight.classList.remove('l4')
            logRight.classList.add('l3')
            break
        case logRight.classList.contains('l5') :
            logRight.classList.remove('l5')
            logRight.classList.add('l4')
            break
    }
}

function moveCarLeft(carLeft) {
    switch(true) {
        case carLeft.classList.contains('c1') :
            carLeft.classList.remove('c1')
            carLeft.classList.add('c2')
            break
        case carLeft.classList.contains('c2') :
            carLeft.classList.remove('c2')
            carLeft.classList.add('c3')
            break
        case carLeft.classList.contains('c3') :
            carLeft.classList.remove('c3')
            carLeft.classList.add('c1')
            break
    }
}

function moveCarRight(carRight) {
    switch(true) {
        case carRight.classList.contains('c1') :
            carRight.classList.remove('c1')
            carRight.classList.add('c3')
            break
        case carRight.classList.contains('c2') :
            carRight.classList.remove('c2')
            carRight.classList.add('c1')
            break
        case carRight.classList.contains('c3') :
            carRight.classList.remove('c3')
            carRight.classList.add('c2')
            break
    }
}

function updateButtonText(isPlaying) {
    startPauseButton.textContent = isPlaying ? 'Pause Game' : 'Start Game';
}

function resetGame() {
    currentTime = 20;
    timeLeftDisplay.textContent = currentTime;
    resultDisplay.textContent = '';
    squares[currentIndex].classList.remove('frog');
    currentIndex = 76;
    squares[currentIndex].classList.add('frog');
    score = 0;
    lives = 3;
    updateScore(0);
    updateLives(0);
}

function lose() {
    if (
        squares[currentIndex].classList.contains('c1') ||
        squares[currentIndex].classList.contains('l4') ||
        squares[currentIndex].classList.contains('l5') ||
        currentTime <= 0
    ) {
        updateLives(-1);
        if (lives > 0) {
            squares[currentIndex].classList.remove('frog');
            currentIndex = 76;
            squares[currentIndex].classList.add('frog');
            currentTime = 20;
            timeLeftDisplay.textContent = currentTime;
            resultDisplay.textContent = `Ouch! Lives remaining: ${lives}`;
            resultDisplay.style.color = '#e74c3c';
        }
    }
}

function win() {
    if (squares[currentIndex].classList.contains('ending-block')) {
        updateScore(100);
        resultDisplay.textContent = `You reached the goal! +100 points`;
        resultDisplay.style.color = '#2ecc71';
        
        squares[currentIndex].classList.remove('frog');
        currentIndex = 76;
        squares[currentIndex].classList.add('frog');
        
        const timeBonus = currentTime * 10;
        updateScore(timeBonus);
        resultDisplay.textContent += ` Time Bonus: +${timeBonus}`;
        
        currentTime = 20;
        timeLeftDisplay.textContent = currentTime;
    }
}

function updateScore(points) {
    score += points;
    document.querySelector('#score').textContent = score;
}

function updateLives(change) {
    lives += change;
    document.querySelector('#lives').textContent = lives;
    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    resultDisplay.textContent = `Game Over! Final Score: ${score}`;
    resultDisplay.style.color = '#e74c3c';
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    squares[currentIndex].classList.remove('frog');
    document.removeEventListener('keyup', moveFrog);
    updateButtonText(false);
}

startPauseButton.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        clearInterval(outcomeTimerId);
        outcomeTimerId = null;
        timerId = null;
        document.removeEventListener('keyup', moveFrog);
        updateButtonText(false);
    } else {
        resetGame();
        timerId = setInterval(autoMoveElements, 1000);
        outcomeTimerId = setInterval(checkOutComes, 50);
        document.addEventListener('keyup', moveFrog);
        updateButtonText(true);
    }
});

const controlsDiv = document.createElement('div');
controlsDiv.innerHTML = `
    <p style="color: #ecf0f1; text-align: center; margin-top: 20px;">
        Use arrow keys to move the frog ↑ ↓ ← →
    </p>
`;
document.querySelector('.game-container').appendChild(controlsDiv);

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .game-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        background: rgba(0, 0, 0, 0.2);
        padding: 10px;
        border-radius: 8px;
    }
    
    .game-stats h3 {
        margin: 0;
        color: #ecf0f1;
    }
    
    #score, #lives {
        font-weight: bold;
        color: #2ecc71;
    }
`;
document.head.appendChild(styleSheet);