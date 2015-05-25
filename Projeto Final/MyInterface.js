/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	this.gui.add(this.scene, 'doSomething');	

	// add a group of controls (and open/expand by defult)
	
	var group=this.gui.addFolder("Luzes");
	group.open();

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;

	this.light1 = group.add(this.scene, 'centerLight');
	this.light2 = group.add(this.scene, 'windowLight');
	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters

	this.gui.add(this.scene, 'clockActive');

	/*this.light1.onChange(function(light) {
		if (light)
			this.scene.doSomething();
		else
			this.scene.doSomething();
	});*/
	
	return true;
};

/*
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
		case (87):
		case (119):     // any 'W'
			//this.scene.robot.accelerate(this.scene.robot.defaultAcceleration);
			break;
		case (83):
		case (115):     // any 'S'
			//this.scene.robot.accelerate(-this.scene.robot.defaultAcceleration);
			break;
		case(65):
		case(97):		// any 'A'
			//this.scene.robot.rotate(this.scene.robot.defaultAngleAcceleration);
			break;
		case(68):
		case(100):		// any 'D'
			//this.scene.robot.rotate(-this.scene.robot.defaultAngleAcceleration);
		break;				
	};
};*/

MyInterface.prototype.processKeyDown = function(event) {
	CGFinterface.prototype.processKeyDown.call(this,event);

	switch (event.keyCode)
	{
		case (87):
		case (119):     // any 'W'
			console.log('up');
			this.scene.wKey = 1;
			break;
		case (83):
		case (115):     // any 'S'
			console.log('down');
		this.scene.sKey = 1;
			break;
		case(65):
		case(97):		// any 'A'
			console.log('left');
		this.scene.aKey = 1;
			break;
		case(68):
		case(100):		// any 'D'
			console.log('right');
		this.scene.dKey = 1;
		break;				
	};
};

MyInterface.prototype.processKeyUp = function(event) {
	CGFinterface.prototype.processKeyUp.call(this,event);

	switch (event.keyCode)
	{
		case (87):
		case (119):     // any 'W'
			console.log('up');
		this.scene.wKey = 0;
			break;
		case (83):
		case (115):     // any 'S'
			console.log('down');
		this.scene.sKey = 0;
			break;
		case(65):
		case(97):		// any 'A'
			console.log('left');
		this.scene.aKey = 0;
			break;
		case(68):
		case(100):		// any 'D'
			console.log('right');
		this.scene.dKey = 0;
		break;				
	};
};
