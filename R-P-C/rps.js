class RockPaperScissors {
    constructor() {
        this.scores = {
            player: 0,
            computer: 0,
            ties: 0
        };
        this.choices = ['rock', 'paper', 'scissors'];
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.choices.forEach(choice => {
            document.getElementById(choice).addEventListener('click', () => {
                this.playRound(choice);
            });
        });

        document.getElementById('reset').addEventListener('click', () => this.resetGame());
    }

    playRound(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice, computerChoice);
        
        this.animateChoices(playerChoice, computerChoice);
        this.updateDisplay(playerChoice, computerChoice, result);
        this.updateScores(result);
    }

    getComputerChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'tie';
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }

    animateChoices(playerChoice, computerChoice) {
        // Animate player choice
        const playerBtn = document.getElementById(playerChoice);
        playerBtn.classList.add('selected');
        setTimeout(() => playerBtn.classList.remove('selected'), 500);

        // Update choice displays
        const playerDisplay = document.getElementById('player-choice-display');
        const computerDisplay = document.getElementById('computer-choice-display');
        
        playerDisplay.innerHTML = `<img src="assets/${playerChoice}.png" alt="${playerChoice}">`;
        computerDisplay.innerHTML = `<img src="assets/${computerChoice}.png" alt="${computerChoice}">`;
    }

    updateDisplay(playerChoice, computerChoice, result) {
        const resultDiv = document.getElementById('result');
        const messages = {
            win: `You Win! ${playerChoice} beats ${computerChoice}`,
            lose: `You Lose! ${computerChoice} beats ${playerChoice}`,
            tie: `It's a Tie! Both chose ${playerChoice}`
        };
        
        resultDiv.className = 'result-message ' + result;
        resultDiv.textContent = messages[result];
    }

    updateScores(result) {
        if (result === 'tie') this.scores.ties++;
        else if (result === 'win') this.scores.player++;
        else this.scores.computer++;

        document.getElementById('player-score').textContent = this.scores.player;
        document.getElementById('computer-score').textContent = this.scores.computer;
        document.getElementById('ties').textContent = this.scores.ties;
    }

    resetGame() {
        this.scores = { player: 0, computer: 0, ties: 0 };
        document.getElementById('result').textContent = 'Choose your weapon!';
        document.getElementById('result').className = 'result-message';
        document.getElementById('player-choice-display').innerHTML = '';
        document.getElementById('computer-choice-display').innerHTML = '';
        this.updateScores('tie'); // Updates all scores to 0
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissors();
});