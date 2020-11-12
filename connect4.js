"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

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
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  return 0;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(row, col) {
  let piece = document.createElement("div");
  piece.classList.add("piece");
  
  if(currPlayer===1){
    piece.classList.add("player1");
  } else {
    piece.classList.add("player2");
  }

  let cell = document.getElementById(`${row}-${col}`);
  cell.append(piece); 
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
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
  board[row][col] = currPlayer===1? "red" : "black";

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie. Could be more efficient to put in place counter
  let isTie = true; //boolean test for a tie
  for(let y=0; y<HEIGHT; y++){
    if(board[y].some( x => x === null)){
      isTie = false; 
      break;
    }; 
  }
  if(isTie) {
    return endGame("It's a tie!");
  }
  
  // switch players
  if(currPlayer===1){
    currPlayer = 2;
  } else {
    currPlayer = 1; 
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [row, col], [row, col], [row, col], [row, col] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    //TODO: Check four cells to see if they're all legal & all color of current
    //player

  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

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

makeBoard();
makeHtmlBoard();
