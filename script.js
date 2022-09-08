// It is an array which keeps a track of what's the iput in each box of the game, (either 'X' or 'O')
var origBoard;

const huPlayer = 'O';
const aiPlayer = 'X';

//These are the possbile chances in which a player Can Win
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

//It gets the reference of the table from the HTML code, as to which box has which player
const cells = document.querySelectorAll('.cell');

//StartGame function is goin to run 2 times as when player hits start & when player hits replay
startGame();

function startGame() {
    //This clears everything on the board
	document.querySelector(".endgame").style.display = "none";

    //An array of elements 0 to 8 = 9 elements
	origBoard = Array.from(Array(9).keys());

	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {

		// Turn function, takes in the block where human player has clicked
		turn(square.target.id, huPlayer)

		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {

    // It documents which player has clicked
	origBoard[squareId] = player;

	//It displays either 'X' or 'O' depending on the player. Also the 'document' object finds an element by element id
	document.getElementById(squareId).innerText = player;

	//Whenever a turn is taken we will check if the game is won
	let gameWon = checkWin(origBoard, player)

	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {

    // 'e' is the element in board and 'i' just loops and if 'e' == player, then we just concatenates its index 'i' in array 'a'
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);

	let gameWon = null;

    //Something......
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}

	//Returns 'null' if no one wins and returns the player if won
	return gameWon;
}

function gameOver(gameWon) {

	for (let index of winCombos[gameWon.index]) {
	    //If human player win then display blue and if AI wins display 'red'
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}

	//It will not let anyone click on the board if any player has won, coz the game's ended
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {

	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {

	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {

	if (emptySquares().length == 0) {

		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	}

	else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	}

	else if (availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];

	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}