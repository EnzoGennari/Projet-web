'use strict';
/* Variables globales */
var player = 1;
var score = [0, 0, 0];
var betweenGames = false;
var lineColor = "#ddd";

/* Paramètres du Canvas*/
var canvas = document.getElementById('tic-tac-toe-board');
var context = canvas.getContext('2d');

var canvasSize = 500;
var sectionSize = canvasSize / 3;
canvas.width = canvasSize;
canvas.height = canvasSize;
context.translate(0.5, 0.5);

/*Initialisation des affichages*/
document.getElementById("div_message").innerHTML = "Bienvenue dans ce morpion !";
document.getElementById("div_score1").innerHTML = score[1];
document.getElementById("div_score2").innerHTML = score[2];

/* Création du plateau de jeu */
function getInitialBoard (defaultValue) {
  var board = [];

  for (var x = 0;x < 3;x++) {
    board.push([]);

    for (var y = 0;y < 3;y++) {
      board[x].push(defaultValue);
    }
  }

  return board;
}

var board = getInitialBoard(0);

/* Ajout d'une pièce */
function addPlayingPiece (mouse) {
  var xCordinate;
  var yCordinate;

  for (var x = 0;x < 3;x++) {
    for (var y = 0;y < 3;y++) {
      xCordinate = x * sectionSize;
      yCordinate = y * sectionSize;

      if (
          mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
          mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize
        ) {

        if (board[x][y] == 0) {
          clearPlayingArea(xCordinate, yCordinate);
          if (player === 1) {
            drawX(xCordinate, yCordinate);
            board[x][y] = 1;
          } else {
            drawO(xCordinate, yCordinate);
            board[x][y] = 2;
          }
          testWinner(player)
          player = 3 - player;
        }
      }
    }
  }
}

/* Efface une case (et les lignes autour avec) */
function clearPlayingArea (xCordinate, yCordinate) {
  context.fillStyle = "#fff";
  context.fillRect(
    xCordinate,
    yCordinate,
    sectionSize,
    sectionSize
  ); 
}

/* Détermine si le winner gagne, teste l'égalité*/
function testWinner (winner) {
  var isWinning = false;
  for (var x = 0;x < 3;x++) {
    if (board[x][0] == winner && board[x][1] == winner && board[x][2] == winner) {
      isWinning = true;
    }
    if (board[0][x] == winner && board[1][x] == winner && board[2][x] == winner) {
      isWinning = true;
    }
  }
    if (board[0][0] == winner && board[1][1] == winner && board[2][2] == winner) {
      isWinning = true;
    }
    if (board[2][0] == winner && board[1][1] == winner && board[0][2] == winner) {
      isWinning = true;
    }

    if (isWinning) {
      if (winner == 1) {
        document.getElementById("div_message").innerHTML = "Vainqueur : X !";
      } else {
        document.getElementById("div_message").innerHTML = "Vainqueur : O !";
      }

      score[winner]++;
      document.getElementById("div_score1").innerHTML = score[1];
      document.getElementById("div_score2").innerHTML = score[2];
      betweenGames = true;
    }
    else{
/* Test si égalité */

      if (board[0][0] != 0 && board[0][1] != 0 && board[0][2] != 0 && board[1][0] != 0 && board[1][1] != 0 && board[1][2] != 0 && board[2][0] != 0 && board[2][1] != 0 && board[2][2] != 0) {
        document.getElementById("div_message").innerHTML = "Egalité !";
        betweenGames = true;
      }
    }
}

/* Affiche un O */
function drawO (xCordinate, yCordinate) {
  var halfSectionSize = (0.5 * sectionSize);
  var centerX = xCordinate + halfSectionSize;
  var centerY = yCordinate + halfSectionSize;
  var radius = (sectionSize - 100) / 2;
  var startAngle = 0;
  var endAngle = 2 * Math.PI;

  context.lineWidth = 10;
  context.strokeStyle = "#01bBC2";
  context.beginPath();
  context.arc(centerX, centerY, radius, startAngle, endAngle);
  context.stroke();
}

/* Affiche une X */
function drawX (xCordinate, yCordinate) {
  context.strokeStyle = "#f1be32";
  context.beginPath();
  var offset = 50;

  context.moveTo(xCordinate + offset, yCordinate + offset);
  context.lineTo(xCordinate + sectionSize - offset, yCordinate + sectionSize - offset);

  context.moveTo(xCordinate + offset, yCordinate + sectionSize - offset);
  context.lineTo(xCordinate + sectionSize - offset, yCordinate + offset);

  context.stroke();
}
/* Affiche le quadrillage de jeu */
function drawLines (lineWidth, strokeStyle) {
  var lineStart = 4;
  var lineLenght = canvasSize - 5;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.strokeStyle = strokeStyle;
  context.beginPath();

  /* Lignes horizontales */
  for (var y = 1;y <= 2;y++) {  
    context.moveTo(lineStart, y * sectionSize);
    context.lineTo(lineLenght, y * sectionSize);
  }

  /* Lignes verticales */
  for (var x = 1;x <= 2;x++) {
    context.moveTo(x * sectionSize, lineStart);
    context.lineTo(x * sectionSize, lineLenght);
  }

  context.stroke();
}

drawLines(10, lineColor);

function getCanvasMousePosition (event) {
  var rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

/* Gestion des clics */

canvas.addEventListener('mouseup', function (event) {

  if (betweenGames){ /* Cas exceptionnel : on reset le jeu */
    for (var x = 0;x < 3;x++) {
      for (var y = 0; y < 3; y++) {
        var xCordinate = x * sectionSize;
        var yCordinate = y * sectionSize;
        clearPlayingArea(xCordinate, yCordinate);
      }
    }
    board = getInitialBoard(0);
    document.getElementById("div_message").innerHTML = "";
    drawLines(10, lineColor);
    betweenGames = false;
  }
  else { /* Cas normal : on place une pièce */
    var canvasMousePosition = getCanvasMousePosition(event);
    addPlayingPiece(canvasMousePosition);
    drawLines(10, lineColor);
  }
});