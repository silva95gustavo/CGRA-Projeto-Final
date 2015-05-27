var degToRad = Math.PI / 180.0;

var VELOCITY_LIMIT = 0.1;
var ANGLE_LIMIT = 0.1;

/**
 * MyRobot
 * @constructor
 */
 function MyRobot(scene, slices, stacks) {
 	CGFobject.call(this,scene);
 	
 	this.time = 0;
 	
 	this.bodyApIndex = 0;
 	this.bodyTopApIndex = 1;
 	this.eyeApIndex = 2;
 	this.eyeFrontApIndex = 3;
 	this.wheelApIndex = 4;
 	this.wheelSideApIndex = 5;
 	this.armsApIndex = 6;
 	this.armTopApIndex = 7;
 	this.antennaApIndex = 8;
 	this.antennaTopApIndex = 9;
 	this.headApIndex = 10;
 	this.headBottomApIndex = 11;
 	 	
 	this.defaultDelta = 0.3;
 	this.defaultSpeed = 2;
 	this.defaultResistance = 4;
 	this.defaultAcceleration = 3;

 	this.defaultAngleSpeed = 2;
 	this.defaultAngleResistance = 4;
 	this.defaultAngleAcceleration = 0.8;

 	this.armDefaultSpeed = 0.02;
 	this.armRotationSpeed = 0;
 	this.armRotationResitance = 1;
 	this.armRotaionSpan = Math.PI/4;
 	this.armRotationSlowingFactor = Math.PI/80;

 	this.x = 0;
 	this.y = 0;
 	this.z = 0;
 	this.speed = 0;
 	this.resistance = 0;

 	this.angle = 0;
 	this.angleSpeed = 0;
 	this.angleResistance = 0;
	
 	this.initBuffers();
 	
 	this.objectSlices = 300;
 	this.objectStacks = 20;
 	
 	this.sizeScale = 1;
 	 
 	this.circle = new MyCircle(this.scene, this.objectSlices);
 	this.cylinder = new MyCylinder(this.scene, this.objectSlices, this.objectStacks);
 	this.hsphere = new MyHalfSphere(this.scene, this.objectSlices, this.objectStacks);
 	
 	//this.body = new MyCylinderTopped(this.scene, this.objectSlices, this.objectStacks);
 	this.bodyDiameterScale = this.sizeScale*0.8;
 	this.bodyHeightScale = 2*this.bodyDiameterScale/0.8;
 	
 	//this.head = new MyHalfSphere(this.scene, this.objectSlices, this.objectStacks);
 	this.headToBodySpacing = this.bodyDiameterScale/8;
 	
 	//this.leftArm = new MyCylinderTopped(this.scene, this.objectSlices, this.objectStacks); 	
 	//this.rightArm = new MyCylinderTopped(this.scene, this.objectSlices, this.objectStacks);
 	this.armDiameterScale = this.bodyDiameterScale/5;
 	this.armHeightScale = this.bodyDiameterScale/(6/9);
 	this.armToBodySpacing = this.armDiameterScale + 1.1*this.bodyDiameterScale;
 	this.leftArmAngle = Math.PI/4;
 	this.rightArmAngle = Math.PI/4;
 	this.waveAngle = 0;
 	
 	//this.armEnd = new MyHalfSphere(this.scene, this.objectSlices, this.objectStacks);
 	this.armEndHeightScale = 1;
 	
 	//this.antenna = new MyCylinderTopped(this.scene, this.objectSlices, this.objectStacks);
 	this.antennaDiameterScale = this.bodyDiameterScale/20;
 	this.antennaHeightScale = this.bodyDiameterScale*1.4//1.25;
 	this.antennaLeanAngle = Math.PI/7;
 	this.antennaHeightAdjustment = Math.cos(this.antennaLeanAngle)*this.antennaDiameterScale;
 	
 	this.eyeDiameterScale = 0.1*this.bodyDiameterScale;
 	this.eyeDepthScale = 0.84*this.bodyDiameterScale;
 	this.eyeHeightScale = (0.5)*this.bodyDiameterScale;
 	this.eyeToEyeDistance = (0.45)*this.bodyDiameterScale;
 	
 	this.wheel = new MyRobotWheel(this.scene, this.objectSlices, this.objectStacks);
 	this.wheelDiameterScale = 0.5*this.bodyDiameterScale;
 	this.wheelDepthScale = 0.2*this.bodyDiameterScale;
 	this.leftWheelAngle = 0;
 	this.rightWheelAngle = 0;
 	
 	this.lollipopTubeIndex = 0;
 	this.lollipopIndex = 1;
 	this.lollipopSideIndex = 2;
 	
 	this.waveState = 0;	// 0 - normal arm movement
 						// 1 - Interpolate arms to correct position
 						// 2 - Wave arm
 						// 3 - Interpolate arms to "normal" position
 	
 	this.rightArmStart;
 	this.leftArmStart;
 	this.animTimeStart;
 };

 MyRobot.prototype = Object.create(CGFobject.prototype);
 MyRobot.prototype.constructor = MyRobot;
 
