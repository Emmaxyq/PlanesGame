//获取页面元素
var contentDiv = document.getElementById('content');
var startDiv = document.getElementById('start');
var mainDiv = document.getElementById('main');
var scoreDiv = document.getElementById('score');
var suspendDiv = document.getElementById('suspend');
var continueDiv = document.getElementById('continue');
var settlementDiv = document.getElementById('settlement');

//获取游戏界面宽高
var contentClass = contentDiv.currentStyle? continueDiv.currentStyle:window.getComputedStyle(contentDiv,null);
var stageSizeX = parseInt(contentClass.width);
var stageSizeY = parseInt(contentClass.height);

//创建不同飞机型号对象
var enemyPlaneS = {
	width:34,
	height:24,
	imgSrc:'./asset/images/enemy-plane-s.png',
	boomSrc:'./asset/images/enemy-plane-s-boom.gif',
	boomTime:100,
	hp:1
}

var enemyPlaneM = {
	width:46,
	height:60,
	imgSrc:'./asset/images/enemy-plane-m.png',
	boomSrc:'./asset/images/enemy-plane-m-boom.gif',
	boomTime:100,
	hp:1
}

var enemyPlaneL = {
	width:110,
	height:164,
	imgSrc:'./asset/images/enemy-plane-l.png',
	boomSrc:'./asset/images/enemy-plane-l-boom.gif',
	boomTime:100,
	hp:1
}

var enemyPlaneO = {
	width:66,
	height:80,
	imgSrc:'./asset/images/our-plane.gif',
	boomSrc:'./asset/images/our-plane-boom.gif',
	boomTime:100,
	hp:1
}

//创建飞机的构造函数
var Plane = function(centerX,centerY,planeModel,speed,timeMove){
	this.centerX = centerX;
	this.centerY = centerY;
	this.sizeX = planeModel.width;
	this.sizeY = planeModel.height;
	this.imgSrc = planeModel.imgSrc;
	this.boomSrc = planeModel.boomSrc;
	this.boomTime = planeModel.boomTime;
	this.hp = planeModel.hp;
	this.speed = speed;
	this.timeMove = timeMove;
	this.currentX = this.centerX - this.sizeX/2;
	this.currentY = this.centerY - this.sizeY/2;
}

//画出一个飞机的方法
Plane.prototype.draw = function(el){
//	this.imgNode = document.createElement('img');   、、写法1
	this.imgNode = new Image();
	this.imgNode.src = this.imgSrc;
	this.imgNode.style.left = this.centerX - this.sizeX/2 + 'px';
	this.imgNode.style.top = this.centerY - this.sizeY/2 + 'px';
	mainDiv.appendChild(this.imgNode);
	this.el = el;
	this.setIntervalMove();
	
}

//某个飞机移动方法
Plane.prototype.move = function(){
	this.checkOverRange();
//	console.log(this.currentY);
//	console.log(stageSizeY);
//	console.log(this.sizeY);
	if(stageSizeY - this.sizeY - this.currentY < this.speed){
		this.currentY += stageSizeY - this.sizeY - this.currentY;
	}else{
		this.currentY += this.speed;
	}
	this.imgNode.style.top = this.currentY +'px';
}

//检测飞机超出画布
Plane.prototype.checkOverRange = function(){
	if(this.currentY >= stageSizeY - this.sizeY){
//		console.log('到底了！');
		mainDiv.removeChild(this.imgNode);
		clearInterval(this.timeId);
	}else{
		
	}
}

//飞机定时器
Plane.prototype.setIntervalMove = function(){
	if(this.el){
		var targetPlane = this.el;
		this.timeId = setInterval(function(){
			targetPlane.move();
		},this.timeMove)
	}
}

var planes = new Plane(17,12,enemyPlaneS,10,300);
planes.draw(planes);

var planem = new Plane(297,10,enemyPlaneM,5,200);
planem.draw(planem);

var planel = new Plane(100,10,enemyPlaneL,2,100);
planel.draw(planel);

var planeo = new Plane(160,488,enemyPlaneO,2,100);
planeo.draw();