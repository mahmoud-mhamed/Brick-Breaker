var canvas=window.myCanvas;
var ctx=canvas.getContext('2d');
var audio=document.getElementById('audio');

var ballRadius=7; //store ball size
var paddleHeight=10; //store height for paddle

var x=canvas.width/2; //store x for ball
var y=(canvas.height) - ballRadius - paddleHeight; //store y for ball

var ballPosition={x:[],y:[],dx:[],dy:[],state:[]}; //store x,y,dx,dy far all ball
ballPosition.x[0]=canvas.width/2;
ballPosition.y[0]=(canvas.height) - ballRadius - paddleHeight;
ballPosition.dx[0]=6;
ballPosition.dy[0]=-6;
ballPosition.state[0]=1;


//var dx=3; //store increase in x
//var dy=-3; //store increase in y

/*var ball = new Image();
ball.src = '22.jpg';*/ //make ball as image

var ballColor="#0095DD";//store ball color
var paddleColor="#0095DD";//store paddle Color
var paddleWidth=250; //store width for paddle
var paddleX=(canvas.width-paddleWidth)/2; //store position x for paddle
//move paddle when press right or left key in keybord
var rightPressed=false;
var leftPressed=false;

var brickRowCount=6;
var brickColumnCout=12
var brickWidth=78;
var brickHeight=20;
var brickPadding=10;
var brickOffsetTop=30;
var brickOffsetLeft=30;
var score=0;
var lives=3;
var level=1;
var maxLevel=7;

var bricks=[];
initBricks();
function initBricks() {
    for (c=0 ; c<brickColumnCout;c++){
        bricks[c]=[];
        for (r=0;r<brickRowCount;r++){
            bricks[c][r]={x:0,y:0,status:1};
        }
    }
}


