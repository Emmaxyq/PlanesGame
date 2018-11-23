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

var outerPlaneO = {
	width:66,
	height:80,
	imgSrc:'./asset/images/our-plane.gif',
	boomSrc:'./asset/images/our-plane-boom.gif',
	boomTime:100,
	hp:1
}

var outerBullet = {
	width:6,
	height:4,
	imgSrc:'./asset/images/our-bullet.png'
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
	this.checkOverRange();  //判断敌机是否超出底部
	this.checkBoom();  //判断敌机是否与我放飞机相撞
	this.checkBoomBullet(); //判断敌机是否与子弹相撞
//	console.log(this.isBoom);
//	console.log(this.currentY);
//	console.log(stageSizeY);
//	console.log(this.sizeY);
	if(this.isBoom || this.isBoomBullet){
//		console.log('111');
		this.imgNode.src = this.boomSrc;
	}
	if(stageSizeY - this.sizeY - this.currentY < this.speed){
		this.currentY += stageSizeY - this.sizeY - this.currentY;
	}else{
		this.currentY += this.speed;
	}
	this.centerY = this.currentY + this.sizeY/2;
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

Plane.prototype.checkBoom = function(){
	return this.isBoom = Math.abs(this.centerX - planeo.centerX) <= this.sizeX/2 + planeo.sizeX/2 && Math.abs(this.centerY - planeo.centerY) <= this.sizeY/2 + planeo.sizeY/2 ;
}

Plane.prototype.checkBoomBullet = function(){
//	console.log(bullets.segments[0]);
//	console.log(bullets.segments.length);
	var flag = true;
	var _this = this;
	for(var k = 0;k < bullets.segments.length;k++){
//		console.log('index',i,'chaX',Math.abs(_this.centerX - bullets.segments[i].centerX),'jianjuX',_this.sizeX/2 + bullets.segments[i].sizeX/2,'chaY',Math.abs(_this.centerY - bullets.segments[i].centerY),'jianjuY',_this.sizeY/2 + bullets.segments[i].sizeY/2);
//		console.log(_this);
//		console.log('index',i,'_this.centerY',_this.centerY,'bullets.segments[i].centerY',bullets.segments[i].centerY,'cha',Math.abs(_this.centerY - bullets.segments[i].centerY));
//		console.log('index',k,'==>', Math.abs(bullets.segments[k].centerY -  _this.centerY),'==>',_this.sizeY/2 + bullets.segments[k].sizeY/2);
		flag = Math.abs(_this.centerX - bullets.segments[k].centerX) <= _this.sizeX/2 + bullets.segments[k].sizeX/2 &&  Math.abs(bullets.segments[k].centerY -  _this.centerY)  <= _this.sizeY/2 + bullets.segments[k].sizeY/2 ;
		if(flag){
//			console.log('111');
			break;
		}
	}
	this.isBoomBullet = flag;
//	console.log(this.isBoomBullet);
	return this.isBoomBullet;
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
		if(this.segments[i].isOverBottom || this.segments[i].isBoom || this.segments[i].isBoomBullet){
			mainDiv.removeChild(this.segments[i].imgNode);
			this.segments.splice(i,1);
		}
	}
}

//实例化所有敌机
var enemies = new Enemy();
//enemies.createNewEnemy();
//enemies.moveAllEnemy();


//创建子弹的构造函数
var Bullet = function(centerX,centerY,planeModel,speed){
	this.centerX = centerX;
	this.centerY = centerY;
	this.sizeX = planeModel.width;
	this.sizeY = planeModel.height;
	this.imgSrc = planeModel.imgSrc;
	this.speed = speed;
	this.currentX = this.centerX - this.sizeX/2;
	this.currentY = this.centerY - this.sizeY/2;
}

//画出一个子弹的方法
Bullet.prototype.draw = function(){
	this.imgNode = new Image();
	this.imgNode.src = this.imgSrc;
	this.imgNode.style.left = this.centerX - this.sizeX/2 + 'px';
	this.imgNode.style.top = this.centerY - this.sizeY/2 + 'px';
	mainDiv.appendChild(this.imgNode);
}

//某个子弹移动方法
Bullet.prototype.move = function(){
//	this.centerX = planeo.centerX;
//	this.centerY = planeo.currentY;
//	this.currentX = this.centerX - this.sizeX/2;
	this.checkOverRange();  //判断子弹是否超出底部
	if(stageSizeY - this.sizeY - this.currentY < this.speed){
		this.currentY -= stageSizeY - this.sizeY - this.currentY;
	}else{
		this.currentY -= this.speed;
	}
	this.centerY = this.currentY + this.sizeY/2;
	this.imgNode.style.top = this.currentY +'px';
}

