//Test board has been made and is not an empty array
describe("makeBoard", function(){
  it("should return a board", function (){
    expect(board).not.toEqual([]);
  });
  it("should return board with number of rows equal to HEIGHT", function (){
    expect(board.length).toEqual(HEIGHT);
  });
  it("should return board with number of columns equal to WIDTH", function (){
    expect(board[0].length).toEqual(WIDTH);
  });
});

//Test possibleRow returns the bottom row given first columne
describe("findSpotForCol", function(){
  it("should return possibleRow of HEIGHT-1", function (){
    expect(findSpotForCol(0)).toEqual(HEIGHT-1);
  });
});

//Test checkForWin() 
// it should return true if board state is a win
// it should return false if board state is not a win
describe("_win", function() {
  let row = 0;
  let col = 0;
  let horiz = [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]];

  it("should return false for illegal cells", function() {
    expect(_win([[-1,0], [-2,-1], [-3,-3], [-4,-4]])).toBe(false);
  });

  it("should return false if the colors do not match", function() {
    expect(_win(horiz)).toBe(false);
  });

  it("should return true if the cells are matching colors", function() {
    // mutating first row horizontally to be meatching
    fillBoardHorizontal(row, col, PLAYER_ONE_COLOR);
    expect(_win(horiz)).toBe(true);
    fillBoardHorizontal(row, col, null);
  });
});

function fillBoardHorizontal(row, col, color) {
  for (i = 0; i < 4; i++) {
    board[row][col + i] = color;
  }
}