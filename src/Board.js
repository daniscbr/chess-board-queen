// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    detectConflicts: function(array) {
      var sum = 0;
      for (var i = 0; i < array.length; i++) {
        sum += array[i];
        if (sum > 1) {
          return true;
        }
      }
      return false;
    },

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //


    hasRowConflictAt: function(rowIndex) {
      var row = this.rows()[rowIndex];
      return this.detectConflicts(row);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //

    getCol: function(colIndex) {
      var columnArray = [];
      for (var i = 0; i < this.rows().length; i++) {
        columnArray.push(this.rows()[i][colIndex]);
      }
      return columnArray;
    },

    hasColConflictAt: function(colIndex) {
      var column = this.getCol(colIndex);
      return this.detectConflicts(column);
    },


    hasAnyColConflicts: function() {
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //

    getDiagonal: function(diagonalColumnIndexAtFirstRow, type) {
      var diagonal = [];
      var columnIndex = diagonalColumnIndexAtFirstRow;
      if (type === 'major') {
        for (let rowIndex = 0; rowIndex < this.get('n'); rowIndex++) {
          if (this._isInBounds(rowIndex, columnIndex)) {
            diagonal.push(this.rows()[rowIndex][columnIndex]);

          }
          //step to next coordinate (X+1, Y+1)

        }
      } else {
        for (let rowIndex = 0; rowIndex < this.get('n'); rowIndex++) {
          if (this._isInBounds(rowIndex, columnIndex)) {
            diagonal.push(this.rows()[rowIndex][columnIndex]);
          }
          columnIndex--;
        }
      }
      return diagonal;
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var diagonal = this.getDiagonal(majorDiagonalColumnIndexAtFirstRow, 'major');
      return this.detectConflicts(diagonal);
    },

    hasAnyMajorDiagonalConflicts: function() {
      var n = this.get('n');

      for (var i = (-n + 2); i <= (n - 2); i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }

      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var diagonal = this.getDiagonal(minorDiagonalColumnIndexAtFirstRow, 'minor');
      return this.detectConflicts(diagonal);
    },

    hasAnyMinorDiagonalConflicts: function() {
      var n = this.get('n');

      for (var i = 1; i <= (2 * n) - 3; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }

      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
