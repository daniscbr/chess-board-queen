/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  // create a board
  var solution = new Board({'n': n});
  // create a piece counter set to 0
  var counter = 0;
  // loop through rest of board
  for (let row = 0; row < n; row++) {
    for (let column = 0; column < n; column++) {
      // add a piece
      solution.togglePiece(row, column);
      // check if there are any rook conflicts
      if (solution.hasAnyRooksConflicts()) {
        // if so, remove piece
        solution.togglePiece(row, column);
      } else {
        counter++;
        //  increment piece counter
        //  check if counter = n, if so, return board
        if (n === counter) {
          return solution.rows();
        }
        // move next square
      }
    }
  }
  return null;
},

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {

  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
},

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolutionAtStartingPoint = function(startRow, startCol, n) {
  var board = new Board({'n': n});
  var counter = 0;
  board.togglePiece(startRow, startCol);

  for (let row = 0; row < n; row++) {
    for (let column = 0; column < n; column++) {
      if (!(startRow === row && startCol === column)) {
        board.togglePiece(row, column);
      }
      if (board.hasAnyQueensConflicts()) {
        board.togglePiece(row, column);
      } else {
        counter++;
        if (n === counter) {
          return board.rows();
        }
      }
    }
  }

  return null;
},


window.findNQueensSolution = function(n) {
  // same as find n rooks solution except check for queen conflicts
  if (n === 0) {
    return new Board({'n': 0}).rows();
  }

  // right now this only looks for solutions when we set the first piece
  // on 0,0. And our tests are failing when there are not solutions with
  // a piece on 0,0. What we'll need to do is create a 'starting point'
  // variable that starts at 0,0 and gets incremented if we don't find
  // any solutions.

  for (let row = 0; row < n; row++) {
    for (let column = 0; column < n; column++) {
      var result = findNQueensSolutionAtStartingPoint(row, column, n);
      //if (row === 0 && column === 1) { debugger; }
      if (result !== null) {
        return result;
      }
    }
  }

  return new Board({'n': n}).rows();

};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount =


  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