var BricksColor=['red','red','yellow','yellow','orange','orange','grean','grean','violet','violet'];
function drowBricks(){
    for (c=0;c<brickColumnCout;c++){
        for (r=0;r<brickRowCount;r++){
            if (bricks[c][r].status==1) {
                var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;

                bricks[c][r].x=brickX;
                bricks[c][r].y=brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
				//تغير الالوان مع كل مستوي
				if(c+r<=10 && level==2)
					ctx.fillStyle=BricksColor[c+r];
				if(level==1)
					ctx.fillStyle=BricksColor[r];
				if(level==2)
					ctx.fillStyle=BricksColor[r-c];
				if(level==2)
					ctx.fillStyle=BricksColor[c-r];
				if(level==4)
					ctx.fillStyle=BricksColor[2*c-r];
				if(level==5)
					ctx.fillStyle=BricksColor[2*c-3*r];
				if(level==6)
					ctx.fillStyle=BricksColor[3*c-3*r];				
				if(level==maxLevel || level>6)
					ctx.fillStyle=BricksColor[parseInt(Math.random()*10)];
                //ctx.fillStyle=BricksColor[parseInt(Math.random()*10)];

                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//تحريك المضرب بالكيبورد

/*document.addEventListener("keydown",keyDownHandler);
document.addEventListener("keyup",keyUpHandler);*/
document.onkeydown=keyDownHandler;
document.onkeyup=keyUpHandler;
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
//رسم الكره
/*
function drowBall() {
    ctx.beginPath();
    //ctx.drawImage(ball, x, y, 10, 10); //make ball as image
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle=ballColor;
    ctx.fill();
    ctx.closePath();
}*/

//كل رسم الكره
function drowAllBall() {
    //ctx.drawImage(ball, x, y, 10, 10); //make ball as image
	for(i=0;i<ballPosition.x.length;i++){
		if(ballPosition.state[i]==0)
			continue;
		ctx.beginPath();
		ctx.arc(ballPosition.x[i],ballPosition.y[i],ballRadius,0,Math.PI*2);
		ctx.fillStyle=ballColor;
		ctx.fill();
		ctx.closePath();
	}
}

//رسم المضرب
function drowPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle=paddleColor;
    ctx.fill();
    ctx.closePath();
}

//كشف الاصتدام
function collisionDetection() {
    for (c=0;c<brickColumnCout;c++){
        for (r=0;r<brickRowCount;r++){
            var b=bricks[c][r];
            if (b.status == 1) {
				secondLoop:for(z=0;z<ballPosition.x.length;z++){
					if(ballPosition.state==0)
						continue secondLoop;
					if (ballPosition.x[z] > b.x&& ballPosition.x[z]< b.x + brickWidth && ballPosition.y[z] > b.y && ballPosition.y[z] < b.y+brickHeight){
						ballPosition.dy[z]=-ballPosition.dy[z];
						b.status=0;
						score ++;
						audio.src="point.mp3";
                        audio.play();
						if (score == brickRowCount*brickColumnCout){
							if (level==maxLevel){
								alert("YOU WIN, CONGRADULATIONS ! , Programer Mahmoud Mohamed");
								document.location.reload();
                                audio.src="win.mp3";
                                audio.play();
							}
							else {
								level++;
                                audio.src="newlevel.MP3";
                                audio.play();
								ballPosition.x.length=1;
								ballPosition.dx[0] = 2 * level;
								ballPosition.dy[0] = -2 * level;
								paddleX = (canvas.width - paddleWidth) / 2;
								brickRowCount++;
								initBricks();
								score = 0;
								ballPosition.x[0]=canvas.width/2;
								ballPosition.y[0]=canvas.height-30;
								paddleWidth =paddleWidth-20;
							}
						}
					}
				}
            }
        } 
    } 
}

//رسم الحياه
function drowLives() {
    ctx.font="22px Arial";
    ctx.fillStyle="white";
    ctx.fillText("lives:" + lives ,canvas.width-65,20);
}
//رسم النتيجه
function drowScore() {
    ctx.font="22px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Score:" + score ,8,20);
}

//رسم المستوي
function drowLevel() {
    ctx.font="22px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Level:" + level ,510,20);
}

//جلب البيانات من الفورم
function getData(){
	ballColor=document.getElementById('ballColor').value;
	paddleColor=document.getElementById('paddleColor').value;
	lives=document.getElementById('gameLive').value;
	maxLevel=document.getElementById('maxLevel').value;
	ballCount=document.getElementById('ballCount').value;
	for(i=1;i<ballCount;i++){
		ballPosition.x[i]=canvas.width/2;
		ballPosition.y[i]=(canvas.height) - ballRadius - paddleHeight;
		ballPosition.dx[i]=-2*i;
		ballPosition.dy[i]=4-i;
		ballPosition.state[i]=1;	
	}
	canvas.style.backgroundImage="url('"+document.getElementById('img').value+".jpg')";
	level=document.getElementById('level').value;
}
//رسم اللعبه
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drowBricks();
    //drowBall();
	drowAllBall();
    drowPaddle();
    collisionDetection();
    drowScore();
    drowLives();
    drowLevel();
    //move ball
    /*if (y + dy < ballRadius) {
        dy=-dy;
    }else if (y + dy > canvas.height - ballRadius - paddleHeight){
        if (x  >= paddleX  && x<= paddleX + paddleWidth){
            dy=-dy;
        } else {
            for (var i=0;i<100;i++)
            {
                if (y + dy < canvas.height - ballRadius) {
                    x +=dx;
                    y +=dy;
                    break;
                }else{
                    if (lives > 0) {
                        lives--;
                        x=canvas.width/2;
                        y=canvas.height-30;
                        dx =Math.abs(dx);
                        dy =-Math.abs(dy);
                        paddleX=(canvas.width-paddleWidth)/2;
                        x=canvas.width/2;
                        y=canvas.height - 30;
                    }
                    else {
                        alert("Game Over");
                        document.location.reload();
                    }
                }
            }
        }
    }
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx=-dx;
    }
    x +=dx;
    y +=dy;
	*/
	
	for(z=0;z<ballPosition.x.length;z++){
		if(ballPosition.state[z]==0)
			continue;
		if (ballPosition.y[z] + ballPosition.dy[z] < ballRadius && ballPosition.state[z]==1) {
			ballPosition.dy[z]=-ballPosition.dy[z];
			}else if (ballPosition.y[z] + ballPosition.dy[z] > canvas.height - ballRadius - paddleHeight){
				if (ballPosition.x[z]  >= paddleX  && ballPosition.x[z]<= paddleX + paddleWidth){
					ballPosition.dy[z]=-ballPosition.dy[z];
				} else {
					
						if (ballPosition.y[z] + ballPosition.dy[z] < canvas.height - ballRadius) {
							ballPosition.x[z] +=ballPosition.dx[z];
							ballPosition.y[z] +=ballPosition.dy[z];
							break;
						}else{
							if(lives>0 && ballPosition.state[z]==1){
								ballPosition.state[z]=0;
							}	
							var ballActiveCount=0;
							for(n=0;n<ballPosition.x.length;n++)
							{
								if(ballPosition.state[n]==1)
									ballActiveCount++;
							}
							
							if (lives > 0 && ballActiveCount==0) {
                                audio.src="GameOver_NewGame.MP3";
                                audio.play();

								lives--;

                                ballPosition.x.length=1;
								ballPosition.dx[0] =Math.abs(ballPosition.dx[0]);
								ballPosition.dy[0] =-Math.abs(ballPosition.dy[0]);
								ballPosition.state[0]=1;
								paddleX=(canvas.width-paddleWidth)/2;
								ballPosition.x[0]=canvas.width/2;
								ballPosition.y[0]=canvas.height - 30;


                            }
							else if(lives==0){
                                audio.src="lose.MP3";
                                audio.play();

                                alert("Game Over");
                                audio.src="GameOver_NewGame.MP3";

                                document.location.reload();
							}
						}
					
				}
			}
			if (ballPosition.x[z] + ballPosition.dx[z] > canvas.width - ballRadius || ballPosition.x[z] + ballPosition.dx[z] < ballRadius) {
				ballPosition.dx[z]=-ballPosition.dx[z];
			}
			ballPosition.x[z] +=ballPosition.dx[z];
			ballPosition.y[z] +=ballPosition.dy[z];
			}
	
	
	
	
	
	
	
	
	
    //mave paddle
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 30;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 30;
    }
    requestAnimationFrame(draw);
}
//التحرك بالموس
document.addEventListener("mousemove",mouseMoveHandler);
function mouseMoveHandler(e){
    var relativeX=e.clientX-canvas.offsetLeft;//offsetLeft عشان يشيل المارجين  والبوزيشن لو معمول
    if(relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
}
//setInterval(draw,10);














