/**
 * MyAirplane
 * @constructor
 */
 function MyAirplane(scene) {
 	CGFobject.call(this,scene);
	
 	this.initBuffers();
 };

MyAirplane.prototype = Object.create(CGFobject.prototype);
MyAirplane.prototype.constructor = MyAirplane;

 MyAirplane.prototype.initBuffers = function() {
 
	width = 0.5;
	center_width = 0.1;
	height = 0.1;
	
	this.vertices = [
	// wings top
		0, 0, 0,
		width / 2, 1, height,
		center_width / 2, 1, height,
		- center_width / 2, 1, height,
		- width / 2, 1, height,
		
	// wings bottom
		0, 0, 0,
		width / 2, 1, height,
		center_width / 2, 1, height,
		- center_width / 2, 1, height,
		- width / 2, 1, height,
		
	// left center top
		0, 0, 0,
		center_width / 2, 1, height,
		0, 1, 0,
		
	// right center top
		0, 0, 0,
		- center_width / 2, 1, height,
		0, 1, 0,
		
	// left center bottom
		0, 0, 0,
		center_width / 2, 1, height,
		0, 1, 0,
		
	// right center bottom
		0, 0, 0,
		- center_width / 2, 1, height,
		0, 1, 0
	]
	
	this.indices = [
		0, 1, 2, // left wing top
		7, 6, 5, // left wing bottom
		0, 3, 4, // right wing top
		9, 8, 5, // right wing bottom
		10, 11, 12, // left center top
		15, 14, 13, // right center top
		18, 17, 16, // left center bottom
		19, 20, 21 // right center bottom
	]
	
	sinHeight = Math.sin(height);
	cosHeight = Math.cos(height);
	
	centerDenominatorRoot = Math.sqrt(height * height + center_width * center_width / 4);
	
	this.normals = [
		0, - sinHeight * sinHeight, cosHeight * cosHeight,
		0, - sinHeight * sinHeight, cosHeight * cosHeight,
		0, - sinHeight * sinHeight, cosHeight * cosHeight,
		0, - sinHeight * sinHeight, cosHeight * cosHeight,
		0, - sinHeight * sinHeight, cosHeight * cosHeight,
		
		0, sinHeight * sinHeight, - cosHeight * cosHeight,
		0, sinHeight * sinHeight, - cosHeight * cosHeight,
		0, sinHeight * sinHeight, - cosHeight * cosHeight,
		0, sinHeight * sinHeight, - cosHeight * cosHeight,
		0, sinHeight * sinHeight, - cosHeight * cosHeight,
		
		
		- height / centerDenominatorRoot, 0, center_width / (2 * centerDenominatorRoot),
		- height / centerDenominatorRoot, 0, center_width / (2 * centerDenominatorRoot),
		- height / centerDenominatorRoot, 0, center_width / (2 * centerDenominatorRoot),
		
		height / centerDenominatorRoot, 0, center_width / (2 * centerDenominatorRoot),
		height / centerDenominatorRoot, 0, center_width / (2 * centerDenominatorRoot),
		height / centerDenominatorRoot, 0, center_width / (2 * centerDenominatorRoot),
		
		height / centerDenominatorRoot, 0, -center_width / -(2 * centerDenominatorRoot),
		height / centerDenominatorRoot, 0, -center_width / -(2 * centerDenominatorRoot),
		height / centerDenominatorRoot, 0, -center_width / -(2 * centerDenominatorRoot),
		
		- height / centerDenominatorRoot, 0, - center_width / -(2 * centerDenominatorRoot),
		- height / centerDenominatorRoot, 0, - center_width / -(2 * centerDenominatorRoot),
		- height / centerDenominatorRoot, 0, - center_width / -(2 * centerDenominatorRoot)
	]
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };