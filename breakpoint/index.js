class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + 100, yAxis];
        this.topLeft = [xAxis, yAxis + 20];
        this.topRight = [xAxis + 100, yAxis + 20];
    }
}

// Game variables
const gameBoard = document.querySelector('#game-board');
const paddle = document.querySelector('#paddle');
const ball = document.querySelector('#ball');
const scoreDisplay = document.querySelector('#score span');
const messageDisplay = document.querySelector('#message');

let paddlePosition = 230;
let ballPosition = [270, 40];
let ballDirection = [2, 2];
let score = 0;
let timerId;
let isMovingLeft = false;
let isMovingRight = false;

// Create blocks
const blocks = [];
function createBlocks() {
    blocks.length = 0; // Clear existing blocks
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            blocks.push(new Block(i * 110 + 10, (j * 30 + 300)));
        }
    }
}

// Draw blocks
function drawBlocks() {
    // Remove existing blocks
    const existingBlocks = document.querySelectorAll('.block');
    existingBlocks.forEach(block => block.remove());
    
    blocks.forEach((block) => {
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');
        blockElement.style.left = block.bottomLeft[0] + 'px';
        blockElement.style.bottom = block.bottomLeft[1] + 'px';
        gameBoard.appendChild(blockElement);
    });
}

// Smooth paddle movement
function movePaddle() {
    if (isMovingLeft && paddlePosition > 0) {
        paddlePosition -= 5;
    }
    if (isMovingRight && paddlePosition < gameBoard.offsetWidth - 100) {
        paddlePosition += 5;
    }
    paddle.style.left = paddlePosition + 'px';
}

// Handle keyboard controls
function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = true;
    }
    if (e.key === 'ArrowRight') {
        isMovingRight = true;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft') {
        isMovingLeft = false;
    }
    if (e.key === 'ArrowRight') {
        isMovingRight = false;
    }
}

// Reset game with proper event listener handling
function resetGame(){
    // Clear existing interval
    clearInterval(timerId);
    
    // Remove existing event listeners to prevent duplicates
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Reset variables
    paddlePosition = 230;
    ballPosition = [270, 40];
    ballDirection = [2, 2];
    score = 0;
    isMovingLeft = false;
    isMovingRight = false;
    
    scoreDisplay.textContent = score;
    messageDisplay.textContent = '';
    
    // Reset paddle and ball position
    paddle.style.left = paddlePosition + 'px';
    ball.style.left = ballPosition[0] + 'px';
    ball.style.bottom = ballPosition[1] + 'px';
    
    // Recreate blocks
    createBlocks();
    drawBlocks();
    
    // Re-add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    timerId = setInterval(() => {
        movePaddle();
        moveBall();
    }, 30);
}

// Move ball
function moveBall() {
    ballPosition[0] += ballDirection[0];
    ballPosition[1] += ballDirection[1];
    ball.style.left = ballPosition[0] + 'px';
    ball.style.bottom = ballPosition[1] + 'px';
    checkCollisions();
}

// Improved collision detection
function checkCollisions() {
    const ballRect = ball.getBoundingClientRect();
    
    // Wall collisions with improved bouncing
    if (ballPosition[0] >= 540 || ballPosition[0] <= 0) {
        ballDirection[0] = -ballDirection[0];
        // Add slight vertical variation for more realistic bounces
        ballDirection[1] = ballDirection[1] + (Math.random() * 0.5 - 0.25);
    }
    if (ballPosition[1] >= 380) {
        ballDirection[1] = -ballDirection[1];
    }

    // Game over condition
    if (ballPosition[1] <= 0) {
        clearInterval(timerId);
        messageDisplay.textContent = 'Game Over! Final Score: ' + score;
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }

    // Improved paddle collision with angle variation
    if (
        (ballPosition[0] + 20 >= paddlePosition && 
         ballPosition[0] <= paddlePosition + 100) &&
        (ballPosition[1] > 0 && ballPosition[1] < 30)
    ) {
        // Calculate where on the paddle the ball hit
        const paddleCenter = paddlePosition + 50;
        const ballCenter = ballPosition[0] + 10;
        const difference = ballCenter - paddleCenter;
        
        // Adjust angle based on where ball hits the paddle
        ballDirection[0] = difference * 0.05;
        ballDirection[1] = -ballDirection[1];
        
        // Normalize speed
        const speed = Math.sqrt(ballDirection[0] * ballDirection[0] + ballDirection[1] * ballDirection[1]);
        ballDirection[0] = (ballDirection[0] / speed) * 4;
        ballDirection[1] = (ballDirection[1] / speed) * 4;
    }

    // Improved block collisions with immediate reflection
    let collisionDetected = false;
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (collisionDetected) break;  // Exit if we've already handled a collision

        const block = blocks[i];
        const blockLeft = block.bottomLeft[0];
        const blockRight = block.bottomRight[0];
        const blockBottom = block.bottomLeft[1];
        const blockTop = block.topLeft[1];

        // More precise collision detection
        if (
            (ballPosition[0] + 20 >= blockLeft && 
             ballPosition[0] <= blockRight) &&
            (ballPosition[1] + 20 >= blockBottom && 
             ballPosition[1] <= blockTop)
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].remove();
            blocks.splice(i, 1);
            
            // Determine which side of the block was hit
            const ballCenterX = ballPosition[0] + 10;
            const ballCenterY = ballPosition[1] + 10;
            const blockCenterX = (blockLeft + blockRight) / 2;
            const blockCenterY = (blockBottom + blockTop) / 2;
            
            // Calculate if collision is more horizontal or vertical
            if (Math.abs(ballCenterX - blockCenterX) > Math.abs(ballCenterY - blockCenterY)) {
                ballDirection[0] = -ballDirection[0];
            } else {
                ballDirection[1] = -ballDirection[1];
            }
            
            // Move ball slightly away from collision point to prevent multiple hits
            ballPosition[0] += ballDirection[0];
            ballPosition[1] += ballDirection[1];
            
            // Add slight randomness (reduced from previous version)
            ballDirection[0] += (Math.random() * 0.2 - 0.1);
            ballDirection[1] += (Math.random() * 0.2 - 0.1);
            
            // Normalize speed
            const speed = Math.sqrt(ballDirection[0] * ballDirection[0] + ballDirection[1] * ballDirection[1]);
            ballDirection[0] = (ballDirection[0] / speed) * 4;
            ballDirection[1] = (ballDirection[1] / speed) * 4;
            
            score += 10;
            scoreDisplay.textContent = score;
            collisionDetected = true;  // Mark that we've handled a collision

            // Win condition
            if (blocks.length === 0) {
                clearInterval(timerId);
                messageDisplay.textContent = 'You Win! Final Score: ' + score;
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
            }
        }
    }
}

// Initialize game
createBlocks();
drawBlocks();

// Initialevent listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Create restart button
const restartButton = document.createElement('button');
restartButton.textContent = 'Restart Game';
restartButton.style.marginTop = '10px';
restartButton.addEventListener('click', resetGame);
document.querySelector('.game-container').appendChild(restartButton);

// Start game
resetGame();
