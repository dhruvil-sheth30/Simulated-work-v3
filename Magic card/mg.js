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
        cardArray.forEach((card, i) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.setAttribute('data-id', i);

            const frontFace = document.createElement('div');
            frontFace.classList.add('card-front');
            const frontImg = document.createElement('img');
            frontImg.src = card.img;
            frontFace.appendChild(frontImg);

            const backFace = document.createElement('div');
            backFace.classList.add('card-back');
            const backImg = document.createElement('img');
            backImg.src = 'assets/blank.png';
            backFace.appendChild(backImg);

            cardElement.appendChild(frontFace);
            cardElement.appendChild(backFace);
            cardElement.addEventListener('click', flipCard);
            grid.appendChild(cardElement);
        });
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.memory-card');
        const [optionOneId, optionTwoId] = cardsChosenId;

        if (optionOneId === optionTwoId) {
            cards[optionOneId].classList.remove('flip');
        } else if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
        } else {
            setTimeout(() => {
                cards[optionOneId].classList.remove('flip');
                cards[optionTwoId].classList.remove('flip');
            }, 1000);
        }

        cardsChosen = [];
        cardsChosenId = [];
        resultDisplay.textContent = cardsWon.length;

        if (cardsWon.length === cardArray.length / 2) {
            resultDisplay.textContent = 'Congratulations! You found them all!';
            resultDisplay.classList.add('congratulations');
        }
    }

    function flipCard() {
        const cardId = this.getAttribute('data-id');
        if (!cardsChosenId.includes(cardId) && cardsChosen.length < 2) {
            this.classList.add('flip');
            cardsChosen.push(cardArray[cardId].name);
            cardsChosenId.push(cardId);
            
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 500);
            }
        }
    }

    createBoard();
});