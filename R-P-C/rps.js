let playerScore = 0;
let computerScore = 0;

function handleUserChoice(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    if (result === 'win') {
        playerScore++;
        document.getElementById('result').textContent = `You Win! ${playerChoice} beats ${computerChoice}.`;
    } else if (result === 'lose') {
        computerScore++;
        document.getElementById('result').textContent = `You Lose! ${computerChoice} beats ${playerChoice}.`;
    } else {
        document.getElementById('result').textContent = `It's a Tie! Both chose ${playerChoice}.`;
    }

    document.getElementById('computer-choice').textContent = `Computer chose: ${computerChoice}`;
    updateScores();
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

function updateScores() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('result').textContent = 'Game reset. Make your choice!';
    document.getElementById('computer-choice').textContent = '';
    updateScores();
}

document.getElementById('rock').addEventListener('click', () => handleUserChoice('rock'));
document.getElementById('paper').addEventListener('click', () => handleUserChoice('paper'));
document.getElementById('scissors').addEventListener('click', () => handleUserChoice('scissors'));
document.getElementById('reset').addEventListener('click', resetGame);