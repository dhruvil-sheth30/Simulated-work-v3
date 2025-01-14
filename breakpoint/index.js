class Breakout {
    constructor() {
        // Game canvas setup
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        this.gameWidth = 800;
        this.gameHeight = 600;
        
        // Initialize game properties
        this.initializeGameProperties();
        
        // Start game
        this.initializeBricks();
        this.setupEventListeners();
        this.draw();
    }

    initializeGameProperties() {
        // Ball properties
        this.ballRadius = 10;
        this.ballX = this.gameWidth / 2;
        this.ballY = this.gameHeight - 30;
        this.ballSpeedX = 5;
        this.ballSpeedY = -5;
        
        // Paddle properties
        this.paddleHeight = 10;
        this.paddleWidth = 75;
        this.paddleX = (this.gameWidth - this.paddleWidth) / 2;
        this.defaultPaddleWidth = 75;
        
        // Power-up properties
        this.powerUps = [];
        this.activePowerUps = {
            widePaddle: false,
            fastBall: false
        };
        this.powerUpDuration = 10000; // 10 seconds

        // Brick properties
        this.brickRowCount = 5;
        this.brickColumnCount = 9;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        this.bricks = [];

        // Game state
        this.score = 0;
        this.rightPressed = false;
        this.leftPressed = false;

        // Add lives system
        this.lives = 3;
        this.gameOver = false;
        
        // Update score display
        this.scoreDisplay = document.getElementById('score');
        
        // Add lives display to HTML
        this.livesDisplay = document.createElement('div');
        this.livesDisplay.className = 'lives';
        this.livesDisplay.innerHTML = `Lives: <span id="lives">${this.lives}</span>`;
        document.body.insertBefore(this.livesDisplay, this.canvas);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Right' || e.key === 'ArrowRight') {
                this.rightPressed = true;
            }
            else if(e.key === 'Left' || e.key === 'ArrowLeft') {
                this.leftPressed = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Right' || e.key === 'ArrowRight') {
                this.rightPressed = false;
            }
            else if(e.key === 'Left' || e.key === 'ArrowLeft') {
                this.leftPressed = false;
            }
        });

        // Add space key listener for restart
        document.addEventListener('keydown', (e) => {
            if(e.code === 'Space' && this.gameOver) {
                this.restartGame();
            }
        });
    }

    // Brick methods
    initializeBricks() {
        for(let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for(let r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { 
                    x: 0, 
                    y: 0, 
                    status: 1,
                    hasPowerUp: Math.random() < 0.2 // 20% chance for power-up
                };
            }
        }
    }

    drawBricks() {
        for(let c = 0; c < this.brickColumnCount; c++) {
            for(let r = 0; r < this.brickRowCount; r++) {
                if(this.bricks[c][r].status === 1) {
                    const brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    const brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = "#0095DD";
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    // Power-up methods
    createPowerUp(x, y) {
        const types = ['widePaddle', 'fastBall'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push({
            x,
            y,
            type,
            width: 20,
            height: 20,
            speed: 2
        });
    }

    drawPowerUps() {
        this.ctx.save();
        this.powerUps.forEach(powerUp => {
            this.ctx.fillStyle = powerUp.type === 'widePaddle' ? '#4CAF50' : '#2196F3';
            this.ctx.beginPath();
            this.ctx.arc(powerUp.x, powerUp.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });
        this.ctx.restore();
    }

    updatePowerUps() {
        for(let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;

            if (this.checkPowerUpCollision(powerUp)) {
                this.activatePowerUp(powerUp.type);
                this.powerUps.splice(i, 1);
            }

            if (powerUp.y > this.gameHeight) {
                this.powerUps.splice(i, 1);
            }
        }
    }

    checkPowerUpCollision(powerUp) {
        return powerUp.y + powerUp.height > this.gameHeight - this.paddleHeight &&
               powerUp.x > this.paddleX &&
               powerUp.x < this.paddleX + this.paddleWidth;
    }

    activatePowerUp(type) {
        this.activePowerUps[type] = true;
        
        switch(type) {
            case 'widePaddle':
                this.paddleWidth = this.defaultPaddleWidth * 1.5;
                break;
            case 'fastBall':
                this.ballSpeedX *= 1.5;
                this.ballSpeedY *= 1.5;
                break;
        }

        setTimeout(() => this.deactivatePowerUp(type), this.powerUpDuration);
    }

    deactivatePowerUp(type) {
        this.activePowerUps[type] = false;
        
        switch(type) {
            case 'widePaddle':
                this.paddleWidth = this.defaultPaddleWidth;
                break;
            case 'fastBall':
                this.ballSpeedX /= 1.5;
                this.ballSpeedY /= 1.5;
                break;
        }
    }

    // Game logic methods
    collisionDetection() {
        for(let c = 0; c < this.brickColumnCount; c++) {
            for(let r = 0; r < this.brickRowCount; r++) {
                let b = this.bricks[c][r];
                if(b.status === 1 && this.checkBrickCollision(b)) {
                    this.handleBrickCollision(b);
                }
            }
        }
    }

    checkBrickCollision(brick) {
        return this.ballX > brick.x && 
               this.ballX < brick.x + this.brickWidth && 
               this.ballY > brick.y && 
               this.ballY < brick.y + this.brickHeight;
    }

    handleBrickCollision(brick) {
        this.ballSpeedY = -this.ballSpeedY;
        brick.status = 0;
        this.score++;
        
        if(brick.hasPowerUp) {
            this.createPowerUp(brick.x + this.brickWidth/2, brick.y + this.brickHeight);
        }
    }

    // Drawing methods
    draw() {
        this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.drawBricks();
        this.drawBall();
        this.drawPaddle();
        this.drawPowerUps();
        
        this.collisionDetection();
        this.updatePowerUps();
        this.updateGameState();
        
        if (this.gameOver) {
            this.showGameOver();
        }
        
        requestAnimationFrame(() => this.draw());
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddleX, this.gameHeight - this.paddleHeight, 
                     this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    updateGameState() {
        if (this.gameOver) return;

        // Update paddle position
        if(this.rightPressed && this.paddleX < this.gameWidth - this.paddleWidth) {
            this.paddleX += 7;
        }
        else if(this.leftPressed && this.paddleX > 0) {
            this.paddleX -= 7;
        }

        // Update ball position
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        // Ball collision with walls
        if(this.ballX + this.ballSpeedX > this.gameWidth - this.ballRadius || 
           this.ballX + this.ballSpeedX < this.ballRadius) {
            this.ballSpeedX = -this.ballSpeedX;
        }
        
        // Ball collision with ceiling
        if(this.ballY + this.ballSpeedY < this.ballRadius) {
            this.ballSpeedY = -this.ballSpeedY;
        }
        
        // Ball collision with paddle
        if(this.ballY + this.ballSpeedY > this.gameHeight - this.ballRadius - this.paddleHeight) {
            if(this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
                // Calculate where on the paddle the ball hit (normalized from -1 to 1)
                let hitPoint = (this.ballX - (this.paddleX + this.paddleWidth/2)) / (this.paddleWidth/2);
                
                // Change angle based on where the ball hits the paddle
                let angle = hitPoint * Math.PI/3; // Max 60 degree angle
                
                let speed = Math.sqrt(this.ballSpeedX * this.ballSpeedX + 
                                    this.ballSpeedY * this.ballSpeedY);
                
                this.ballSpeedX = speed * Math.sin(angle);
                this.ballSpeedY = -speed * Math.cos(angle);
            }
            // Ball hits bottom - Lose life condition
            else if(this.ballY + this.ballSpeedY > this.gameHeight - this.ballRadius) {
                this.lives--;
                document.getElementById('lives').textContent = this.lives;
                
                if(this.lives <= 0) {
                    this.gameOver = true;
                    this.showGameOver();
                } else {
                    this.resetBall();
                }
            }
        }
    }

    resetBall() {
        this.ballX = this.gameWidth / 2;
        this.ballY = this.gameHeight - 30;
        this.ballSpeedX = 5;
        this.ballSpeedY = -5;
    }

    showGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.gameWidth/2, this.gameHeight/2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.gameWidth/2, this.gameHeight/2 + 50);
        this.ctx.fillText('Press Space to Restart', this.gameWidth/2, this.gameHeight/2 + 90);
    }

    restartGame() {
        this.gameOver = false;
        this.lives = 3;
        this.score = 0;
        document.getElementById('lives').textContent = this.lives;
        this.scoreDisplay.textContent = this.score;
        this.resetBall();
        this.initializeBricks();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Breakout();
});
