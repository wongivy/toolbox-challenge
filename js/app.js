// app.js: our main javascript file for this app
"use strict";

var tiles = [];
var idx;
var tile;
for (idx =1; idx <= 32; idx++) {
    tiles.push ({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} //for each tile

var previousImage;
var detectClick;
var wrongCount;
var pairsLeft;
var timeElapsed;
var minute;
var seconds;
var startTime;

//when document is ready
$(document).ready(function() {
    $('#instructions').click(function () {
       alert("To play this game, click pairs of tiles to find matches. If the tiles match, " +
       "they will remain flipped over. Otherwise they will flip back over. Keep trying until you match all the tiles.");
    });

    $('#start-game').click(function() {
        newGame();
        timer();
        runGame();
    });
});

function newGame() {
    $('#game-board').empty();
    window.clearInterval(timeElapsed);
    previousImage = null;
    detectClick = true;
    wrongCount = 0;
    pairsLeft = 8;
    minute = 0;
    seconds = 0;

    tiles = _.shuffle(tiles);
    var selectedTiles = tiles.slice(0,8);
    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(tile);
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if(elemIndex > 0 && 0 == elemIndex % 4) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}

function runGame() {
    updateStats();
    $('#game-board img').click(function () {
        if(!detectClick) {
            return null;
        } else {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (!tile.flipped) {
                flipTile(tile, clickedImg);
                if (previousImage != null) {
                    var previousTile = previousImage.data('tile');
                    if (checkMatch(tile, previousTile)) {
                        previousTile.matched = true;
                        tile.matched = true;
                        $('#game-board').find(clickedImg).css('cursor', 'not-allowed');
                        $('#game-board').find(previousImage).css('cursor', 'not-allowed');
                        previousImage = null;
                        pairsLeft--;
                        window.setTimeout(function () {
                            if(pairsLeft == 0) {
                                winner();
                            }
                        }, 1000);
                    } else {
                        detectClick = false;
                        wrongCount++;
                        $('#game-board').find(clickedImg).css('cursor', 'not-allowed');
                        window.setTimeout(function () {
                            flipTile(tile, clickedImg);
                            flipTile(previousTile, previousImage);
                            $('#game-board').find(clickedImg).css('cursor', 'pointer');
                            $('#game-board').find(previousImage).css('cursor', 'pointer');
                            previousImage = null;
                            detectClick = true;
                        }, 1000);
                    }
                    updateStats();
                } else {
                    previousImage = clickedImg;
                    $('#game-board').find(previousImage).css('cursor', 'not-allowed');

                }
            }
        }
    });
}

function winner() {
    window.clearInterval(timeElapsed);
    if(window.confirm("Congrats! You won the game with " + wrongCount + " wrong matches! Do you want to play again or leave?")) {
        window.location.reload();
    } else {
        window.location = 'http://www.google.com';
    }

}

function timer() {
    startTime = Date.now();
    timeElapsed = window.setInterval(function() {
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        elapsedSeconds = Math.floor(elapsedSeconds);
        seconds = elapsedSeconds % 60;
        if(seconds == 0) {
            minute++;
            seconds = 0;
        }
        if (minute == 0) {
            $('#elapsed-seconds').text(seconds + ' seconds');
        } else if (minute == 1){
            if(seconds == 0) {
                $('#elapsed-seconds').text(minute + ' minute ');
            } else {
                $('#elapsed-seconds').text(minute + ' minute ' + seconds + ' seconds');
            }
        }else if(seconds == 0){
            $('#elapsed-seconds').text(minute + ' minutes ');
        } else {
            $('#elapsed-seconds').text(minute + ' minutes ' + seconds + ' seconds');
        }

    }, 1000);
}

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if(tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}

function checkMatch(tile, previousTile) {
    if (previousTile.src == tile.src) {
        return true;
    } else {
        return false;
    }
}

function updateStats () {
    $('#wrong-matches').text(wrongCount);
    $('#matches-left').text(pairsLeft);
    $('#matches-made').text(8 - pairsLeft);
}