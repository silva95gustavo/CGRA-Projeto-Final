/**
 * MyClock
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyClock(scene) {
	CGFobject.call(this,scene);

	this.cylinder = new MyCylinder(this.scene, 12, 1);
	this.circle = new MyCircle(this.scene, 12);

	this.centerCylinder = new MyCylinder(this.scene, 40, 1);
	this.centerCircle = new MyCircle(this.scene, 40);

	this.secondsHand = new MyClockHand(this.scene, 0.01, 0.36);
	this.minutesHand = new MyClockHand(this.scene, 0.015, 0.36);
	this.hoursHand = new MyClockHand(this.scene, 0.015, 0.20);

	// Initial time (3:30:45)
	this.secondsAngle = 270;
	this.minutesAngle = 180;
	this.hoursAngle = 90;
	this.prevTime = 0;
	this.timeDif = 0;

    this.secondsHand.setAngle(this.secondsAngle);
	this.minutesHand.setAngle(this.minutesAngle);
	this.hoursHand.setAngle(this.hoursAngle);

	this.clockAppearance = new CGFappearance(scene);
	this.clockAppearance.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.clockAppearance.setDiffuse(0.5, 0.5,0.5,1);
	this.clockAppearance.setSpecular(0.6,0.6,0.6,1);
	this.clockAppearance.setShininess(10);
	this.clockAppearance.loadTexture("resources/images/clock.png");

	this.centerAppearance = new CGFappearance(scene);
	this.centerAppearance.setAmbient(0.1, 0.1, 0.1, 1.0);
	this.centerAppearance.setDiffuse(0.1, 0.1,0.1,1);
	this.centerAppearance.setSpecular(0.1,0.1,0.1,1);
	this.centerAppearance.setShininess(40);

	this.sideAppearance = new CGFappearance(scene);
	this.sideAppearance.setAmbient(0.6, 0.6, 0.6, 1.0);
	this.sideAppearance.setDiffuse(0.6, 0.6,0.6,1);
	this.sideAppearance.setSpecular(0.2,0.2,0.2,1);
	this.sideAppearance.setShininess(10);
};

MyClock.prototype = Object.create(CGFobject.prototype);
MyClock.prototype.constructor=MyClock;

MyClock.prototype.update = function (currTime) {
	
	date = new Date(currTime);
	this.secondsAngle = date.getSeconds()*360/60;
	this.minutesAngle = date.getMinutes()*360/60 + (360/60)*(date.getSeconds()/60);
	this.hoursAngle = date.getHours()*360/12 + (360/12)*(date.getMinutes()/60);
	this.secondsHand.setAngle(this.secondsAngle);
	this.minutesHand.setAngle(this.minutesAngle);
	this.hoursHand.setAngle(this.hoursAngle);

};

MyClock.prototype.display = function () {

	xScale = 0.5;
	yScale = 0.5;
	zScale = 0.12;

	this.centerAppearance.apply();

	// Display clock center
	this.scene.pushMatrix();
		this.scene.scale(0.02, 0.02, 0.016);
        this.scene.translate(0, 0, zScale/0.016);
        this.centerCylinder.display();
        this.scene.translate(0, 0, 1);
        this.centerCircle.display();
	this.scene.popMatrix();

	// Display clock
    this.scene.pushMatrix();
        this.scene.scale(xScale, yScale, zScale);
        this.sideAppearance.apply();
        this.cylinder.display();
        this.scene.translate(0, 0, 1);
        this.clockAppearance.apply();
        this.circle.display();
    this.scene.popMatrix();

	// Display hands
    this.scene.pushMatrix();
    	this.scene.translate(0, 0, zScale);
    	this.secondsHand.display();
    	this.minutesHand.display();
    	this.hoursHand.display();
    this.scene.popMatrix();

};