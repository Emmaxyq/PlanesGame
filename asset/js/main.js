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
	hp:5
}

var enemyPlaneL = {
	width:110,
	height:164,
	imgSrc:'./asset/images/enemy-plane-l.png',
	boomSrc:'./asset/images/enemy-plane-l-boom.gif',
	boomTime:100,
	hp:15
}

var ourPlaneX = {
	width:66,
	height:80,
	imgSrc:'./asset/images/our-plane.gif',
	boomSrc:'./asset/images/our-plane-boom.gif',
	boomTime:100,
	hp:1
}

var bullet = {
	width:6,
	height:4,
	imgSrc:'./asset/images/our-bullet.png',
	speed:20
}

//创建飞机的构造函数
var Plane = function(centerX,centerY,planeModel,speed){
	this.centerX = centerX;
	this.centerY = centerY;
	this.sizeX = planeModel.width;
	this.sizeY = planeModel.height;
	this.imgSrc = planeModel.imgSrc;
	this.boomSrc = planeModel.boomSrc;
	this.boomTime = planeModel.boomTime;
	this.hp = planeModel.hp;
	this.speed = speed;
	this.currentX = this.centerX - this.sizeX/2;
	this.currentY = this.centerY - this.sizeY/2;
}

//画出一个飞机的方法
Plane.prototype.draw = function(){
//	this.imgNode = document.createElement('img');   、、写法1
	this.imgNode = new Image();
	this.imgNode.src = this.imgSrc;
	this.imgNode.style.left = this.centerX - this.sizeX/2 + 'px';
	this.imgNode.style.top = this.centerY - this.sizeY/2 + 'px';
	mainDiv.appendChild(this.imgNode);
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
	return this.isOverBottom = this.currentY >= stageSizeY - this.sizeY;
//	if(this.currentY >= stageSizeY - this.sizeY){
//		console.log('到底了！');
//		mainDiv.removeChild(this.imgNode);
//		clearInterval(timeS);
//	}else{
//		
//	}
}

//随机生成敌机的坐标 min-max
var randNumber = function(min,max){
	return Math.round(min + Math.random() * (max - min));
}

//敌机的构造函数
var Enemy = function(){
	this.segments = [];
	this.generateCount = 0;
};

//生成并所有敌机
Enemy.prototype.createNewEnemy = function(){
		this.generateCount++;
		if(this.generateCount%17 === 0){
			this.newEnemy =	new Plane(randNumber(enemyPlaneL.width/2,stageSizeX-enemyPlaneL.width/2),-enemyPlaneL.height/2,enemyPlaneL,1);
		}else if(this.generateCount%5 === 0){
			this.newEnemy =	new Plane(randNumber(enemyPlaneM.width/2,stageSizeX-enemyPlaneM.width/2),-enemyPlaneM.height/2,enemyPlaneM,randNumber(2,3));
		}else{
			this.newEnemy =	new Plane(randNumber(enemyPlaneS.width/2,stageSizeX-enemyPlaneS.width/2),-enemyPlaneS.height/2,enemyPlaneS,randNumber(3,5));
		}
		this.segments.push(this.newEnemy);
		this.newEnemy.draw();
}


//移动所有飞机
Enemy.prototype.moveAllEnemy = function(){
	for (var i=0;i<this.segments.length;i++) {
		this.segments[i].move();
		if(this.segments[i].isOverBottom){
			mainDiv.removeChild(this.segments[i].imgNode);
			this.segments.splice(i,1);
		}
	}
}

//实例化所有敌机
var enemies = new Enemy();
//enemies.createNewEnemy();
//enemies.moveAllEnemy();

