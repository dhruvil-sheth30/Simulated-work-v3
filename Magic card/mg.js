document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'cheeseburger', img: 'assets/cheeseburger.png' },
        { name: 'cheeseburger', img: 'assets/cheeseburger.png' },
        { name: 'fries', img: 'assets/fries.png' },
        { name: 'fries', img: 'assets/fries.png' },
        { name: 'hotdog', img: 'assets/hotdog.png' },
        { name: 'hotdog', img: 'assets/hotdog.png' },
        { name: 'ice-cream', img: 'assets/ice-cream.png' },
        { name: 'ice-cream', img: 'assets/ice-cream.png' },
        { name: 'milkshake', img: 'assets/milkshake.png' },
        { name: 'milkshake', img: 'assets/milkshake.png' },
        { name: 'pizza', img: 'assets/pizza.png' },
        { name: 'pizza', img: 'assets/pizza.png' },
    ];

    cardArray.sort(() => 0.5 - Math.random());

    const grid = document.querySelector('#grid');
    const resultDisplay = document.querySelector('#result');
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];

    function createBoard() {
        cardArray.forEach((_, i) => {
            const card = document.createElement('img');
            card.setAttribute('src', 'assets/blank.png');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('img');
        const [optionOneId, optionTwoId] = cardsChosenId;

        if (optionOneId === optionTwoId) {
            cards[optionOneId].setAttribute('src', 'assets/blank.png');
            alert('You clicked the same card!');
        } else if (cardsChosen[0] === cardsChosen[1]) {
            alert('You found a match!');
            cards[optionOneId].setAttribute('src', 'assets/white.png');
            cards[optionTwoId].setAttribute('src', 'assets/white.png');
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
        } else {
            cards[optionOneId].setAttribute('src', 'assets/blank.png');
            cards[optionTwoId].setAttribute('src', 'assets/blank.png');
            alert('Try again!');
        }

        cardsChosen = [];
        cardsChosenId = [];
        resultDisplay.textContent = cardsWon.length;

        if (cardsWon.length === cardArray.length / 2) {
            resultDisplay.textContent = 'Congratulations! You found them all!';
        }
    }

    function flipCard() {
        const cardId = this.getAttribute('data-id');
        if (!cardsChosenId.includes(cardId)) {
            cardsChosen.push(cardArray[cardId].name);
            cardsChosenId.push(cardId);
            this.setAttribute('src', cardArray[cardId].img);
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 500);
            }
        }
    }

    createBoard();
});