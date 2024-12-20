const gameZone = document.querySelector(".gameZone");
const startButton = document.querySelector(".startButton");
const resetButton = document.querySelector(".resetButton");
const turnDisplay = document.querySelector(".turnDisplay");
const popUp = document.querySelector(".popUp");
const popUpText = document.querySelector(".popUpText");
const popUpButton = document.querySelector(".popUpButton");
const instrections = document.querySelector(".instrections");

const gameCells = [];

const svgX = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="15" y1="15" x2="85" y2="85" stroke="black" stroke-width="2"/><line x1="85" y1="15" x2="15" y2="85" stroke="black" stroke-width="2"/>
</svg>`;

const svgO = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" stroke="black" stroke-width="2" fill="none"/></svg>`;

const player1 = "X";
const player2 = "O";
let currentPlayer = Math.random() < 0.5 ? player1 : player2;
let winner;
let winCountPlayer1 = 0;
let winCountPlayer2 = 0;

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
popUpButton.addEventListener("click", () => {
	popUp.style.display = "none";
	resetGame();
});
document.addEventListener("DOMContentLoaded", () => {
	if (sessionStorage.getItem("player1") && sessionStorage.getItem("player2")) {
		winCountPlayer1 = parseInt(sessionStorage.getItem("player1"));
		winCountPlayer2 = parseInt(sessionStorage.getItem("player2"));
		updateWinCount();
	}
});

function createGameCell() {
	for (let i = 1; i <= 9; i++) {
		const cell = document.createElement("div");
		cell.classList.add("cell");
		cell.addEventListener("click", handleCellClick);
		gameZone.appendChild(cell);
		gameCells.push(cell);
	}
}

function startGame() {
	createGameCell();
	turnDisplay.textContent = `${currentPlayer} מתחיל`;
	startButton.style.display = "none";
	gameZone.style.display = "grid";
	resetButton.style.display = "block";
	instrections.style.display = "none";
}

function handleCellClick(e) {
	const cell = e.target;
	if (cell.textContent === "") {
		cell.innerHTML = currentPlayer === player1 ? svgX : svgO;
		cell.classList.add(currentPlayer === "X" ? "X" : "O");
		turnSystem();
	} else {
		alert("This cell is already taken!");
	}
}

function turnSystem() {
	if (checkWinner()) {
		setTimeout(messege, 500);
		return;
	} else {
		if (currentPlayer === player1) {
			currentPlayer = player2;
		} else {
			currentPlayer = player1;
		}
		turnDisplay.textContent = `תור של ${currentPlayer}`;
	}
}

function resetGame() {
	gameCells.forEach((cell) => {
		cell.textContent = "";
		cell.classList.remove("X");
		cell.classList.remove("O");
	});
	currentPlayer = player1;
	turnDisplay.textContent = `${currentPlayer} מתחיל`;
}

function checkWinner() {
	const winPatterns = [
		[0, 1, 2], // rows
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6], // columns
		[1, 4, 7],
		[2, 5, 8], // diagonals
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let pattern of winPatterns) {
		if (gameCells[pattern[0]].classList.contains(currentPlayer) && gameCells[pattern[1]].classList.contains(currentPlayer) && gameCells[pattern[2]].classList.contains(currentPlayer)) {
			winner = currentPlayer;
			return true;
		}
	}

	if (gameCells.every((cell) => cell.innerHTML !== "")) {
		winner = "Draw!";
		return true;
	}

	return false;
}

function messege() {
	popUp.style.display = "flex";
	if (winner === "Draw!") {
		popUpText.textContent = "תיקו!";
		turnDisplay.textContent = "תיקו!";
	} else {
		popUpText.textContent = `${winner} המנצח!`;
		turnDisplay.textContent = `${winner} המנצח!`;
		if (winner === player1) {
			winCountPlayer1++;
		} else {
			winCountPlayer2++;
		}
		updateWinCount();
	}
}

const winCountPlayer1Display = document.querySelector(".winCountPlayer1");
const winCountPlayer2Display = document.querySelector(".winCountPlayer2");

function updateWinCount() {
	winCountPlayer1Display.innerHTML = `ניצחונות: ${winCountPlayer1}`;
	winCountPlayer2Display.textContent = `ניצחונות: ${winCountPlayer2}`;
	sessionStorage.setItem("player1", winCountPlayer1);
	sessionStorage.setItem("player2", winCountPlayer2);
}