//我方飞机
var ourPlane = new Plane(stageSizeX/2,stageSizeY-ourPlaneX.height/2,ourPlaneX,0);
ourPlane.draw();
mainDiv.onmousemove = function(ev){
	ourPlane.currentX = ev.clientX - contentDiv.offsetLeft - ourPlane.sizeX/2;
	ourPlane.currentY = ev.clientY - contentDiv.offsetTop - ourPlane.sizeY/2;
	ourPlane.centerX = ev.clientX - contentDiv.offsetLeft;
	if(ourPlane.centerX < ourPlane.sizeX/2){
		ourPlane.centerX = ourPlane.sizeX/2;
	}
	if(ourPlane.centerX > stageSizeX-ourPlane.sizeX/2){
		ourPlane.centerX = stageSizeX-ourPlane.sizeX/2;
	}
	ourPlane.centerY = ev.clientY - contentDiv.offsetTop;
	if(ourPlane.centerY < ourPlane.sizeY/2){
		ourPlane.centerY = ourPlane.sizeY/2;
	}
	if(ourPlane.centerY > stageSizeY-ourPlane.sizeY/2){
		ourPlane.centerY = stageSizeY-ourPlane.sizeY/2;
	}
	ourPlane.currentX = ourPlane.centerX - ourPlane.sizeX/2;
	ourPlane.currentY = ourPlane.centerY - ourPlane.sizeY/2;
	ourPlane.imgNode.style.left = ourPlane.currentX + 'px';
	ourPlane.imgNode.style.top = ourPlane.currentY + 'px';
}
//在我方飞机创建数组 用来保存发射的子弹
ourPlane.segement = [];

//子弹构造函数
var Bullet = function(centerX,centerY,bulletModel,speed){
	this.centerX = centerX;
	this.centerY = centerY;
	this.imgSrc = bulletModel.imgSrc;
	this.speed = speed;
	this.sizeX = bulletModel.width;
	this.sizeY = bulletModel.height;
	this.currentX = this.centerX - this.sizeX/2;
	this.currentY = this.centerY - this.sizeY/2;
}

//画子弹
Bullet.prototype.draw = function(){
	this.imgNode = new Image();
	this.imgNode.src = this.imgSrc;
	this.imgNode.style.left = this.centerX - this.sizeX/2 + 'px';
	this.imgNode.style.top = this.centerY - this.sizeY/2 + 'px';
	mainDiv.appendChild(this.imgNode);
}

Bullet.prototype.move = function(){
	this.checkOverTop();
	this.currentY -= this.speed;
	this.imgNode.style.top = this.currentY + 'px';
}

Bullet.prototype.checkOverTop = function(){
	this.isOverTop = this.currentY < 0;
}

//var b = new Bullet(ourPlane.centerX,ourPlane.centerY-ourPlane.sizeY/2,bullet,20);
//b.draw();
function creatNewBullet(){
	ourPlane.newBullet = new Bullet(ourPlane.centerX,ourPlane.centerY-ourPlane.sizeY/2,bullet,20);
	ourPlane.segement.push(ourPlane.newBullet);
	ourPlane.newBullet.draw();
}
function moveNewBullet(){
	for(var i = 0;i < ourPlane.segement.length;i++){
		ourPlane.segement[i].move();
		if(ourPlane.segement[i].isOverTop){
			mainDiv.removeChild(ourPlane.segement[i].imgNode);
			ourPlane.segement.splice(i,1);
		}
	}
}


var time = 0;
var mainDivDisplay = window.getComputedStyle(mainDiv,null).display;
//console.log(mainDivDisplay);
if(mainDivDisplay=='block' || !mainDivDisplay){
//	console.log('111');
	setInterval(function(){
		time++;
		if(time%50===0){
			enemies.createNewEnemy();
		}
		enemies.moveAllEnemy();
		if(time%5===0){
			creatNewBullet();
		}
		moveNewBullet()
	},30)
}


//var planes = new Plane(17,12,enemyPlaneS,10);
//planes.draw();

//var planem = new Plane(297,10,enemyPlaneM,5);
//planem.draw();
//
//var planel = new Plane(100,10,enemyPlaneL,2);
//planel.draw();

//var timeS = setInterval(function(){
//				planes.move();
//			},300);

//var timeM = setInterval(function(){
//				planem.move();
//			},400);