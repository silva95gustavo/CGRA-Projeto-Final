var degToRad = Math.PI / 180.0;

var VELOCITY_LIMIT = 0.1;
var ANGLE_LIMIT = 0.1;

/**
 * MyRobot
 * @constructor
 */
 function MyRobot(scene, slices, stacks) {
 	CGFobject.call(this,scene);

 	this.defaultDelta = 0.3;
 	this.defaultSpeed = 2;
 	this.defaultResistance = 0.5;
 	this.defaultAcceleration = 3;

 	this.defaultAngleSpeed = 2;
 	this.defaultAngleResistance = 1;
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
 	
 	this.cylinder = new MyCylinderTopped(this.scene, this.objectSlices, this.objectStacks);
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
 	
	/*this.defaultAppearance = new CGFappearance(this);
	this.defaultAppearance.setAmbient(102/255/1.3, 1/1.3, 0);
	this.defaultAppearance.setDiffuse(102/255/1.3, 1/1.3, 0);
	this.defaultAppearance.setSpecular(102/255, 1, 0);
	this.defaultAppearance.setShininess(400);
	//this.defaultAppearance.loadTexture("resources/images/green.png");
	//this.defaultAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	this.defaultEyeAppearance = new CGFappearance(this);
	this.defaultEyeAppearance.setAmbient(0, 0, 0);
	this.defaultEyeAppearance.setDiffuse(0, 0, 0);
	this.defaultEyeAppearance.setSpecular(0.2, 0.2, 0.2);
	this.defaultEyeAppearance.setShininess(10);*/
 };

 MyRobot.prototype = Object.create(CGFobject.prototype);
 MyRobot.prototype.constructor = MyRobot;

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
 	this.rightWheelAngle += angleShift;
 	this.leftWheelAngle += angleShift;
 	
 	if(this.speed == 0)
 	{
 		if(this.rightArmAngle != 0) {
 			newAng = this.rightArmAngle-this.armRotationSlowingFactor;
 	 		if(Math.abs(newAng) != newAng)
 	 			newAng = 0;
 	 		this.rightArmAngle=newAng;
 		}
 		if(this.leftArmAngle != 0) {
 			newAng = this.leftArmAngle-this.armRotationSlowingFactor;
 	 		if(Math.abs(newAng) != newAng)
 	 			newAng = 0;
 	 		this.leftArmAngle=newAng;
 		}
 	}
 	else
 	{
 		if(this.armRotationSpeed != 0)
 		{
 			newAng = this.rightArmAngle+this.armRotationSpeed*this.speed;
 			if(newAng < -this.armRotaionSpan) {
 				this.armRotationSpeed = -this.armRotationSpeed;
 				newAng = -this.armRotaionSpan;
 			} else if(newAng > this.armRotaionSpan) {
 				this.armRotationSpeed = -this.armRotationSpeed;
 				newAng = this.armRotaionSpan;
 			}
 			this.rightArmAngle = newAng;
 			this.leftArmAngle = -newAng;
 		}
 	}
 	
	
	this.speed -= this.speed * delta_t/1000 * this.resistance;

	if(Math.abs(this.speed) <= VELOCITY_LIMIT)
		this.speed = 0;
 };
  
 MyRobot.prototype.displayBody = function() {

	 this.scene.pushMatrix();
	 	this.scene.translate(this.x, this.y+this.wheelDiameterScale, this.z);
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.bodyDiameterScale, this.bodyDiameterScale, this.bodyHeightScale);
	 	this.cylinder.display();
	 	//this.body.display();
	 this.scene.popMatrix();
 };
 
MyRobot.prototype.displayHead = function() {

	 this.scene.pushMatrix();
	 	this.scene.translate(this.x, this.y+this.bodyHeightScale+this.headToBodySpacing+this.wheelDiameterScale, this.z);
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.pushMatrix();
	 		this.scene.scale(this.bodyDiameterScale, this.bodyDiameterScale, this.bodyDiameterScale);
	 		this.hsphere.display();
	 	this.scene.popMatrix();
	 	//this.head.display();
	 	this.scene.pushMatrix();
	 		this.scene.rotate(this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightAdjustment);
	 		this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaHeightScale);
	 		this.cylinder.display();
	 		//this.antenna.display();
	 	this.scene.popMatrix();
	 	this.scene.pushMatrix();
			this.scene.rotate(-this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightAdjustment);
			this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaHeightScale);
	 		this.cylinder.display();
	 		//this.antenna.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.rotate(-this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightScale + this.antennaHeightAdjustment);
			this.scene.rotate(Math.PI/2, 0, 0, 1);
			this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaDiameterScale);
	 		this.hsphere.display();
	 		//this.armEnd.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.rotate(this.antennaLeanAngle, 0, 1, 0);
			this.scene.translate(0, 0, this.antennaHeightScale + this.antennaHeightAdjustment);
			this.scene.rotate(Math.PI/2, 0, 0, 1);
			this.scene.scale(this.antennaDiameterScale, this.antennaDiameterScale, this.antennaDiameterScale);
	 		this.hsphere.display();
	 		//this.armEnd.display();
		this.scene.popMatrix();
	 this.scene.popMatrix();
 };
 
