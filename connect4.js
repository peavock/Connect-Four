// Connect Four
//
// Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
// column until a player gets four-in-a-row (horiz, vert, or diag) or until
// board fills (tie)

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

// makeBoard: create in-JS board structure:
//    board = array of rows, each row is array of cells  (board[y][x])
//
let startGameButton = document.getElementById('start');

let name1 = document.querySelector('input[name = "name1"]');;
let name2 = document.querySelector('input[name = "name2"]');

let color1 = document.querySelector('input[name = "color1"]');
let color2 = document.querySelector('input[name = "color2"]');

/*startGameButton.addEventListener('click',function(){
  color2 = document.querySelector('input[name = "color2"]');
  console.log(color2.value);

})*/

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    for (let i = 0; i<HEIGHT; i++){
      board.push(Array.from({length: WIDTH}));
    }
}

// makeHtmlBoard: make HTML table and row of column tops. 
/*FAKEBOARD = [
  T [0,1,2,3,4,5,6], TOP
  0 [0-0,0-1,0-2,0-3,0-4,0-5,0-6],
  1 [1-0,1-1,1-2,1-3,1-4,1-5,1-6],
  2 [2-0,2-1,2-2,2-3,2-4,2-5,2-6],
  3 [3-0,3-1,3-2,3-3,3-4,3-5,3-6],
  4 [4-0,4-1,4-2,4-3,4-4,4-5,4-6],
  5 [5-0,5-1,5-2,5-3,5-4,5-5,5-6]
]*/

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // TODO: create a top row and add cells to match the width
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  
  htmlBoard.append(top);

  // TODO: create the additional rows and give them an id of y - x
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++){
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


//  findSpotForCol: given column x, return top empty y (null if filled) 

function findSpotForCol(x){
  // TODO: write the real version of this, rather than always returning 0
    for(let y = HEIGHT-1; y>=0; y--){
      if(!board[y][x]){
        return y;
      }
    }
  return null;
}



// placeInTable: update DOM to place piece into HTML table of board 

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const chip = document.createElement('div');
  chip.classList.add('piece');
  //chip.classList.add(`p${currPlayer}`);
  chip.style.top = -50 * (y+2);
  chip.style.backgroundColor = currPlayer===1 ? color1.value: color2.value;

  const cell = document.getElementById(`${y}-${x}`);
  cell.append(chip);
}

// endGame: announce game end 

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(function(){
    alert(msg);
  },250);
}




// handleClick: handle click of column top to play piece

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  //console.log(x);

 // get next spot in column (if none, ignore click)
 const y = findSpotForCol(x);
 //console.log(y);
 if (y === null) {
   return;
 }

 // place piece in board and add to HTML table
 // TODO: add line to update in-memory board
 board[y][x] = currPlayer;
 placeInTable(y, x);

 // check for win
 if (checkForWin()) {
    let winner = currPlayer ===1 ? name1.value : name2.value;
    document.body.style.backgroundColor = currPlayer ===1 ? color1.value : color2.value;
   return endGame(`${winner} won!`);
 }

 // check for tie
 // TODO: check if all cells in board are filled; if so call, call endGame
 if(board.every(val => val.every(cell => cell))){
   return endGame ('It\'s a Tie!');
 }
 
 // switch players
 // TODO: switch currPlayer 1 <-> 2
 currPlayer = currPlayer === 1 ? 2 : 1;
}


//checkForWin: check board cell-by-cell for "does a win start here?" 

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all VALUE currPlayer === same (color of current player)
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    //take a list of cells, iterate check if every one is currPlayer value - if so return true 
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // get every possible combination of four in a row cells horiz / vert / diagDR / diagDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      // pass each possibility of 4 cells through _win() and if return true, return true!
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
