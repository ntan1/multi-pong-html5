// TODO: import graphics and sounds
// TODO: implement lives
// TODO: improve brick removal and drawing
// TODO: improve ball randomization so don't get unwinnable situations


// get reference to canvas
var canvas = document.getElementById("myCanvas");
console.log(canvas);
// store 2D rendering context; the actual tool we canuse to paint on the canvas
var ctx = canvas.getContext("2d");

//
var paused = false;
var pausePressed = false;
var score = 0;
var won = false;

// request last animation frame
var set_fps = 60;
var lastCalledTime;
var fps;

// controls
var rightPressed = false;
var leftPressed = false;

// ball
// var x = canvas.width/2;
var dx;
var dy;
var ballRadius = 10;
var ballSpeedPerSecondX = 150;
var ballSpeedPerSecondY = -200;
var x = Math.floor(Math.random() * (canvas.width - ballRadius) + ballRadius);
var y = canvas.height-30;
var bry;
var brx;

// paddle
var paddleHeight = ballRadius;
var paddleWidth = 90;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleSpeedPerSecond = 300;

// bricks
var brickRows = 3;
var brickColumns = 6;
var brickStartX = canvas.width/brickColumns;
var brickX = brickStartX;
var brickY = 40;
var brickWidth = 50;
var brickHeight = 20;
var bricks = [];

// set bricks
for(var r=0; r<brickRows; r++) {
    bricks[r] = [];
    for(var c=0; c<brickColumns; c++) {
        bricks[r][c] = {"x": brickX, "y": brickY};
        brickX += brickWidth;
    }
    brickX = brickStartX;
    brickY += brickHeight;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawText(text, x, y, text_color) {
    ctx.font = "30px Arial";
    ctx.fillStyle = text_color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function drawBricks() {
    ctx.beginPath();
    for(var row=0; row<bricks.length; row++) {
        for(var col=0; col<bricks[0].length; col++) {
            var bx = bricks[row][col].x;
            var by = bricks[row][col].y;
            // console.log("r:" + row + " c:" + col + " x: "+ bx + " y: "+ by);
            // improve this
            if(bx > 0 && by > 0) {
                ctx.strokeStyle = "#0095DD";
                ctx.strokeRect(bx, by, brickWidth, brickHeight);
            }
        }
    }
    ctx.closePath();
}

function updateScore() {
    score++;
    document.getElementById('score').innerHTML = score;
}

function gameOver() {

}

function checkWin() {
    if(score==brickRows*brickColumns) {
        won = true;
    }
}

function draw() {
    if(!paused && !won) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        checkWin();
        drawBall();
        drawPaddle();
        drawBricks();

        dx = ballSpeedPerSecondX * delta;
        dy = ballSpeedPerSecondY * delta;

        // change sign of ballRadius depending on direction
        bry = Math.sign(dy) * ballRadius;
        brx = Math.sign(dx) * ballRadius;

        // brick collision detection
        for(var row=0; row<bricks.length; row++) {
            for(var col=0; col<bricks[0].length; col++) {
                var bx = bricks[row][col].x;
                var by = bricks[row][col].y;
                // left and right side detection
                if((y > by && y < by + brickHeight) && (x + dx + brx > bx && x + dx + brx < bx + brickWidth)) {
                    dx = -dx;
                    ballSpeedPerSecondX = -ballSpeedPerSecondX;
                    bricks[row][col].x = -1000;
                    bricks[row][col].y = -1000;
                    console.log("left or rightside hit");
                    updateScore();
                } // top and bottom detection
                else if((x > bx && x < bx + brickWidth) && (y + dy + bry > by && y + dy + bry < by + brickHeight)) {
                    dy = -dy;
                    ballSpeedPerSecondY = -ballSpeedPerSecondY;
                    bricks[row][col].x = -1000;
                    bricks[row][col].y = -1000;
                    console.log("bottom or top hit");
                    updateScore();
                }
            }
        }

        // wall detection
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
            ballSpeedPerSecondX = -ballSpeedPerSecondX;
        }

        if(y + dy < ballRadius) {
            dy = -dy;
            ballSpeedPerSecondY = -ballSpeedPerSecondY;
        } else if(y + bry > canvas.height-ballRadius) { // paddle hit and game over detection
            if((x > paddleX) && (x < paddleX + paddleWidth)) {
                dy = -dy;
                ballSpeedPerSecondY = -ballSpeedPerSecondY;
            } else {
                // alert("GAME OVER");
                document.location.reload();
            }
        }

        // movement key detection
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += paddleSpeedPerSecond * delta;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= paddleSpeedPerSecond * delta;
        }

        x += dx;
        y += dy;

        requestAnimFrame();
    } else if(won) {
        drawText("YOU HAVE WON", canvas.width/2, canvas.height/2, "red");
    } else if(paused) {
        lastCalledTime = Date.now();
        drawText("GAME PAUSED", canvas.width/2, canvas.height/2, "red");
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    if(e.keyCode == 32 && !pausePressed) {
        paused = !paused;
        pausePressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    if(e.keyCode == 32 && pausePressed) {
        pausePressed = false;
    }
}

function requestAnimFrame() {
    if(!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
    //console.log("delta:" + delta + " fps:" + fps);
}


requestAnimFrame();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

requestAnimFrame();
setInterval(draw, 1000/set_fps);