MyRobot.prototype.wave = function() {
	if(this.waveState == 0)
	{
		this.waveState = 1;
		this.rightArmStart = this.rightArmAngle;
		this.leftArmStart = this.leftArmAngle;
		this.animTimeStart = this.time;
	}
};

 MyRobot.prototype.initBuffers = function() {
	 
	 this.vertices = [];
	 this.indices = [];
 
 	/*this.vertices = [0.5, 0.3, 0,
 	                 -0.5, 0.3, 0,
 	                 0, 0.3, 2
 	                 ];

 	this.indices = [0, 1, 2];
 	
 	//this.normals = [];*/

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyRobot.prototype.move = function(delta) {
	this.armRotationSpeed = this.armDefaultSpeed;
 	this.x += delta*Math.sin(this.angle);
 	this.z += delta*Math.cos(this.angle);
 };

MyRobot.prototype.rotate = function(alfa) {
	this.armRotationSpeed = this.armDefaultSpeed;
 	this.angleSpeed += alfa;
 	//this.angle += alfa;
 };

MyRobot.prototype.accelerate = function(acceleration) {
 	this.speed += acceleration;
 };

MyRobot.prototype.update = function(delta_t) {

	this.time += delta_t;
	
	this.angle += this.angleSpeed * delta_t/1000;
	
	angleShift = this.angleSpeed*(delta_t/1000)*this.bodyDiameterScale/this.wheelDiameterScale;
 	this.rightWheelAngle += angleShift;
 	this.leftWheelAngle -= angleShift;
	
	this.angleSpeed -= this.angleSpeed * delta_t/1000 * this.angleResistance;

	if(Math.abs(this.angleSpeed) <= ANGLE_LIMIT)
		this.angleSpeed = 0;

	this.x += this.speed * delta_t/1000 * Math.sin(this.angle) * this.sizeScale;
	this.z += this.speed * delta_t/1000 * Math.cos(this.angle) * this.sizeScale;

	angleShift = this.speed*(delta_t/1000)*this.sizeScale/this.wheelDiameterScale;
	
	if(this.x < this.bodyDiameterScale)
	{
		angleShift = 0;
		this.x = this.bodyDiameterScale;
	}
	if(this.x > 15 - this.bodyDiameterScale)
	{
		angleShift = 0;
		this.x = 15 - this.bodyDiameterScale;
	}
	if(this.z < this.bodyDiameterScale)
	{
		angleShift = 0;
		this.z = this.bodyDiameterScale;
	}
	if(this.z > 10.47-this.bodyDiameterScale)
	{
		angleShift = 0;
		this.z = 10.47-this.bodyDiameterScale;
	}

 	this.rightWheelAngle += angleShift;
 	this.leftWheelAngle += angleShift;

 	switch(this.waveState)
 	{
 	case 0:
 		this.waveAngle = 0;
 		angle = 0.15 * this.speed * Math.sin(0.005 * this.time);
 	 	this.rightArmAngle = angle;
 	 	this.leftArmAngle = -angle;
 	 	break;
 	case 1:
 		this.waveAngle = 0;
 		timeDiff = this.time - this.animTimeStart;
 		this.rightArmAngle = this.lerp(this.rightArmStart, Math.PI, timeDiff/1000);
 		this.leftArmAngle = this.lerp(this.leftArmStart, 0, timeDiff/1000);
 		if(timeDiff > 1000)
 		{
 			this.animTimeStart = this.time;
 			this.waveState = 2;
 		}
 		break;
 	case 2:
 		timeDiff = this.time - this.animTimeStart;
 		this.waveAngle = (Math.PI/4)*((Math.sin(this.lerp(0, 3, timeDiff/3000)*2*Math.PI + 3*Math.PI/2) + 1)/2);
 		if(timeDiff > 3000)
 		{
 			this.waveState = 3;
 			this.rightArmStart = this.rightArmAngle;
 			this.leftArmStart = this.leftArmAngle;
 			this.animTimeStart = this.time;
 		}
 		break;
 	case 3:
 		this.waveAngle = 0;
 		angle = 0.15 * this.speed * Math.sin(0.005 * this.time);
 		timeDiff = this.time - this.animTimeStart;
 		this.rightArmAngle = this.lerp(this.rightArmStart, angle, timeDiff/1000);
 		this.leftArmAngle = this.lerp(this.leftArmStart, -angle, timeDiff/1000);
 		if(timeDiff > 1000)
 		{
 			this.animTimeStart = this.time;
 			this.waveState = 0;
 		}
 		break;
 	}
	
	this.speed -= this.speed * delta_t/1000 * this.resistance;

	if(Math.abs(this.speed) <= VELOCITY_LIMIT)
		this.speed = 0;
 };
  
MyRobot.prototype.displayBody = function(sideTex, topTex) {

	 this.scene.pushMatrix();
	 	this.scene.translate(0, this.wheelDiameterScale, 0);
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.bodyDiameterScale, this.bodyDiameterScale, this.bodyHeightScale);
 		if (typeof sideTex != "undefined") {
	 	   sideTex.apply();
	 	}
	 	this.cylinder.display();
	 	this.scene.pushMatrix();	// Top
	 		this.scene.translate(0, 0, 1);
	 		if (typeof topTex != "undefined") {
	 			topTex.apply();
	 		}
	 		this.circle.display();
	 	this.scene.popMatrix();
	 	this.scene.pushMatrix();	// Bottom
	 		this.scene.rotate(Math.PI, 1, 0, 0);
	 		if (typeof topTex != "undefined") {
	 			topTex.apply();
		 	}
 			this.circle.display();
 		this.scene.popMatrix();
	 this.scene.popMatrix();
 };
 
