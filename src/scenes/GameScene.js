import 'phaser';
import config from '../config/config'
 
export default class GameScene extends Phaser.Scene {

  constructor () {
    super('Game');
    this.board = new Array(6); // Create a board to keep track of available cells
    this.xList, this.yList, this.helpText;
    this.gameFinished, this.isMoving, this.targetPos, this.enemyTurn, this.piece, this.bg, this.hovering;
    this.game = window.game;
  }

  preload() {
      // Pre-load all assets before the game starts
      this.load.image('background', './src/assets/background.png');
      this.load.image('red', './src/assets/red.png');
      this.load.image('yellow', './src/assets/yellow.png');
      this.load.image('redglow', './src/assets/redglow.png');
      this.load.image('yellowglow', './src/assets/yellowglow.png');
      this.load.image('restartbutton', './src/assets/restartbutton.png');
  }
  
  create() {
      // Runs once when the game starts
      this.initialize(); // Initialize variables
      this.bg = this.add.sprite(500, 350, 'background');

      var restartButton = this.add.sprite(900, 600, 'restartbutton').setInteractive();
      restartButton.setTint(0x2B274F);
      restartButton.on('pointerdown', function(pointer) {
          window.game.scene.stop('Game');
          window.game.scene.start('Game');
      });
      restartButton.on('pointerover', function(pointer) {
          restartButton.setTint(0xFF2200);
          this.hovering = true;
      });
      restartButton.on('pointerout', function(pointer) {
          restartButton.setTint(0x2B274F);
          this.hovering = false;
      });

  }
  
  initialize() {
      // to initialize all variables
      for (var i = 0; i < 6; i++) {
          this.board[i] = [0, 0, 0, 0, 0, 0, 0];
      }

      this.xList = [168, 268, 368, 468, 568, 668, 768];
      this.yList = [67, 167, 267, 367, 467, 567];

      this.gameFinished = false;
      this.isMoving = false;
      this.targetPos = 0;
      this.enemyTurn = false;
      this.hovering = false;
  }
  