//检测子弹超出画布
Bullet.prototype.checkOverRange = function(){
	return this.isOverTop = this.currentY <= 0;
}

//子弹的构造函数
var OuterBullet = function(){
	this.segments = [];
	this.generateCount = 0;
};

//生成并所有子弹
OuterBullet.prototype.createNewBullet = function(){
		this.generateCount++;
		this.newBullet = new Bullet(planeo.centerX,planeo.currentY,outerBullet,10);
		this.segments.push(this.newBullet);
		this.newBullet.draw();
}


//移动所有子弹
OuterBullet.prototype.moveAllBullet = function(){
	for (var j=0;j<this.segments.length;j++) {
//		this.segments[j].centerX = planeo.centerX;
//		this.segments[j].centerY = planeo.currentY;
//		this.segments[j].currentX = this.centerX - this.sizeX/2;
		this.segments[j].move();
		//注意：数组中的对象数据是会改变的，所以不用重新赋值，以下几行的说法是错误的
		//虽然每个子弹对象中的坐标数值会改变，但是数组中的不会，因为数组中的对象是创建的时候就放进数组中，是创建时的对象数据
		//给数组中的具体子弹的中心Y轴改变值，方便后面判断子弹是否击中敌机
		//因为X轴的子弹坐标不变，所以不用重新赋值
//		this.segments[j].centerY = this.segments[j].currentY + this.segments[j].sizeY/2;
		if(this.segments[j].isOverTop){
			mainDiv.removeChild(this.segments[j].imgNode);
			this.segments.splice(j,1);
		}
	}
}

//实例化所有子弹
var bullets = new OuterBullet();







var time = 0;
var mainDivDisplay = window.getComputedStyle(mainDiv,null).display;
//console.log(mainDivDisplay);
if(mainDivDisplay=='block' || !mainDivDisplay){
//	console.log('111');
	//开启定时器
	var timeId =setInterval(function(){
					time++;
					if(time%20===0){
						enemies.createNewEnemy();
					}
					enemies.moveAllEnemy();
				},30);
	//创建并画出我方战机
	var planeo = new Plane(stageSizeX/2,stageSizeY-outerPlaneO.height/2,outerPlaneO,2,100);
	planeo.draw();
	
	//console.log(contentDiv.offsetLeft)
	
	//我放飞机移动函数
	mainDiv.onmousemove = function(e){
		var mouseX = e.pageX - contentDiv.offsetLeft;
		var mouseY = e.pageY - contentDiv.offsetTop;
	//	console.log('x==>',mouseX,'y==>',mouseY);
	//	console.log(planeo);
		planeo.centerX = mouseX;
		planeo.centerY = mouseY;
		planeo.currentX = mouseX - planeo.sizeX/2;
		planeo.currentY = mouseY - planeo.sizeY/2;
		if(planeo.currentX <= 0){  //超出左边
			planeo.currentX = 0;
			planeo.centerX = planeo.sizeX/2;
		}else if(planeo.currentX >= stageSizeX-planeo.sizeX){  //超出右边
			planeo.currentX = stageSizeX-planeo.sizeX;
			planeo.centerX = stageSizeX-planeo.sizeX/2;
		}
		if(planeo.currentY <= 0){ //超出上边
			planeo.currentY = 0;
			planeo.centerY = planeo.sizeY/2;
		}else if(planeo.currentY >= stageSizeY-planeo.sizeY){  //超出下边
			planeo.currentY = stageSizeY-planeo.sizeY;
			planeo.centerY = stageSizeY-planeo.sizeY/2;
		}
		planeo.imgNode.style.left = planeo.currentX + 'px';
		planeo.imgNode.style.top = planeo.currentY + 'px';
		
//		bullet1.centerX = planeo.centerX;
//		bullet1.centerY = planeo.currentY;
//		bullet1.currentX = bullet1.centerX - bullet1.sizeX/2;
//		bullet1.currentY = bullet1.centerY - bullet1.sizeY/2;
//		bullet1.imgNode.style.top = bullet1.centerY - bullet1.sizeY/2 + 'px';
//		bullet1.imgNode.style.left = bullet1.centerX - bullet1.sizeX/2 + 'px';
	}

//	var bullet1 = new Bullet(planeo.centerX,planeo.currentY,outerBullet,10);
//	bullet1.draw();
var timeB = 0;
	setInterval(function(){
		timeB++;
		if(timeB%5==0){
			bullets.createNewBullet();
		}
		bullets.moveAllBullet();
	},25);
}



