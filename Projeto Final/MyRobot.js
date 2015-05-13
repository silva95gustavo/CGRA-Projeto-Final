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

 	this.x = 0;
 	this.y = 0;
 	this.z = 0;
 	this.speed = 0;
 	this.resistance = 0;

 	this.angle = 0;
 	this.angleSpeed = 0;
 	this.angleResistance = 0;
	
 	this.initBuffers();
 	
 	this.objectSlices = 30;
 	
 	this.body = new MyRobotBody(this.scene, this.objectSlices, 1);
 	this.bodyDiameterScale = 1.5;
 	this.bodyHeightScale = 3.5;
 	
 	this.head = new MyHalfSphere(this.scene, this.objectSlices, 20);
 };

 MyRobot.prototype = Object.create(CGFobject.prototype);
 MyRobot.prototype.constructor = MyRobot;

 MyRobot.prototype.initBuffers = function() {
 
 	this.vertices = [0.5, 0.3, 0,
 	                 -0.5, 0.3, 0,
 	                 0, 0.3, 2
 	                 ];

 	this.indices = [0, 1, 2];
 	
 	//this.normals = [];

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyRobot.prototype.move = function(delta) {
 	this.x += delta*Math.sin(this.angle);
 	this.z += delta*Math.cos(this.angle);
 };

 MyRobot.prototype.rotate = function(alfa) {
 	this.angleSpeed += alfa;
 	//this.angle += alfa;
 };

 MyRobot.prototype.accelerate = function(acceleration) {
 	this.speed += acceleration;
 };

 MyRobot.prototype.update = function(delta_t) {

	this.angle += this.angleSpeed * delta_t/1000;
	this.angleSpeed -= this.angleSpeed * delta_t/1000 * this.angleResistance;

	if(Math.abs(this.angleSpeed) <= ANGLE_LIMIT)
		this.angleSpeed = 0;

 	this.x += this.speed * delta_t/1000 * Math.sin(this.angle);
 	this.z += this.speed * delta_t/1000 * Math.cos(this.angle);
	
	this.speed -= this.speed * delta_t/1000 * this.resistance;

	if(Math.abs(this.speed) <= VELOCITY_LIMIT)
		this.speed = 0;
 };
 
 MyRobot.prototype.display = function() {
	 
	 // Main robot body
	 this.scene.pushMatrix();
	 	this.scene.translate(this.x, this.y, this.z);
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.bodyDiameterScale, this.bodyDiameterScale, this.bodyHeightScale);
	 	this.body.display();
	 this.scene.popMatrix();
	 
	 // Robot head
	 this.scene.pushMatrix();
	 	this.scene.translate(this.x, this.y+this.bodyHeightScale, this.z);
	 	this.scene.rotate(this.angle, 0, 1, 0);
	 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 	this.scene.scale(this.bodyDiameterScale, this.bodyDiameterScale, 1);
	 	this.head.display();
	 this.scene.popMatrix();
	 
	 

	 this.scene.translate(this.x, this.y, this.z);
	 this.scene.rotate(this.angle, 0, 1, 0);
	 this.drawElements(this.primitiveType);
 }
