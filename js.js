var canvas=window.myCanvas;
var ctx=canvas.getContext('2d');

var ballRadius=8; //store ball size
var paddleHeight=10; //store height for paddle

var x=canvas.width/2; //store x for ball
var y=(canvas.height) - ballRadius - paddleHeight; //store y for ball

var ballPosition={x:[],y:[],dx:[],dy:[],state:[]}; //store x,y,dx,dy far all ball
ballPosition.x[0]=$('main div').width()/2;
ballPosition.y[0]=$('main div').height() - ballRadius - paddleHeight;
ballPosition.dx[0]=4;
ballPosition.dy[0]=-4;
ballPosition.state[0]=1;


//var dx=3; //store increase in x
//var dy=-3; //store increase in y

/*var ball = new Image();
ball.src = '22.jpg';*/ //make ball as image

var ballColor="#0095DD";//store ball color
var paddleColor="#0095DD";//store paddle Color
var paddleWidth=$('main div').width()/2-20; //store width for paddle
if (paddleWidth>250){
    paddleWidth=250;
}
var paddleX=($('main div').width()-paddleWidth)/2; //store position x for paddle
//move paddle when press right or left key in keybord
var rightPressed=false;
var leftPressed=false;

var brickWidth=60;
var brickHeight=20;
var brickRowCount=parseInt($('main div').height()/brickHeight*50/100);

var brickColumnCout=parseInt($('main div').width()/brickWidth-1);
var brickPadding=2;
var brickOffsetTop=50;
var brickOffsetLeft=30;
var score=0;
var lives=3;
var level=1;
var maxLevel=10;

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
$(window).resize(function () {
     brickRowCount=parseInt($('main div').height()/brickHeight*50/100);

     brickColumnCout=parseInt($('main div').width()/brickWidth-1);
    initBricks();
});


var BricksColor=['red','red','yellow','yellow','orange',
    'orange','grean','grean','violet','violet','#117a8b',
    '#ccc','#533f03','#34ce57','#efa2a9'];
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
					ctx.fillStyle=BricksColor[4*c-3*r];
				if(level==7)
					ctx.fillStyle=BricksColor[5*c-2*r];
                if(level==8)
                    ctx.fillStyle=BricksColor[6*c-2*r];
                if(level==9)
                    ctx.fillStyle=BricksColor[7*c-2*r];
                if(level==10)
                    ctx.fillStyle=BricksColor[7*c-3*r];
                if(level>10 &&level<16)
                    ctx.fillStyle=BricksColor[level*c-r*.8*level];
                if(level>15 )
                    ctx.fillStyle=BricksColor[level*c-r-10];

                if(level>20 )
                    ctx.fillStyle=BricksColor[level*c-r-18];
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
        ctx.fillStyle='yellow';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(ballPosition.x[i],ballPosition.y[i],ballRadius-2,0,Math.PI*2);
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
                        $('#audio')[0].currentTime=0;
                        $('#audio')[0].play();
						if (score == brickRowCount*brickColumnCout){
							if (level==maxLevel){
                                $('#myCanvas').exitFullscreen();
                                Swal({
                                    type: 'success',
                                    title: 'Programer Mahmoud Mohamed',
                                    text: 'YOU WIN, CONGRADULATIONS !',
                                    onClose: () => {
                                        document.location.reload();
                                    }
                                });
								clearInterval(intervalPlay);
                                $('#win')[0].currentTime=0;
                                $('#win')[0].play();
							}
							else {
								level++;
                                $('#newLevel')[0].currentTime=0;
                                $('#newLevel')[0].play();
                                var background=Math.trunc(Math.random()*10);
                                $('#myCanvas').css({
                                    backgroundImage:"url('img/bg"+background+".jpg')"
                                });
                                ballPosition.x.length=1;
								ballPosition.dx[0] = (2 - - level)<6?2 - - level:6;
								ballPosition.dy[0] = (-2 - level)<-6?-2  - level:-6;
								ballPosition.state[0]=1;
								paddleX = (canvas.width - paddleWidth) / 2;
								brickRowCount++;
								initBricks();
								score = 0;
								ballPosition.x[0]=canvas.width/2;
								ballPosition.y[0]=$('main div').height() - ballRadius - paddleHeight;
								paddleWidth =paddleWidth-5;
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
	ctx.drawImage(window.heart,canvas.width-70,10,30,30);
    ctx.font="30px Charm";
    ctx.fillStyle="white";
    ctx.fillText(" " + lives ,canvas.width-40,35,30);
}
//رسم النتيجه
function drowScore() {
    ctx.font="20px Charm";
    ctx.fillStyle="white";
    ctx.fillText("Score : " + score ,8,30);
}

//رسم المستوي
function drowLevel() {
    ctx.font="27px Charm";
    ctx.fillStyle="white";
    ctx.fillText("Level : " + level ,canvas.width/2-20,30);
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
		function getNum() {
            var dx=parseInt(Math.random()*10)- - 3;
            switch (dx) {
                case 12:
                case 11:
                case 10:
                    dx=6;
                    break;
                case 9:
                case 8:
                case 7:
                    dx=5;
                    break;
            }
            return dx;
        }
		ballPosition.dx[i]=-getNum();
		console.log(-getNum());
		ballPosition.dy[i]=-getNum();
		ballPosition.state[i]=1;
	}
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
                                $('#bollLose')[0].currentTime=0;
                                $('#bollLose')[0].play();

								lives--;

                                ballPosition.x.length=1;
								ballPosition.dx[0] =Math.abs(ballPosition.dx[0]);
								ballPosition.dy[0] =-Math.abs(ballPosition.dy[0]);
								ballPosition.state[0]=1;
								paddleX=(canvas.width-paddleWidth)/2;
								ballPosition.x[0]=canvas.width/2;
								ballPosition.y[0]=$('main div').height() - ballRadius - paddleHeight;

								draw();
                                clearInterval(intervalPlay);
                                setTimeout(play,2000);

                            }
							else if(lives==0){
                                $('#lose')[0].currentTime=0;
                                $('#lose')[0].play();
                                $('#myCanvas').exitFullscreen();
                                Swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'You Lose!',
                                    onClose: () => {
                                        document.location.reload();
                                    }
                                });
                                clearInterval(intervalPlay);
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
        paddleX += 10;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 10;
    }

    // requestAnimationFrame(draw);
}
//التحرك بالموس
document.addEventListener("mousemove",mouseMoveHandler);
function mouseMoveHandler(e){
    var relativeX=e.clientX-canvas.offsetLeft;//offsetLeft عشان يشيل المارجين  والبوزيشن لو معمول
    if(relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

$('#myCanvas').on('touchmove',function (e) {
    // player.x=parseInt(e.touches[0].clientX-c.offset().left -player.width/2);

    var relativeX=e.touches[0].clientX-canvas.offsetLeft;//offsetLeft عشان يشيل المارجين  والبوزيشن لو معمول
    if(relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
});

var intervalPlay;
function play() {
    clearInterval(intervalPlay);
    intervalPlay= setInterval(draw,15);
}




