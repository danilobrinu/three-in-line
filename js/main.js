/**
 * Create a screen
 */
var paper = Snap(300, 300);
/**
 *  Create a rect's 	
 */
var row, col;
var dashboard = paper.group();
var currentPlayer = 'circle';
var moveAvaible = [
  [true, true, true],
  [true, true, true],
  [true, true, true]
];
var player = {
  circle: [],
  cross: [],
};
/**
 * vars to display message if game finsished
 */
var 
  background = null,
  message = null,
  winner = null,
  winnerMessageAttr = {
    fill: 'rgba(255,255,255,.8)',
    'font-family': '"Helvetica Neue", Helvetica, sans-serif',
    'font-size': 24,
    'font-weight': 'bold',
    'text-anchor': 'middle'
  }, 
  restartButton = null,
  restartText = null;
var isWinner = function(playerMovements) {
  var resultOf = function(attr) {
    var count = {
      1: 0,
      2: 0,
      3: 0
    }; 
    for (var i = 0, l = playerMovements.length; i < l; ++i) {
      ++count['' + playerMovements[i][attr]];
    }
    return count['1'] == 3 || count['2'] == 3 || count['3'] == 3;
  };
  var diagonalResult = function() {
    var sameXY = 0;
    var diffXY = 0;
    for (var i = 0, l = playerMovements.length; i < l; ++i) {
      if ((playerMovements[i].x + playerMovements[i].y) % 2 == 0) {
        if (playerMovements[i].x == playerMovements[i].y) {
          ++sameXY
        } else {
          ++diffXY;
        }
      }
    }
    return sameXY == 3 || diffXY == 3;
  };
  return resultOf('x') || resultOf('y') || diagonalResult();
};
var winnerMessage = function() {
  background = paper.rect(150,150,1,1)
    .attr({stroke: '#34495e'})
    .animate({
      strokeWidth: 300
    }, 1000, mina.bounce);
  message = paper.text(150, 80, 'WINNER IS')
    .attr(winnerMessageAttr);
  winner = paper.text(150, 220, currentPlayer.toUpperCase())
    .attr(winnerMessageAttr);
  buttonRestart = paper.rect(75, 120, 150, 50)
    .attr({
      fill: '#2c3e50',
      'cursor': 'pointer'
    });
  textRestart = paper.text(150, 150, 'RESTART GAME')
    .attr({
      fill: '#fff',
      'font-family': 'monospace',
      'text-anchor': 'middle',
      'cursor': 'pointer'
    })
    .click(function(){
      window.location.reload();
    });
  paper.group(background, message, winner, buttonRestart, textRestart);
};
var drawMessage = function() {
  background = paper.rect(150,150,1,1)
    .attr({stroke: '#34495e'})
    .animate({
      strokeWidth: 300
    }, 1000, mina.bounce);
  message = paper.text(150, 80, 'THIS IS')
    .attr(winnerMessageAttr);
  winner = paper.text(150, 220, 'DRAW')
      .attr(winnerMessageAttr);
  restartButton = paper.rect(75, 120, 150, 50)
    .attr({
      fill: '#2c3e50',
      'cursor': 'pointer'
    });
  restartText = paper.text(150, 150, 'RESTART GAME')
    .attr({
      fill: '#fff',
      'font-family': 'monospace',
      'text-anchor': 'middle',
      'cursor': 'pointer'
    })
    .click(function(){
      window.location.reload(false);
    });
  paper.group(background, message, winner, restartButton, restartText);
};
var gameEnd = function() {
  var finished = true;
  for (row = 0; row < 3; ++row) {
    for (col = 0; col < 3; ++col) {
        if (moveAvaible[row][col]) {
          finished = false;
          break;
        }
    }
  }
  return finished;
};
var play = function() {
  if (!gameEnd()) {
    var position = this.data('xy');
    var x = position.x;
    var y = position.y;
    if (moveAvaible[x][y] == true) {
      var element;
      if (currentPlayer == 'circle') {
        paper.circle(x * 100 + 50, y * 100 + 50, 30)
          .attr({fill: 'rgba(0,0,0,0)', stroke: '#333', strokeWidth: 5})
          .animate({
            r: 40
          }, 300, mina.elastic);
      } else {
        // first diagonal of cross
        paper.path('M' + (x * 100 + 10) + ' ' + (y * 100 + 10) + 'L' + (x * 100 + 10) + ' ' + (y * 100 + 10))
          .attr({stroke: '#333', strokeWidth: 5})
          .animate({
            d: 'M' + (x * 100 + 10) + ' ' + (y * 100 + 10) + 'L' + (x * 100 + 90) + ' ' + (y * 100 + 90)
          }, 150, mina.easeinout);
        setTimeout(function(){
          // second diag
          paper.path('M' + (x * 100 + 90) + ' ' + (y * 100 + 10) + 'L' + (x * 100 + 90) + ' ' + (y * 100 + 10))
            .attr({stroke: '#333', strokeWidth: 5})
            .animate({
              d: 'M' + (x * 100 + 90) + ' ' + (y * 100 + 10) + 'L' + (x * 100 + 10) + ' ' + (y * 100 + 90)
            }, 150, mina.easeinout);
        }, 150);
      }
      player[currentPlayer].push({x: x + 1, y: y + 1});
      if (isWinner(player[currentPlayer])) {
        gameEnd = function(){ return true; };
        setTimeout(function(){
          winnerMessage();
        }, 200);
      } else {
        currentPlayer = (currentPlayer == 'circle' ? 'cross' : 'circle');
        moveAvaible[x][y] = false;
        /**
         * check is the last movement and game end
         * if winner no exist display draw message
         */
         if (gameEnd()) {
          if(!isWinner('circle') || !isWinner('cross')) {
            drawMessage();
          }
        }
      }
    }
  }
};
/**
 *  generate rectangles and set data and events
 */
for (row = 0; row < 3; ++row) {
	for (col = 0; col < 3; ++col) {
		var rectangle = paper.rect(row * 100, col * 100, 100, 100)
          .attr({fill: (row + col) % 2 == 0 ? '#fff' : '#3498db'})
          .data('xy', {x: row, y: col})
          .click(play);
		dashboard.add(rectangle);
	}
}