MyRobot.prototype.displayMoveBody = function(sideTex, topTex) {
	this.scene.pushMatrix();
		this.scene.translate(this.x, this.y, this.z);
		this.displayBody(sideTex, topTex);
	this.scene.popMatrix();
}
 
MyRobot.prototype.displayHead = function(sideTex, bottomTex, antennaSideTex, antennaTopTex) {

	 this.scene.pushMatrix();
	 	this.scene.translate(0, this.bodyHeightScale+this.headToBodySpacing+this.wheelDiameterScale, 0);
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.pushMatrix();	// Head itself
	 		this.scene.scale(this.bodyDiameterScale, this.bodyDiameterScale, this.bodyDiameterScale);
	 		if (typeof sideTex != "undefined") {
	 			sideTex.apply();
	 		}
	 		this.hsphere.display();
	 		this.scene.rotate(Math.PI, 1, 0, 0);
	 		if (typeof bottomTex != "undefined") {
	 			bottomTex.apply();
	 		}
	 		this.circle.display();
	 	this.scene.popMatrix();
	 	this.scene.pushMatrix();	// Left Antenna
	 		this.scene.rotate(this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightAdjustment);
	 		this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaHeightScale);
	 		if (typeof antennaSideTex != "undefined") {
	 			antennaSideTex.apply();
	 		}
	 		this.cylinder.display();
	 	this.scene.popMatrix();
	 	this.scene.pushMatrix();	// Right Antenna
			this.scene.rotate(-this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightAdjustment);
			this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaHeightScale);
	 		if (typeof antennaSideTex != "undefined") {
	 			antennaSideTex.apply();
	 		}
	 		this.cylinder.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();	// Left Antenna Top
			this.scene.rotate(-this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightScale + this.antennaHeightAdjustment);
			this.scene.rotate(Math.PI/2, 0, 0, 1);
			this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaDiameterScale);
	 		if (typeof antennaTopTex != "undefined") {
	 			antennaTopTex.apply();
	 		}
	 		this.hsphere.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();	// Right Antenna Top
			this.scene.rotate(this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightScale + this.antennaHeightAdjustment);
			this.scene.rotate(Math.PI/2, 0, 0, 1);
			this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaDiameterScale);
	 		if (typeof antennaTopTex != "undefined") {
	 			antennaTopTex.apply();
	 		}
	 		this.hsphere.display();
		this.scene.popMatrix();
	 this.scene.popMatrix();
 };

