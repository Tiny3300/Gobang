var me = true; //黑子
var chessBoard = [];
var over = false;//true表示棋局结束


//赢法数组，保存ai的所有赢法，三维
var wins = [];

//赢法的统计数组，一维
var myWin = [];//我方
var computerWin = []; //ai方

for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
}

//初始化赢法数组
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

var count = 0;//赢法种数，0就是第一种赢法
//统计所有横线的赢法,如：i=0,j=10,k=0-4;表示第一行末端相连五子
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
//统计竖线
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}

//斜线
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}


//反斜线
for (var i = 0; i < 11; i++) {
    for (var j = 14; j>3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

console.log(count);

//初始化统计数组
for(var i=0;i<count;i++){
    myWin[i] = 0;
    computerWin[i] = 0;
}



var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = "#bfbfbf";

//加水印图片
var logo = new Image();
logo.src = "images/logo4.jpg";
logo.onload = function () {
    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();


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
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j *
        30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
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

chess.onclick = function (e) {
    if(over){
        return;
    }
    if(!me){//我方落子的时候才有效
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if (chessBoard[i][j] == 0) {//没有棋子的地方才准落子
        oneStep(i, j, me);
        chessBoard[i][j] = 1;




        for(var k=0;k<count;k++){
            if(wins[i][j][k]){//黑子在ij位置落下时
                myWin[k]++;   //第K种赢法向胜利前进了一步
                computerWin[k]=6;//白子在ij位置的第K种赢法没有了，设为异常6,最多五个

                if(myWin[k]==5){
                    over=true;
                    window.alert("你赢啦");

                }
            }
        }
        if(!over){
            me = !me;
            computerAI();
        }
    }
};

var computerAI = function () {
    var myScore = [];
    var computerScore = [];//两个数组都是二维
    var max = 0;  //最高分数
    var u= 0,v=0;   //最高分数点的坐标
    //初始化
    for(var i=0;i<15;i++){
        myScore[i] =[];
        computerScore[i]= [];
        for(var j=0;j<15;j++){
            myScore[i][j] = 0;
            computerScore[i][j] =0;
        }
    }
    //遍历整个棋盘
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoard[i][j] == 0){//如果是空闲的点
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k]==1){
                            myScore[i][j]+=200;
                        }else if(myWin[k]==2){
                            myScore[i][j]+=400;
                        }else if(myWin[k]==3){
                            myScore[i][j]+=2000;
                        }else if(myWin[k]==4){
                            myScore[i][j]+=10000;
                        }

                        if(computerWin[k]==1){
                            computerScore[i][j]+=220;
                        }else if(computerWin[k]==2){
                            computerScore[i][j]+=440;
                        }else if(computerWin[k]==3){
                            computerScore[i][j]+=2100;
                        }else if(computerWin[k]==4){
                            computerScore[i][j]+=20000;
                        }
                    }
                }
                if(myScore[i][j]>max){
                    max = myScore[i][j];
                    u=i;
                    v=j;
                }else if(myScore[i][j]==max){
                    if(computerScore[i][j]>computerScore[u][v]){
                        u=i;
                        v=j;
                    }
                }

                if(computerScore[i][j]>max){
                    max = computerScore[i][j];
                    u=i;
                    v=j;
                }else if(computerScore[i][j]==max){
                    if(myScore[i][j]>myScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);//让计算机选择在这里落子
   chessBoard[u][v] = 2;//计算机在这里落了子

    for(var k=0;k<count;k++){
        if(wins[u][v][k]){
            computerWin[k]++;   //第K种赢法向胜利前进了一步
           myWin[k]=6;//设为异常6,最多五个

            if(computerWin[k]==5){
                over=true;
                window.alert("计算机赢啦");
            }
        }
    }
    if(!over){
        me = !me;
    }
};

