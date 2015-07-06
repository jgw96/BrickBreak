"use strict";

//my canvas
const canvas=document.querySelector("#myCanvas");
const ctx=canvas.getContext("2d");

//sound
const collectSound=document.querySelector("#collectSound");
const paddleSound=document.querySelector("#paddleHitSound");
const winSound=document.querySelector("#winSound");

let dx=3;
let dy=-3;
let x=canvas.width/2;
let y=canvas.height-30;
let ballRadius=10;
let color="#0095DD";

//paddle
let paddleHeight=10;
let paddleWidth=75;
let paddleX=(canvas.width-paddleWidth)/2;

//controls
let rightPressed=false;
let leftPressed=false;

//bricks
let brickRowCount=5;
//let brickColumnCount = 3;
let brickColumnCount=Math.floor(Math.random()*5)+3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//score
let score=0;

//lives
let lives=3;

//draw my ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

//draw my paddle
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
  ctx.fillStyle=color;
  ctx.fill();
  ctx.closePath();
}

//draw bricks
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//collision detection for bricks
function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    collectSound.play();
                    
                    //win
                    if(score == brickRowCount*brickColumnCount) {
                      winSound.play();
                      alert("YOU WIN, CONGRATULATIONS!"); 
                      document.location.reload();
                    }
                }
            }
        }
    }
}

//display score
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  x += dx;
  y += dy;
    
  //collision detection
  if(x+dx<ballRadius){
    dx=-dx;
  }
  else if(x+dx>canvas.width-ballRadius){
    dx=-dx;
  }

  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height-ballRadius) {
    //if paddle hits ball
    if(x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
        paddleSound.play();
    }
    else {
      lives--;
if(!lives) {
    alert("GAME OVER");
    document.location.reload();
}
else {
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 3;
    dy = 3;
    paddleX = (canvas.width-paddleWidth)/2;
}
    }
}
  
  //paddle detection
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  
  requestAnimationFrame(draw);
}

//control listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


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


draw();
