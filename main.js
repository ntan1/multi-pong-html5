// get reference to canvas
var canvas = document.getElementById("myCanvas");
console.log(canvas);
// store 2D rendering context; the actual tool we canuse to paint on the canvas
var ctx = canvas.getContext("2d");

// all paint instructions go between beginPath() and closePath()
ctx.beginPath();
ctx.rect(20, 40, 50, 50);
// x,y coordinates of arc center, arc radius, start and end angle in radians, direction of drawing (false=clockwise)
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.fillStyle = "#ff0000";
ctx.fill();
ctx.closePath();

// request last animation frame
var set_fps = 60;
var lastCalledTime;
var fps;

// ball
var x = canvas.width/2;
var y = canvas.height-30;
var dx;
var dy;
var ballRadius = 10;
var ballSpeedPerSecondX = 200;
var ballSpeedPerSecondY = -200;

// paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var paddleSpeedPerSecond = 300;

// controls
var rightPressed = false;
var leftPressed = false;

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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    dx = ballSpeedPerSecondX * delta;
    dy = ballSpeedPerSecondY * delta;

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        ballSpeedPerSecondX = -ballSpeedPerSecondX;
    }
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
        ballSpeedPerSecondY = -ballSpeedPerSecondY;
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        // paddleX += 7;
        paddleX += paddleSpeedPerSecond * delta;
    }
    else if(leftPressed && paddleX > 0) {
        // paddleX -= 7;
        paddleX -= paddleSpeedPerSecond * delta;
    }

    x += dx;
    y += dy;

    requestAnimFrame();
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
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