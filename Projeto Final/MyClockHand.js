/**
 * MyClockHand
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyClockHand(scene, diameter, length) {
	CGFobject.call(this,scene);

	this.cone = new MyCone(this.scene, 12, 1);

	this.angle = 0;
	this.diameter = diameter;
	this.length = length;

	this.handAppearance = new CGFappearance(scene);
	this.handAppearance.setAmbient(0.1, 0.1, 0.1, 1);
	this.handAppearance.setDiffuse(0.1, 0.1, 0.1, 1);
	this.handAppearance.setSpecular(0.1, 0.1, 0.1, 1);
	this.handAppearance.setShininess(40);
};

MyClockHand.prototype = Object.create(CGFobject.prototype);
MyClockHand.prototype.constructor=MyClockHand;

MyClockHand.prototype.display = function () {

	deg_to_rad = Math.PI/180;

	this.scene.pushMatrix();

	this.handAppearance.apply();
	
	this.scene.rotate(90*deg_to_rad, -1, 0, 0);
	this.scene.rotate(this.angle*deg_to_rad, 0, 1, 0);
	this.scene.scale(this.diameter, this.diameter, this.length);
	
	this.cone.display();

	this.scene.popMatrix();	
};

MyClockHand.prototype.setAngle = function (angle) {

	this.angle = angle;
};