MyRobot.prototype.displayMoveHead = function() {
	this.scene.pushMatrix();
		this.scene.translate(this.x, this.y, this.z);
		this.displayHead(sideTex, bottomTex, antennaSideTex, antennaTopTex);
	this.scene.popMatrix();
}
 
MyRobot.prototype.displayArms = function(sideTex, topTex) {

	 // Left arm
	 this.scene.pushMatrix();
	 	this.scene.translate(this.armToBodySpacing*Math.cos(-this.angle), this.wheelDiameterScale + this.bodyHeightScale-this.armHeightScale, this.armToBodySpacing*Math.sin(-this.angle));
	 	this.scene.rotate(this.angle+Math.PI, 0, 1, 0);
	 	this.scene.translate(0, this.armHeightScale, 0);
	 	this.scene.rotate(this.leftArmAngle, 1, 0, 0);
	 	this.scene.translate(0, -this.armHeightScale, 0);
	 	
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.armDiameterScale, this.armDiameterScale, this.armHeightScale);
 		if (typeof sideTex != "undefined") {
 			sideTex.apply();
 		}
	 	this.cylinder.display();
	 	this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
	 		if (typeof topTex != "undefined") {
	 			topTex.apply();
	 		}
			this.hsphere.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 1);
			this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
	 		if (typeof topTex != "undefined") {
	 			topTex.apply();
	 		}
			this.hsphere.display();
		this.scene.popMatrix();
	 this.scene.popMatrix();
	 
	 // Right arm
	 this.scene.pushMatrix();
	 	this.scene.translate(this.armToBodySpacing*Math.cos(-this.angle + Math.PI), this.wheelDiameterScale+this.bodyHeightScale-this.armHeightScale, this.armToBodySpacing*Math.sin(-this.angle + Math.PI));

	 	this.scene.rotate(this.angle+Math.PI, 0, 1, 0);
	 	this.scene.translate(0, this.armHeightScale, 0);
	 	this.scene.rotate(this.rightArmAngle, 1, 0, 0);
	 	this.scene.rotate(this.waveAngle, 0, 0, 1);
	 	this.scene.translate(0, -this.armHeightScale, 0);
	 	
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.armDiameterScale, this.armDiameterScale, this.armHeightScale);
 		if (typeof sideTex != "undefined") {
 			sideTex.apply();
 		}
	 	this.cylinder.display();
	 	//this.leftArm.display();
	 	this.scene.pushMatrix();
	 		this.scene.rotate(Math.PI, 1, 0, 0);
	 		this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
	 		if (typeof topTex != "undefined") {
	 			topTex.apply();
	 		}
	 		this.hsphere.display();
	 		//this.armEnd.display();
	 	this.scene.popMatrix();
	 	this.scene.pushMatrix();
	 		this.scene.translate(0, 0, 1);
	 		this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
	 		if (typeof topTex != "undefined") {
	 			topTex.apply();
	 		}
	 		this.hsphere.display();
	 		//this.armEnd.display();
	 	this.scene.popMatrix();
	 this.scene.popMatrix();
 };
 
MyRobot.prototype.displayMoveArms = function(sideTex, topTex) {
	this.scene.pushMatrix();
		this.scene.translate(this.x, this.y, this.z);
		this.displayArms(sideTex, topTex);
	this.scene.popMatrix();
}
 
