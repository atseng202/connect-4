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
