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

var score = 0;

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
	hitSrc: './asset/images/enemy-plane-m-hit.png',
	boomSrc:'./asset/images/enemy-plane-m-boom.gif',
	boomTime:100,
	hp:3
}

var enemyPlaneL = {
	width:110,
	height:164,
	imgSrc:'./asset/images/enemy-plane-l.png',
	hitSrc: './asset/images/enemy-plane-l-hit.png',
	boomSrc:'./asset/images/enemy-plane-l-boom.gif',
	boomTime:100,
	hp:7
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
	this.hitSrc = planeModel.hitSrc ? planeModel.hitSrc : planeModel.boomSrc;
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
	this.checkBulletBoom();
	this.checkPlanBoom();
//	console.log(this.currentY);
//	console.log(stageSizeY);
//	console.log(this.sizeY);
	if(stageSizeY - this.sizeY - this.currentY < this.speed){
		this.currentY += stageSizeY - this.sizeY - this.currentY;
	}else{
		this.currentY += this.speed;
	}
	this.centerY = this.currentY + this.sizeY/2;  //移动时改变敌机的Y轴重心坐标  判断敌机与子弹是否碰撞时会用到
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

Plane.prototype.checkBulletBoom = function(){
	for(var i = 0;i < ourPlane.segement.length;i++){
		this.isBulletBoom = Math.abs(this.centerX - ourPlane.segement[i].centerX) <= this.sizeX/2 + ourPlane.segement[i].sizeX/2 && Math.abs(this.centerY - ourPlane.segement[i].centerY) <= this.sizeY/2 + ourPlane.segement[i].sizeY/2
		if(this.isBulletBoom){
			break;
		}
	}
//	console.log(this.isBulletBoom);
}

Plane.prototype.checkPlanBoom = function(){
	this.isPlanBoom = Math.abs(this.centerX - ourPlane.centerX) <= this.sizeX/2 + ourPlane.sizeX/2 && Math.abs(this.centerY - ourPlane.centerY) <= this.sizeY/2 + ourPlane.sizeY/2;
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
		//如果敌机到达底部
		if(this.segments[i].isOverBottom){
			mainDiv.removeChild(this.segments[i].imgNode);
			this.segments.splice(i,1);
		}
		//如果敌机的血量大于0  该敌机还未死亡 就挡住子弹
		if(this.segments[i].hp > 0){
			//如果敌机被子弹击中
			if(this.segments[i].isBulletBoom){
				score++;
				scoreDiv.innerHTML = score;
				this.segments[i].imgNode.src = this.segments[i].hitSrc ? this.segments[i].hitSrc : this.segments[i].boomSrc;
//				console.log('111');
				this.segments[i].hp--;
			}
			//如果敌机与我方飞机相撞
			if(this.segments[i].isPlanBoom){
				this.segments[i].hp = 0;
				ourPlane.hp--;
			}
//			console.log(this.segments[i].hp);
		}else if(this.segments[i].hp <= 0){ //如果敌机血量为0 死亡
//			console.log('000');
			this.segments[i].imgNode.src = this.segments[i].boomSrc;
			this.segments[i].boomTime -= 10;
			if(this.segments[i].boomTime <= 0){
				mainDiv.removeChild(this.segments[i].imgNode);
				this.segments.splice(i,1);
			}
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
	this.centerY = this.currentY + this.sizeY/2;
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

var gameover = function(){
	ourPlane.imgNode.src = ourPlane.boomSrc;
	clearInterval(timeId);
	settlementDiv.style.display = 'block';
	document.querySelector('p#final-score').innerHTML = score;
}

var timeId;
var time = 0;
var mainDivDisplay = window.getComputedStyle(mainDiv,null).display;
//console.log(mainDivDisplay);

var start = function(){
	//隐藏开始画面
	startDiv.style.display = 'none';
	//显示游戏界面
	mainDiv.style.display = 'block';
	//隐藏按钮
	suspendDiv.style.display = 'none';
	settlementDiv.style.display = 'none';
	//开启定时器
	timeId	=	setInterval(function(){
					time++;
					if(time%20===0){
						enemies.createNewEnemy();
					}
					enemies.moveAllEnemy();
					if(time%5===0){
						creatNewBullet();
					}
					moveNewBullet();
					if(ourPlane.hp <= 0){
						gameover();
					}
				},30)
}

var restart = function(){
	window.location.reload();
}

continueDiv.onclick = function(ev){
	console.log('222');
	ev.stopPropagation();
	start();
}

mainDiv.onclick = function(){
	clearInterval(timeId);
	suspendDiv.style.display = 'block';
	document.getElementById('continue').style.zIndex = 999;
	document.getElementById('restart').style.zIndex = 999;
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