MyRobot.prototype.displayEyes = function(sideTex, frontTex) {

	 this.scene.pushMatrix();	// Left eye
	 	this.scene.translate(this.eyeToEyeDistance*Math.cos(-this.angle), this.bodyHeightScale+this.headToBodySpacing+this.eyeHeightScale+this.wheelDiameterScale, this.eyeToEyeDistance*Math.sin(-this.angle));
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.scale(this.eyeDiameterScale, this.eyeDiameterScale, this.eyeDepthScale);
 		if (typeof sideTex != "undefined") {
 			sideTex.apply();
 		}
	 	this.cylinder.display();
	 	this.scene.translate(0, 0, 1);
 		if (typeof frontTex != "undefined") {
 			frontTex.apply();
 		}
	 	this.circle.display();
	 this.scene.popMatrix();
	 this.scene.pushMatrix();	// Right eye
	 	this.scene.translate(-this.eyeToEyeDistance*Math.cos(-this.angle), this.bodyHeightScale+this.headToBodySpacing+this.eyeHeightScale+this.wheelDiameterScale, -this.eyeToEyeDistance*Math.sin(-this.angle));
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.scale(this.eyeDiameterScale, this.eyeDiameterScale, this.eyeDepthScale);
 		if (typeof sideTex != "undefined") {
 			sideTex.apply();
 		}
	 	this.cylinder.display();
	 	this.scene.translate(0, 0, 1);
 		if (typeof frontTex != "undefined") {
 			frontTex.apply();
 		}
	 	this.circle.display();
	 this.scene.popMatrix();
 };
 
MyRobot.prototype.displayMoveEyes = function(sideTex, frontTex) {
	this.scene.pushMatrix();
		this.scene.translate(this.x, this.y, this.z);
		this.displayEyes(sideTex, frontTex);
	this.scene.popMatrix();
}
 
MyRobot.prototype.displayWheels = function(frontTex, sideTex) {
	this.scene.pushMatrix();
		this.scene.translate(this.bodyDiameterScale*Math.sin(this.angle + Math.PI/2), this.wheelDiameterScale, this.bodyDiameterScale*Math.cos(this.angle + Math.PI/2));
		this.scene.rotate(this.angle+Math.PI/2, 0, 1, 0);
		this.scene.rotate(this.leftWheelAngle, 0, 0, 1);
		this.scene.scale(this.wheelDiameterScale, this.wheelDiameterScale, this.wheelDepthScale);
 		if (typeof frontTex != "undefined") {
 			frontTex.apply();
 		}
		this.wheel.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(-this.bodyDiameterScale*Math.sin(this.angle + Math.PI/2), this.wheelDiameterScale, -this.bodyDiameterScale*Math.cos(this.angle + Math.PI/2));
		this.scene.rotate(this.angle+3*Math.PI/2, 0, 1, 0);
		this.scene.rotate(-this.rightWheelAngle, 0, 0, 1);
		this.scene.scale(this.wheelDiameterScale, this.wheelDiameterScale, this.wheelDepthScale);
 		if (typeof frontTex != "undefined") {
 			frontTex.apply();
 		}
		this.wheel.display();
	this.scene.popMatrix();
 };
 
MyRobot.prototype.displayMoveWheels = function() {
	this.scene.pushMatrix();
		this.scene.translate(this.x, this.y, this.z);
		this.displayWheels();
	this.scene.popMatrix();
}
 
MyRobot.prototype.display = function() {

	this.scene.pushMatrix();
	this.scene.translate(this.x, this.y, this.z);
	 	 
	 // Main robot body
	 this.displayBody();
	 
	 // Robot head
	 this.displayHead();
	 
	 // Robot arms
	 this.displayArms();
	 
	 // Robot eyes
	 this.displayEyes();
	 
	 // Robot wheels
	 this.displayWheels();

	this.scene.popMatrix();
	 
	 this.drawElements(this.primitiveType);
 }