  getSections(board) {
      // Returns all possible sections of 4 positions that could result in a win
      var sections = new Array();
      // Horizontal Sections
      for (var j = 0; j < 4; j++)
          for (var i = 0; i < 6; i++)
              sections.push([board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3]]);
      // Vertical Sections
      for (var i = 0; i < 3; i++)
          for (var j = 0; j < 7; j++)
              sections.push([board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]]);
      // Negative-sloped Diagonal Sections
      for (var i = 0; i < 3; i++)
          for (var j = 0; j < 4; j++)
              sections.push([board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3]]);
      // Positive-sloped Diagonal Sections
      for (var i = 3; i < 6; i++)
          for (var j = 0; j < 4; j++)
              sections.push([board[i][j], board[i - 1][j + 1], board[i - 2][j + 2], board[i - 3][j + 3]]);
  
      return sections;
  }
  
  isWinner(board, player) {
      // Checks if player has won the game
      var sections = this.getSections(board);
      for (var i = 0; i < sections.length; i++) {
          var possible = true;
          for (var j = 0; j < 4; j++) {
              if (sections[i][j] != player) possible = false;
          }
          if (possible) return true;
      }
      return false;
  }
  
  sectionScore(section, player) {
      // Assigns a score to a section based on how likely player is to win/lose
      var score = 0;
      var selfCount = 0,
          opponentCount = 0,
          empty = 0;
  
      for (var i = 0; i < 4; i++) {
          if (section[i] == player) selfCount++;
          else if (section[i] == 3 - player) opponentCount++;
          else empty++;
      }
  
      if (selfCount == 4) score += 100;
      if (selfCount == 3 && empty == 1) score += 5;
      if (selfCount == 2 && empty == 2) score += 2;
      if (opponentCount == 3 && empty == 1) score -= 4;
  
      return score;
  }
  
  getScore(board, player) {
      // to assign a score to a board
      var score = 0;
      var sections = this.getSections(board);
  
      for (var i = 0; i < sections.length; i++)
          score += this.sectionScore(sections[i], player);
  
      for (var i = 0; i < 6; i++)
          if (board[i][3] == player) score += 3;
  
      return score;
  }
  
  isBoardFull(board) {
      // to check if any more moves are possible on the board
      for (var j = 0; j < 7; j++)
          if (board[0][j] == 0) return false;
      return true;
  }
  
  miniMax(board, depth, alpha, beta, player) {
      // Minimax Algorithm for AI to recursively find an optimal move
      if (this.isWinner(board, 2)) return [-1, 99999999];
      if (this.isWinner(board, 1)) return [-1, -99999999];
      if (this.isBoardFull(board)) return [-1, 0];
      if (depth == 0) return [-1, this.getScore(board, 2)];
  
      if (player == 2) {
          // Maximizing player
          var value = Number.NEGATIVE_INFINITY;
          var col = -1;
          for (var i = 0; i < 7; i++) {
              if (board[0][i] == 0) {
                  var boardCopy = new Array(6);
                  for (var k = 0; k < board.length; k++)
                      boardCopy[k] = board[k].slice();
                  var j = 5;
                  for (j; j >= 0; j--) {
                      if (boardCopy[j][i] == 0)
                          break;
                  }
                  boardCopy[j][i] = player;
                  var newScore = this.miniMax(boardCopy, depth - 1, alpha, beta, 3 - player)[1];
                  if (newScore > value) {
                      value = newScore;
                      col = i;
                  }
                  alpha = Math.max(alpha, value);
                  if (alpha >= beta) break;
              }
          }
          return [col, value];
      } else {
          // Minimizing player
          var value = Number.POSITIVE_INFINITY;
          var col = -1;
          for (var i = 0; i < 7; i++) {
              if (board[0][i] == 0) {
                  var boardCopy = new Array(6);
                  for (var k = 0; k < board.length; k++)
                      boardCopy[k] = board[k].slice();
                  var j = 5;
                  for (j; j >= 0; j--) {
                      if (boardCopy[j][i] == 0)
                          break;
                  }
                  boardCopy[j][i] = player;
                  var newScore = this.miniMax(boardCopy, depth - 1, alpha, beta, 3 - player)[1];
                  if (newScore < value) {
                      value = newScore;
                      col = i;
                  }
                  beta = Math.min(beta, value);
                  if (alpha >= beta) break;
              }
          }
          return [col, value];
      }
  }
  
  getConnectedPieces(board, winner) {
      // Returns an array of the co-ordinates of connected pieces of the winner
      var arr = new Array(6);
      for (var i = 0; i < 6; i++) {
          arr[i] = new Array(7);
          for (var j = 0; j < 7; j++)
              arr[i][j] = i * 7 + j;
      }
  
      var sections = this.getSections(board);
      var arraySections = this.getSections(arr);
      var positions = new Array();
      for (var i = 0; i < sections.length; i++) {
          if (sections[i].toString() == [winner, winner, winner, winner].toString()) {
              for (var j = 0; j < 4; j++) {
                  var pos = arraySections[i][j];
                  positions.push([this.xList[pos % 7], this.yList[Math.floor(pos / 7)]]);
              }
              break;
          }
      }
      return positions;
  }
  
  update() {
      this.game.canvas.style.cursor = "default"; // Default cursor
      if (this.hovering)
          this.game.canvas.style.cursor = "pointer"; // Change to pointer cursor
  
      if (this.gameFinished) return; // Do nothing if game is over
  
      if (this.isMoving && !this.enemyTurn) {
          // Player's piece is moving
          this.piece.y = Math.min(this.piece.y + 10, this.targetPos);
          if (this.piece.y == this.targetPos) {
              if (this.isWinner(this.board, 1)) { // If player 1 has won
                  this.gameFinished = true;
                  var positions = this.getConnectedPieces(this.board, 1);
                  for (var k = 0; k < 4; k++) {
                      this.add.sprite(positions[k][0], positions[k][1], 'redglow').setOrigin(0, 0);
                  }
                  this.add.text(350, 10, 'YOU WON THE GMAE !', {
                      fill: '#2b274f',
                      font: 'bold 22px Tahoma'
                  });
                  return;
              }
              this.enemyTurn = !this.enemyTurn;
              var opponentMove = this.miniMax(this.board, 5, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 2)[0];
              this.piece = this.add.sprite(this.xList[opponentMove], 400, 'yellow').setOrigin(0, 0);
              this.piece.setScale(.5)
              for (i = 5; i >= 0; i--) {
                  if (this.board[i][opponentMove] == 0) {
                      this.board[i][opponentMove] = 2;
                      this.targetPos = this.yList[i];
                      break;
                  }
              }
          }
          return;
      } else if (this.isMoving) {
          // AI's piece is moving
          this.piece.y = Math.min(this.piece.y + 10, this.targetPos);
          if (this.piece.y == this.targetPos) {
             this.enemyTurn = false;
             this.isMoving = false;
              if (this.isWinner(this.board, 2)) { // If player 2 has won
                  this.gameFinished = true;
                  var positions = this.getConnectedPieces(this.board, 2);
                  for (var k = 0; k < 4; k++) {
                      let temp = this.add.sprite(positions[k][0], positions[k][1], 'yellowglow').setOrigin(0, 0);
                      temp.setScale(0.5)
                  }
                  this.add.text(350, 10, 'YOU LOST THE GAME !', {
                      fill: '#2b274f',
                      font: 'bold 22px Tahoma'
                  });
                  return;
              } else if (this.isBoardFull(this.board)) {
                  this.gameFinished = true;
                  this.add.text(350, 10, 'GAME ENDED IN DRAW', {
                      fill: '#2b274f',
                      font: 'bold 22px Tahoma'
                  });
              }
          }
          return;
      }
  
      var pointer = this.input.activePointer;
      var column = -1;
      var ypos = pointer.worldY;
      for (var i = 0; i < 7; i++) {
          var dist = pointer.worldX - this.xList[i];
          if (!this.board[0][i] && 0 <= dist && dist <= 66 && 67 <= ypos && ypos <= 640) {
              this.game.canvas.style.cursor = "pointer";
              column = i;
              break;
          }
      }
  
      if (column != -1 && pointer.primaryDown) {
          for (i = 5; i >= 0; i--) {
              if (this.board[i][column] == 0) {
                  this.board[i][column] = 1;
                  this.targetPos = this.yList[i];
                  this.piece = this.add.sprite(this.xList[column], 400, 'red').setOrigin(0, 0);
                  this.piece.setScale(.5)
                  this.isMoving = true;
                  break;
              }
          }
      }
  
  }
  
   
};

