"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 6;
const HEIGHT = 7;
const PLAYER_ONE_COLOR = 'red';
const PLAYER_TWO_COLOR = "black";

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let recentMove = [-1, -1];

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // making our H X W grid
  for (let row = 0; row < HEIGHT; row++) {
    board.push([]);
    
    // can use Array.fill instead
    for (let col = 0; col < WIDTH; col++) {
      board[row].push(null);
    }
  }

  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById("board");

  // create top row that listens for player click
  // click represents col where game piece will be placed
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // create individual col cells up to max WIDTH and then append to top row
  for (let col = 0; col < WIDTH; col++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", col);
    top.append(headCell);
  }
  // also append top row to game board
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let row = 0; row < HEIGHT; row++) {
    let gameRow = document.createElement("tr");

    for (let col = 0; col < WIDTH; col++) {
      let gameCell = document.createElement("td");

      gameCell.setAttribute("id", `${row}-${col}`);
      // you'll use this later, so make sure you use y-x

      gameRow.append(gameCell);

    }
    htmlBoard.append(gameRow);

  }

  // add event listener for undo button which may be hidden initially
  let undo = document.querySelector(".undo");
  undo.addEventListener("click", takeBackMostRecentMove);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(col) {
  // find the correct row index
  for (let possibleRow = HEIGHT - 1; possibleRow >= 0; possibleRow--) {
    if (board[possibleRow][col] === null) {
      return possibleRow;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(row, col) {
  // HTML update
  let piece = document.createElement("div");
  piece.classList.add("piece");
  
  piece.classList.add( currPlayer === 1 ? "player1" : "player2");

  let cell = document.getElementById(`${row}-${col}`);
  cell.append(piece); 

  //logic update
  [recentMove[0], recentMove[1]] = [row, col];
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
  let top = document.getElementById("column-top");
  top.removeEventListener("click", handleClick);

  // TODO: remove or hide undo button
  let undo = document.querySelector(".undo");
  undo.removeEventListener("click", takeBackMostRecentMove);
  undo.classList.remove("visible");
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get col from ID of clicked cell
  let col = +evt.target.id;

  // get the row available in column (if none, ignore click)
  let row = findSpotForCol(col);
  if (row === null) {
    return;
  }


  // place piece in board and add to HTML table
  placeInTable(row, col);

  // also adding undo button
  let htmlPieces = document.getElementsByClassName("piece");
  if (htmlPieces.length > 0) {
    document.querySelector(".undo").classList.add("visible");
  }

  board[row][col] = currPlayer === 1 ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(isTie()) {
  return endGame("It's a tie!");
  }

// switch players
currPlayer = (currPlayer === 1) ? 2 : 1;
}

/* Helper function tests board for a tie. 
    Tie takes place when board no longer has any squares equal to null. */
function isTie(){
  if(board[0].every( x => x !== null)){
    return true;
  }

  return false;
}

/** _win:
 * takes input array of 4 cell coordinates [ [row, col], [row, col], [row, col], [row, col] ]
 * returns true if all are legal coordinates for a cell & all cells match
 * currPlayer
 */
function _win(cells) {
  // plan: loop through each coord from input and check if they are within the boundaries of the board
  // next check if all 4 colors are the same
  // return false if any failed conditions, true otherwise

  let matchColor = (currPlayer === 1) ? PLAYER_ONE_COLOR : PLAYER_TWO_COLOR;
  for (let i = 0; i < cells.length; i++) {
    let [row, col] = cells[i];
    // check if not legal
    if (!(row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH)) {
      return false;
    }
    // check if current colors do not match
    if(board[row][col]!==matchColor){
      return false;
    }
  }
  return true;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {

      let horiz = [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]];
      let vert = [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]];
      let diagBLToTR = [[row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]];
      let diagBRToTL = [[row, col], [row - 1, col - 1], [row - 2, col - 2], [row - 3, col - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagBRToTL) || _win(diagBLToTR)) {
        return true;
      }
    }
  }
}

/* 
 * take the current board state and reset by 1 move
 */
function takeBackMostRecentMove() {
  // switch player
  currPlayer = (currPlayer === 1) ? 2 : 1;

  // use recent move to remove from board 
  let [row, col] = recentMove;
  board[row][col] = null;

  // remove from HTML the piece
  let cell = document.getElementById(`${row}-${col}`);
  cell.children[0].remove();
}

/*
 * Resets the game board after a winner has been determined 
 */
function resetBoard() {
  board = [];
  makeBoard();
  currPlayer = 1;

  // TODO: destroy htmlBoard 
  document.getElementById("board").remove();
}

makeBoard();
makeHtmlBoard();
