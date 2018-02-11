// get reference to canvas
var canvas = document.getElementById("myCanvas");
console.log(canvas);
// store 2D rendering context; the actual tool we canuse to paint on the canvas
var ctx = canvas.getContext("2d");

//
var paused = false;
var pausePressed = false;

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
var paddleHeight = ballRadius;
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
    if(!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();

        dx = ballSpeedPerSecondX * delta;
        dy = ballSpeedPerSecondY * delta;

        // wall detection
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
            ballSpeedPerSecondX = -ballSpeedPerSecondX;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
            ballSpeedPerSecondY = -ballSpeedPerSecondY;
        } else if(y + dy > canvas.height-ballRadius) { // game over detection
            if((x > paddleX) && (x < paddleX + paddleWidth)) {
                dy = -dy;
                ballSpeedPerSecondY = -ballSpeedPerSecondY;
            } else {
                // alert("GAME OVER");
                document.location.reload();
            }

        }
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += paddleSpeedPerSecond * delta;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= paddleSpeedPerSecond * delta;
        }

        x += dx;
        y += dy;

        requestAnimFrame();
    } else {
        lastCalledTime = Date.now();
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