MyRobot.prototype.displayLollipop = function(lollipopAppearanceSet) {
	lollipopTubeHeightScale = 1.5;
	lollipopDiameterScale = 0.5;
	lollipopHeightScale = 0.03;
	
	this.scene.pushMatrix();
	this.scene.translate(this.x, this.y, this.z);
	this.scene.translate(this.armToBodySpacing*Math.cos(-this.angle), this.wheelDiameterScale + this.bodyHeightScale-this.armHeightScale, this.armToBodySpacing*Math.sin(-this.angle));
	this.scene.rotate(this.angle+Math.PI, 0, 1, 0);
	this.scene.translate(0, this.armHeightScale*(1-Math.cos(this.leftArmAngle)), -this.armHeightScale*Math.sin(this.leftArmAngle));
	this.scene.rotate(this.leftArmAngle, 1, 0, 0);
	this.scene.rotate(Math.PI/4, 0, 0, 1);
	
	// Tube
	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.scale(lollipopHeightScale*this.bodyDiameterScale, lollipopHeightScale*this.bodyDiameterScale, lollipopTubeHeightScale*this.bodyDiameterScale);
		lollipopAppearanceSet[this.lollipopTubeIndex].apply();
		this.cylinder.display();
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.circle.display();
	this.scene.popMatrix();
	
	// Lollipop
	this.scene.pushMatrix();
		this.scene.translate(0, lollipopTubeHeightScale*this.bodyDiameterScale, 0);
		this.scene.scale(lollipopDiameterScale*this.bodyDiameterScale, lollipopDiameterScale*this.bodyDiameterScale, 2*lollipopHeightScale*this.bodyDiameterScale);
		this.scene.translate(0, 0, -0.5);
		lollipopAppearanceSet[this.lollipopSideIndex].apply();
		this.cylinder.display();
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 1, 0, 0);
			lollipopAppearanceSet[this.lollipopIndex].apply();
			this.circle.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 1);
			lollipopAppearanceSet[this.lollipopIndex].apply();
			this.circle.display();
		this.scene.popMatrix();
	this.scene.popMatrix();
	
	this.scene.popMatrix();
}

MyRobot.prototype.updateVars = function(scale) {
	this.sizeScale = scale;
	 
 	this.bodyDiameterScale = this.sizeScale*0.8;
 	this.bodyHeightScale = 2*this.bodyDiameterScale/0.8;
 	
 	this.headToBodySpacing = this.bodyDiameterScale/8;
 	
 	this.armDiameterScale = this.bodyDiameterScale/5;
 	this.armHeightScale = this.bodyDiameterScale/(6/9);
 	this.armToBodySpacing = this.armDiameterScale + 1.1*this.bodyDiameterScale;
 	
 	this.antennaDiameterScale = this.bodyDiameterScale/20;
 	this.antennaHeightScale = this.bodyDiameterScale*1.4;
 	this.antennaHeightAdjustment = Math.cos(this.antennaLeanAngle)*this.antennaDiameterScale;
 	
 	this.eyeDiameterScale = 0.1*this.bodyDiameterScale;
 	this.eyeDepthScale = 0.84*this.bodyDiameterScale;
 	this.eyeHeightScale = (0.5)*this.bodyDiameterScale;
 	this.eyeToEyeDistance = (0.45)*this.bodyDiameterScale;
 	
 	this.wheelDiameterScale = 0.5*this.bodyDiameterScale;
 	this.wheelDepthScale = 0.2*this.bodyDiameterScale;
}

MyRobot.prototype.displayAppearance = function(appearanceSet, scale) {

	this.updateVars(scale);
	
	this.scene.pushMatrix();
	this.scene.translate(this.x, this.y, this.z);	
	
	if (typeof appearanceSet != "undefined") // texture set defined
	{
		// Main robot body
		this.displayBody(appearanceSet[this.bodyApIndex], appearanceSet[this.bodyTopApIndex]);
		 
		// Robot head
		this.displayHead(appearanceSet[this.headApIndex], appearanceSet[this.headBottomApIndex], appearanceSet[this.antennaApIndex], appearanceSet[this.antennaTopApIndex]);
		
		// Robot arms
		this.displayArms(appearanceSet[this.armsApIndex], appearanceSet[this.armTopApIndex]);
		 
		// Robot eyes
		this.displayEyes(appearanceSet[this.eyeApIndex], appearanceSet[this.eyeFrontApIndex]);
		 
		// Robot wheels
		this.displayWheels(appearanceSet[this.wheelApIndex], appearanceSet[this.wheelSideApIndex]);
	}
	else
	{
		// Main robot body
		this.displayBody();
		 
		// Robot head
		this.displayHead();
		
		// Robot arms
		this.displayArms();
		 
		// Robot eyes
		this.displayEyes();
		 
		// Robot wheels
		this.displayWheels();
	}
	

	 this.scene.popMatrix();
	 
	 this.drawElements(this.primitiveType);
}

MyRobot.prototype.lerp = function(oldX, newX, alpha) {
	// return oldX + alpha * (newX - oldX); Imprecise method which does not guarantee x = newX when alpha = 1
	return (1 - alpha) * oldX + alpha * newX;
}
