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

var previousImage = null;
var detectClick = true;
var wrongCount = 0;
var pairsLeft = 8;

//when document is ready
$(document).ready(function() {
    $('#start-game').click(function() {
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

        var startTime = Date.now();
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        $('#wrong-matches').text(wrongCount);
        $('#matches-left').text(pairsLeft);
        $('#matches-made').text(8 - pairsLeft);

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
                            previousImage = null;
                            pairsLeft--;

                        } else {
                            detectClick = false;
                            wrongCount++;
                            window.setTimeout(function () {
                                flipTile(tile, clickedImg);
                                flipTile(previousTile, previousImage);
                                previousImage = null;
                                detectClick = true;
                            }, 1000);
                            console.log(wrongCount, pairsLeft);
                        }
                    } else {
                        previousImage = clickedImg;
                    }
                }
            }
        });
    });
});

function newGame() {

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
        console.log('They matched');
        return true;
    } else {
        console.log('They dont match');
        return false;
    }
}