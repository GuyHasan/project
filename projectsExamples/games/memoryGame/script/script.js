//the cards for the game
const cards = [
    { id: 1, name: 'card1', image: 'images/card1.svg' },
    { id: 2, name: 'card2', image: 'images/card2.svg' },
    { id: 3, name: 'card3', image: 'images/card3.svg' },
    { id: 4, name: 'card4', image: 'images/card4.svg' },
    { id: 5, name: 'card5', image: 'images/card5.svg' },
    { id: 6, name: 'card6', image: 'images/card6.svg' },
    { id: 7, name: 'card7', image: 'images/card7.svg' },
    { id: 8, name: 'card8', image: 'images/card8.svg' },
    { id: 9, name: 'card9', image: 'images/card9.svg' },
    { id: 10, name: 'card10', image: 'images/card10.svg' },
    { id: 11, name: 'card11', image: 'images/card11.svg' },
    { id: 12, name: 'card12', image: 'images/card12.svg' },
    { id: 13, name: 'card13', image: 'images/card13.svg' },
    { id: 14, name: 'card14', image: 'images/card14.svg' },
    { id: 15, name: 'card15', image: 'images/card15.svg' },
    { id: 16, name: 'card16', image: 'images/card16.svg' },
    { id: 17, name: 'card17', image: 'images/card17.svg' },
    { id: 18, name: 'card18', image: 'images/card18.svg' }
];

//the buttons for the game
const level1Button = document.querySelector('.level1');
const level2Button = document.querySelector('.level2');
const level3Button = document.querySelector('.level3');
const playAgainButton = document.querySelector('.playAgain');
//the game elements
const triesDisplay = document.querySelector('.tries');
const gameOverDisplay = document.querySelector('.gameOverPopUp');
//the game variables
let size;
let flippedCardsCounter = 0;
let disableClick = false;
let mistakes = 0;
let matches = 0;
let tries;


//the level selecting buttons function
level1Button.addEventListener('click', levelSelected);
level2Button.addEventListener('click', levelSelected);
level3Button.addEventListener('click', levelSelected);
function levelSelected(e) {
    if (e.target === level1Button) {
        startLevel(1);
    } else if (e.target === level2Button) {
        startLevel(2);
    } else if (e.target === level3Button) {
        startLevel(3);
    }
}

//the function that starts the game based on the difficulty level
function startLevel(selected) {
    let numPairs;
    if (selected == 1) {
        size = 2; // 2x2 grid
        numPairs = 2;
        tries = 3;
        triesDisplay.innerText = `ניסיונות: ${tries}`;
    } else if (selected == 2) {
        size = 4; // 4x4 grid
        numPairs = 8;
        tries = 20;
        triesDisplay.innerText = `ניסיונות: ${tries}`;
    } else if (selected == 3) {
        size = 6; // 6x6 grid
        numPairs = 18;
        tries = 40;
        triesDisplay.innerText = `ניסיונות: ${tries}`;
    }
    const board = document.querySelector('.board');
    board.innerHTML = ''; // Clear previous cells
    //making the rows and columns based on the size using css grid
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Create a new array with pairs of cards
    const selectedCards = cards.slice(0, numPairs); // Select the first numPairs amount of cards
    const gameCards = [...selectedCards, ...selectedCards]; // Duplicate the selected cards array to create pairs
    gameCards.sort(() => 0.5 - Math.random()); // Shuffle the cards

    for (let i = 0; i < gameCards.length; i++) {
        const card = gameCards[i];
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.id = card.id;

        const front = document.createElement('div');
        front.classList.add('front');
        front.innerHTML = `<img src=${card.image}>`;

        const back = document.createElement('div');
        back.classList.add('back');
        back.classList.add('backgroundCard');
        back.innerText = 'Guy Games';

        cell.appendChild(front);
        cell.appendChild(back);
        cell.addEventListener('click', (e) => flipCard(e, tries)); // Pass tries to flipCard
        board.appendChild(cell);
    }
}

function flipCard(e) {
    const cell = e.currentTarget;
    if (cell.classList.contains('matched') || cell.classList.contains('flipped')) {
        return; // Do nothing if the card is already matched or flipped
    }

    if (disableClick) {
        return;
    }

    cell.classList.add('flipped');
    flippedCardsCounter++;

    if (flippedCardsCounter === 2) {
        disableClick = true; // disable clicking on the cards until finished checking if they are a match
        setTimeout(checkMatch(tries), 500); // Add a short delay before checking for matches
    }
}

//the function that checks if the cards are a match

function checkMatch() {
    const flippedCards = document.querySelectorAll('.flipped');
    if (flippedCards.length === 2) {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
        if (card1.dataset.id === card2.dataset.id) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCardsCounter = 0;
            setTimeout(() => {
                disableClick = false; // Re-enable clicks after a short delay
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCardsCounter = 0;
                disableClick = false; // Re-enable clicks after flipping back
                mistakes++;
                triesDisplay.innerText = `ניסיונות: ${tries - mistakes}`;
                if (mistakes >= tries) {
                    gameOver();
                    return;
                }
            }, 1000); // Add a delay of 1 second before flipping back
        }
    }
}

function gameOver() {
    gameOverDisplay.style.display = 'flex';
    const playAgainButton = document.querySelector('.playAgain');
    playAgainButton.addEventListener('click', () => {
        gameOverDisplay.style.display = 'none';
        mistakes = 0;
        triesDisplay.innerText = `ניסיונות: ${tries}`;
    });
}