//elements in the page
const chooseButtonsDisplay = document.querySelector('.chooseButtons');
const startPracticeButton = document.querySelector('.startPractice');
const startQuizButton = document.querySelector('.quiz');
const answersDiv = document.querySelector('.answersDisplay');
const scoreDiv = document.querySelector('.score');
const gameBox = document.querySelector('.gameBox');
const returnButton = document.querySelector('.returnBack');

// Variables for the game
let availableQuestions;
let questions;
let score = 0;
let allowClick = true;
let quizCheck = false;
let mistakes = 0;


//getting the questions from the api
function fetchQuestions() {
    fetch("https://opentdb.com/api.php?amount=50&type=multiple")
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
        });
}
fetchQuestions();


startPracticeButton.addEventListener('click', startGame);
startQuizButton.addEventListener('click', startGame);
returnButton.addEventListener('click', startAgain);



function startGame(e) {
    availableQuestions = questions.filter(question => question.correct_answer && question.correct_answer.trim() !== '');
    score = 0;
    if (e.target.classList.contains('quiz')) {
        startQuiz();
    } else {
        chooseDifficulty();
    }
    chooseButtonsDisplay.classList.add('hide');
}



// Function to start the quiz game
function startQuiz() {
    quizCheck = true;
    availableQuestions.sort(() => Math.random() - 0.5);
    availableQuestions = availableQuestions.slice(0, 15);
    getNewQuestion();
}
// Function to start the parctice game level selection
function chooseDifficulty() {
    quizCheck = false;
    for (let i = 0; i < 3; i++) {
        const level = document.createElement('button');
        level.classList.add('button');
        if (i === 0) {
            level.innerHTML = 'Easy';
            level.addEventListener('click', () => {
                availableQuestions = questions.filter(question => question.difficulty === 'easy');
                score = 0;
                getNewQuestion();
            });
        } else if (i === 1) {
            level.innerHTML = 'Medium';
            level.addEventListener('click', () => {
                availableQuestions = questions.filter(question => question.difficulty === 'medium');
                score = 0;
                getNewQuestion();
            });
        } else {
            level.innerHTML = 'Hard';
            level.addEventListener('click', () => {
                availableQuestions = questions.filter(question => question.difficulty === 'hard');
                score = 0;
                getNewQuestion();
            });
        }
        document.querySelector('.difficulty').appendChild(level);
    }
}




// Function to throw in a random question from the available questions and also display the answers
function getNewQuestion() {
    returnButton.classList.remove('hide');
    gameBox.classList.remove('hide');
    if (availableQuestions.length === 0) {
        gameOver();
        return;
    }
    answersDiv.innerHTML = '';

    const questionSelector = Math.floor(Math.random() * availableQuestions.length);
    let currentQuestion = availableQuestions[questionSelector];
    availableQuestions.splice(questionSelector, 1);
    const questionElement = document.querySelector('.question');
    questionElement.innerHTML = `<strong> Question </strong> : <br> ${currentQuestion.question}`;

    displayAnswers(currentQuestion);
    updateScore();
}

function displayAnswers(currentQuestion, levelSelected) {
    // Adding paragraph
    const answersPara = document.createElement('div');
    answersPara.innerHTML = 'Choose the correct answer:';
    answersPara.classList.add('answerPara');
    answersDiv.appendChild(answersPara);
    // Adding the correct answer to the incorrect answers array
    if (!currentQuestion.incorrect_answers.includes(currentQuestion.correct_answer)) {
        currentQuestion.incorrect_answers.push(currentQuestion.correct_answer);
    }
    // Shuffling the answers after adding the correct answer
    currentQuestion.incorrect_answers.sort(() => Math.random() - 0.5);

    // Displaying the answers
    currentQuestion.incorrect_answers.forEach((answer) => {
        //* Create a div element for each answer
        const answerElement = document.createElement('div');
        answerElement.innerHTML = answer;
        answerElement.classList.add('answer');
        answerElement.classList.add('button');
        //* Add an event listener to check if the answer is correct
        answerElement.addEventListener('click', () => {
            if (!allowClick) return; // Prevent clicking if allowClick is false
            allowClick = false; // Disable further clicks
            if (answer === currentQuestion.correct_answer) {
                if (quizCheck) {
                    if (currentQuestion.difficulty === 'easy') {
                        score += 3;
                    }
                    else if (currentQuestion.difficulty === 'medium') {
                        score += 5;
                    }
                    else {
                        score += 7;
                    }
                }
            }
            else if (quizCheck && answer !== currentQuestion.correct_answer) {
                mistakes++;
                showAnswersColor(currentQuestion);
                if (mistakes === 3) {
                    setTimeout(gameOver, 500);
                    return;
                }
            }
            showAnswersColor(currentQuestion);
            setTimeout(() => {
                getNewQuestion(levelSelected);
                allowClick = true; // Re-enable clicks after timeout
            }, 2000);
        });
        answersDiv.appendChild(answerElement);
    });
};
// used to show the correct answer in green and the incorrect answers in red after the user selects an answer
function showAnswersColor(currentQuestion) {
    const currentAnswers = document.querySelectorAll('.answer');
    currentAnswers.forEach((answer) => {
        if (answer.innerHTML === currentQuestion.correct_answer) {
            answer.classList.add('correct');
        } else {
            answer.classList.add('incorrect');
        }
    });
}



function updateScore() {
    if (localStorage.getItem('highScore') < score) {
        localStorage.setItem('highScore', score);
    }
    if (quizCheck) {
        scoreDiv.innerHTML = `Score: ${score} , Question Reamin: ${availableQuestions.length} , Mistakes Left:${3 - mistakes} <br> High Score: ${localStorage.getItem('highScore') ?? 0}`;
    }
    else {
        scoreDiv.innerHTML = `Question Reamin: ${availableQuestions.length}`;
    }
}

function gameOver() {
    popUp = document.createElement('div');
    popUp.classList.add('popUp');
    popUp.innerHTML = `<div class="popUpBox">Game Over! <br> Your Score Is ${score}</div>`;
    document.body.appendChild(popUp);
    startOverButton = document.createElement('button');
    startOverButton.classList.add('button');
    startOverButton.innerHTML = 'Try Again';
    startOverButton.addEventListener('click', () => {
        popUp.remove();
        startAgain();
    });
    document.querySelector('.popUpBox').appendChild(startOverButton);
}

function startAgain() {
    chooseButtonsDisplay.classList.remove('hide');
    document.querySelector('.difficulty').innerHTML = '';
    document.querySelector('.question').innerHTML = '';
    answersDiv.innerHTML = '';
    scoreDiv.innerHTML = '';
    mistakes = 0;
    gameBox.classList.add('hide');
    returnButton.classList.add('hide');
    allowClick = true;
}