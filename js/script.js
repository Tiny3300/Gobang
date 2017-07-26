var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#bfbfbf";

//加水印图片
var logo = new Image();
logo.src = "images/logo.jpg";
logo.onload = function () {
    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();

    oneStep(0, 0, true);
    oneStep(1, 1, false);


};

//画棋盘的横线和竖线
var drawChessBoard = function () {
    for (var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();

        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
};

var oneStep = function (i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
    if (me) {  //黑棋的颜色
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    } else {  //白棋
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }

    context.fillStyle = gradient;
    context.fill();
};