MyRobot.prototype.displayArms = function() {

	 // Left arm
	 this.scene.pushMatrix();
	 	this.scene.translate(this.armToBodySpacing*Math.cos(-this.angle), this.wheelDiameterScale, this.armToBodySpacing*Math.sin(-this.angle));
	 	this.scene.translate(this.x, this.y+this.bodyHeightScale-this.armHeightScale, this.z);

	 	this.scene.rotate(this.angle+Math.PI, 0, 1, 0);
	 	this.scene.translate(0, this.armHeightScale, 0);
	 	this.scene.rotate(this.leftArmAngle, 1, 0, 0);
	 	this.scene.translate(0, -this.armHeightScale, 0);
	 	
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.armDiameterScale, this.armDiameterScale, this.armHeightScale);
	 	this.cylinder.display();
	 	this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 1, 0, 0);
			this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
			this.hsphere.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0, 0, 1);
			this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
			this.hsphere.display();
		this.scene.popMatrix();
	 this.scene.popMatrix();
	 
	 // Right arm
	 this.scene.pushMatrix();
	 	this.scene.translate(this.armToBodySpacing*Math.cos(-this.angle + Math.PI), this.wheelDiameterScale, this.armToBodySpacing*Math.sin(-this.angle + Math.PI));
	 	this.scene.translate(this.x, this.y+this.bodyHeightScale-this.armHeightScale, this.z);

	 	this.scene.rotate(this.angle+Math.PI, 0, 1, 0);
	 	this.scene.translate(0, this.armHeightScale, 0);
	 	this.scene.rotate(this.rightArmAngle, 1, 0, 0);
	 	this.scene.translate(0, -this.armHeightScale, 0);
	 	
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.armDiameterScale, this.armDiameterScale, this.armHeightScale);
	 	this.cylinder.display();
	 	//this.leftArm.display();
	 	this.scene.pushMatrix();
	 		this.scene.rotate(Math.PI, 1, 0, 0);
	 		this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
	 		this.hsphere.display();
	 		//this.armEnd.display();
	 	this.scene.popMatrix();
	 	this.scene.pushMatrix();
	 		this.scene.translate(0, 0, 1);
	 		this.scene.scale(1, 1, this.armDiameterScale/this.armHeightScale);
	 		this.hsphere.display();
	 		//this.armEnd.display();
	 	this.scene.popMatrix();
	 this.scene.popMatrix();
 };
 
MyRobot.prototype.displayEyes = function() {

	 this.scene.pushMatrix();
	 	this.scene.translate(this.x + this.eyeToEyeDistance*Math.cos(-this.angle), this.y+this.bodyHeightScale+this.headToBodySpacing+this.eyeHeightScale+this.wheelDiameterScale, this.z + this.eyeToEyeDistance*Math.sin(-this.angle));
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.scale(this.eyeDiameterScale, this.eyeDiameterScale, this.eyeDepthScale);
	 	this.cylinder.display();
	 this.scene.popMatrix();
	 this.scene.pushMatrix();
	 	this.scene.translate(this.x - this.eyeToEyeDistance*Math.cos(-this.angle), this.y+this.bodyHeightScale+this.headToBodySpacing+this.eyeHeightScale+this.wheelDiameterScale, this.z - this.eyeToEyeDistance*Math.sin(-this.angle));
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.scale(this.eyeDiameterScale, this.eyeDiameterScale, this.eyeDepthScale);
	 	this.cylinder.display();
	 this.scene.popMatrix();
 };
 
 MyRobot.prototype.displayWheels = function() {
	this.scene.pushMatrix();
		this.scene.translate(this.x + this.bodyDiameterScale*Math.sin(this.angle + Math.PI/2), this.y+this.wheelDiameterScale, this.z + this.bodyDiameterScale*Math.cos(this.angle + Math.PI/2));
		this.scene.rotate(this.angle+Math.PI/2, 0, 1, 0);
		this.scene.rotate(this.leftWheelAngle, 0, 0, 1);
		this.scene.scale(this.wheelDiameterScale, this.wheelDiameterScale, this.wheelDepthScale);
		this.wheel.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(this.x - this.bodyDiameterScale*Math.sin(this.angle + Math.PI/2), this.y+this.wheelDiameterScale, this.z - this.bodyDiameterScale*Math.cos(this.angle + Math.PI/2));
		this.scene.rotate(this.angle+3*Math.PI/2, 0, 1, 0);
		this.scene.rotate(-this.rightWheelAngle, 0, 0, 1);
		this.scene.scale(this.wheelDiameterScale, this.wheelDiameterScale, this.wheelDepthScale);
		this.wheel.display();
	this.scene.popMatrix();
 };
 
 MyRobot.prototype.display = function() {
	 
	 this.updateTextures();
	 
	 //this.scene.robotGeneralAppearance.apply();
	 
	 // Main robot body
	 this.displayBody();
	 
	 // Robot head
	 this.displayHead();
	 
	 // Robot arms
	 this.displayArms();
	 
	 //this.scene.robotEyeAppearance.apply();
	 
	 // Robot eyes
	 this.displayEyes();
	 
	 // Robot wheels
	 this.displayWheels();
	
	 //this.scene.translate(this.x, this.y, this.z);
	 //this.scene.rotate(this.angle, 0, 1, 0);
	 this.drawElements(this.primitiveType);
 }
