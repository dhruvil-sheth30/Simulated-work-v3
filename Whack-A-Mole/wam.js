const squares = document.querySelectorAll('.square');
const score = document.querySelector('#score');
const timeLeft = document.querySelector('#time-left');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;

// Function to remove mole from all squares
function removeMole() {
  squares.forEach(square => {
    square.classList.remove('mole');
    const moleImg = square.querySelector('img');
    if (moleImg) {
      moleImg.remove(); // Remove the mole image from the square
    }
  });
}

// Function to randomly place the mole in a square
function randomSquare() {
  removeMole(); // Remove mole from any previous square
  
  // Randomly select a square
  const randomSquare = squares[Math.floor(Math.random() * squares.length)];
  randomSquare.classList.add('mole');

  // Create and append mole image to the selected square
  const moleImg = document.createElement('img');
  moleImg.src = './img/mole.jpg'; // Updated image path
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
    }
  });
});

// Function to move the mole every second
function moveMole() {
  timerId = setInterval(randomSquare, 1000);
}

// Countdown timer for the game
function countdown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(timerId); // Stop mole movement
    clearInterval(countdownTimerId); // Stop countdown
    alert(`Game Over! Your final score is: ${result}`);

  }
}

let countdownTimerId = setInterval(countdown, 1000);
moveMole();