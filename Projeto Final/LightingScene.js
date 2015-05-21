var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();

	this.initLights();

	this.enableTextures(true);

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.enable(this.gl.BLEND);
	this.gl.blendEquation(this.gl.FUNC_ADD);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); 
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.depthMask(true);

	this.axis = new CGFaxis(this);

	// Interface variables
	this.centerLight = true;
	this.windowLight = true;
	this.clockActive = true;

	// Scene elements
	this.table = new MyTable(this);
	this.floor = new MyQuad(this, 0, 10, 0, 12);
	this.landscape = new MyQuad(this, 0, 1, 0, 1);
	this.leftWall = new MyQuad(this, -0.75, 1.75, -0.25, 1.25);
	this.wall = new Plane(this);
	this.boardA = new Plane(this, BOARD_A_DIVISIONS, -0.25, 1.25, 0, 1);
	this.boardB = new Plane(this, BOARD_B_DIVISIONS);
	this.chair = new MyChair(this);
	this.lamp = new MyLamp(this, 8, 10);
	this.pillar = new MyCylinder(this, 8, 3);
	this.clock = new MyClock(this);
	this.airplane = new MyAirplane(this);

	// Robot variables
	this.robot = new MyRobot(this);
	this.robot.x = 7.5;
	this.robot.y = 0;
	this.robot.z = 3;
	this.robot.resistance = this.robot.defaultResistance;
	this.robot.angle = 210*degToRad;
	this.robot.angleResistance = this.robot.defaultAngleResistance;
	this.robotAppearances = [];
	this.setRobotTex(this.robotAppearances);
	this.robotAppearanceIndex = this.androidICSIndex;
	
	// Key variables
	this.wKey = 0;
	this.aKey = 0;
	this.sKey = 0;
	this.dKey = 0;

	// For plane animation
	this.prevTime = 0;
	this.airplaneX = 3.5;
	this.airplaneY = 3.75;
	this.airplaneZ = 8;
	this.airplaneMovementStage = 0;

	// Materials
	this.windowAppearance = new CGFappearance(this);
	this.windowAppearance.setAmbient(0.8, 0.8, 0.8, 1);
	this.windowAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
	this.windowAppearance.setSpecular(0.1, 0.1, 0.1, 1);
	this.windowAppearance.setShininess(2);
	this.windowAppearance.loadTexture("resources/images/window_open.png");
	this.windowAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	
	this.landscape0Appearance = new CGFappearance(this);
	this.landscape0Appearance.setAmbient(1, 1, 1, 1);
	this.landscape0Appearance.setDiffuse(1, 1, 1, 1);
	this.landscape0Appearance.setSpecular(0, 0, 0, 1);
	this.landscape0Appearance.setShininess(1);
	this.landscape0Appearance.loadTexture("resources/images/landscape0.png");
	this.landscape0Appearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	
	this.landscape1Appearance = new CGFappearance(this);
	this.landscape1Appearance.setAmbient(1, 1, 1, 1);
	this.landscape1Appearance.setDiffuse(1, 1, 1, 1);
	this.landscape1Appearance.setSpecular(0, 0, 0, 1);
	this.landscape1Appearance.setShininess(1);
	this.landscape1Appearance.loadTexture("resources/images/landscape1.png");
	this.landscape1Appearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	
	this.landscape2Appearance = new CGFappearance(this);
	this.landscape2Appearance.setAmbient(1, 1, 1, 1);
	this.landscape2Appearance.setDiffuse(1, 1, 1, 1);
	this.landscape2Appearance.setSpecular(0, 0, 0, 1);
	this.landscape2Appearance.setShininess(1);
	this.landscape2Appearance.loadTexture("resources/images/landscape2.png");
	this.landscape2Appearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	// Wall is a combination of the wall texture and the blue color
	this.materialWall = new CGFappearance(this);
	this.materialWall.setAmbient(0.1,0.1,0.2,1);
	this.materialWall.setDiffuse(0.1,0.1,0.2,1);
	this.materialWall.setSpecular(0.01, 0.01, 0.02, 1);	
	this.materialWall.setShininess(2);
	this.materialWall.loadTexture("resources/images/wall.jpg");
	this.materialWall.setTextureWrap("REPEAT", "REPEAT");

	this.floorAppearance = new CGFappearance(this);
	this.floorAppearance.setAmbient(0.5, 0.5, 0.5, 1);
	this.floorAppearance.setDiffuse(0.5, 0.5, 0.5, 1);
	this.floorAppearance.setSpecular(0.1, 0.1, 0.1, 1);
	this.floorAppearance.setShininess(2);
	this.floorAppearance.loadTexture("resources/images/floor.png");
	this.floorAppearance.setTextureWrap("REPEAT", "REPEAT");

	this.slidesAppearance = new CGFappearance(this);
	this.slidesAppearance.setAmbient(0.5, 0.5, 0.5, 1);
	this.slidesAppearance.setDiffuse(0.5, 0.5, 0.5, 1);
	this.slidesAppearance.setSpecular(0.1, 0.1, 0.1, 1);
	this.slidesAppearance.setShininess(2);
	this.slidesAppearance.loadTexture("resources/images/slides.png");
	this.slidesAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.boardAppearance = new CGFappearance(this);
	this.boardAppearance.setAmbient(0.5, 0.5, 0.5);
	this.boardAppearance.setDiffuse(0.5, 0.5, 0.5);
	this.boardAppearance.setSpecular(0.8, 0.8, 0.8);
	this.boardAppearance.setShininess(150);
	this.boardAppearance.loadTexture("resources/images/board.png");
	this.boardAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	
	this.pillarAppearance = new CGFappearance(this);
	this.pillarAppearance.setAmbient(0.9, 0.9, 0.9);
	this.pillarAppearance.setDiffuse(0.9, 0.9, 0.9);
	this.pillarAppearance.setSpecular(0.1, 0.1, 0.1);
	this.pillarAppearance.setShininess(150);
	this.pillarAppearance.loadTexture("resources/images/pillar.png");
	this.pillarAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");

	this.airplaneAppearance = new CGFappearance(this);
	this.airplaneAppearance.setAmbient(0.9, 0.9, 0.9);
	this.airplaneAppearance.setDiffuse(0.9, 0.9, 0.9);
	this.airplaneAppearance.setSpecular(0.1, 0.1, 0.1);
	this.airplaneAppearance.setShininess(10);

	this.setUpdatePeriod(30);
};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.doSomething = function() {
	console.log("Doing something...");
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(0.3,0.3,0.3, 1.0);
	//this.setGlobalAmbientLight(0, 0, 0, 0);

	this.shader.bind();
	
	// Center light
	this.lights[0].setPosition(7.5, 7.5, 8, 1);
	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(0.8, 0.8, 0.8, 1);
	this.lights[0].setSpecular(0.8, 0.8, 0.8, 1);
	this.lights[0].enable();
	
	// Window light
	this.lights[1].setPosition(0, 8 / 2, 7.5 / 2, 1);
	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(0.8, 0.8, 0.8, 1);
	this.lights[1].setSpecular(0.8, 0.8, 0.8, 1);
	this.lights[1].enable();

	this.shader.unbind();
};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}

LightingScene.prototype.update = function(currTime) {

	if (this.clockActive)
		this.clock.update(currTime);
		
		if(this.prevTime == 0)
			this.prevTime = currTime;

		this.robot.update(currTime - this.prevTime);

		this.prevTime = currTime;
		
	if (this.centerLight)
		this.lights[0].enable();
	else
		this.lights[0].disable();
	
	if (this.windowLight)
		this.lights[1].enable();
	else
		this.lights[1].disable();
	
	/*if(this.wKey != 0)
		this.robot.move(0.2);
	if(this.sKey != 0)
		this.robot.move(-0.2);
	if(this.aKey != 0)
		this.robot.angle += 0.1;
	if(this.dKey != 0)
		this.robot.angle -= 0.1;*/
}


LightingScene.prototype.display = function() {
	this.shader.bind();

	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	//this.materialDefault.apply();

	// ---- END Background, camera and axis setup

	
	// ---- BEGIN Geometric transformation section

	// ---- END Geometric transformation section


	// ---- BEGIN Primitive drawing section
	
	// Landscape 2
	this.pushMatrix();
		this.translate(-10, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15 * 2.5, 8 * 2.5, 1);
		this.landscape2Appearance.apply();
		this.landscape.display();
	this.popMatrix();
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
	
	// Landscape 1
	this.pushMatrix();
		this.translate(-8, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15 * 2.5, 8 * 2.5, 1);
		this.landscape1Appearance.apply();
		this.landscape.display();
	this.popMatrix();
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
	
	// Landscape 0
	this.pushMatrix();
		this.translate(-3, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15 * 1.5, 8 * 1.5, 1);
		this.landscape0Appearance.apply();
		this.landscape.display();
	this.popMatrix();
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
	
	// Left Wall
	this.pushMatrix();
		this.translate(0, 4, 7.5);
		this.rotate(90 * degToRad, 0, 1, 0);
		this.scale(15, 8, 0.2);
		this.windowAppearance.apply();
		this.leftWall.display();
	this.popMatrix();
	this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
	
	// Floor
	this.pushMatrix();
		this.translate(7.5, 0, 7.5);
		this.rotate(-90 * degToRad, 1, 0, 0);
		this.scale(15, 15, 0.2);
		this.floorAppearance.apply();
		this.floor.display();
	this.popMatrix();

	// Right Wall
	this.pushMatrix();
		this.translate(7.5, 4, 0);
		this.scale(15, 8, 0.2);
		this.materialWall.apply();
		this.wall.display();
	this.popMatrix();

	// First Table
	this.pushMatrix();
		this.translate(5, 0, 8);
		this.table.display();
	this.popMatrix();

	// Second Table
	this.pushMatrix();
		this.translate(12, 0, 8);
		this.table.display();
	this.popMatrix();

	// Board A
	this.pushMatrix();
		this.translate(4, 4.5, 0.2);
		this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		
		this.slidesAppearance.apply();
		this.boardA.display();
	this.popMatrix();

	// Board B
	this.pushMatrix();
		this.translate(10.5, 4.5, 0.2);
		this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
		
		this.boardAppearance.apply();
		this.boardB.display();
	this.popMatrix();

	// Chair A
	this.pushMatrix();
		this.rotate(Math.PI / 2, 0, 1, 0);

		//			               z           y          x
		this.translate(-(8 + BOARD_WIDTH / 4), 0, 4 + BOARD_HEIGHT / 4);

		this.chair.display();
	this.popMatrix();

	// Chair B
	this.pushMatrix();
		this.rotate(Math.PI / 2, 0, 1, 0);

		//			               z           y          x
		this.translate(-(8 + BOARD_WIDTH / 4), 0, 10.5 + BOARD_HEIGHT / 4);
		
		this.chair.display();
	this.popMatrix();

	// Lamp
	this.pushMatrix();
		this.rotate(Math.PI / 2, 1, 0, 0);
		this.translate(7.5, 7.5, -8);
		this.lamp.display();
	this.popMatrix();
	
	// Pillar
	this.pushMatrix();
		this.translate(0, 0, 16);
		this.rotate(- Math.PI / 2, 1, 0, 0);
		this.scale(1, 1, 8);
		this.pillarAppearance.apply();
		this.pillar.display();
	this.popMatrix();

	// Clock
	this.pushMatrix();
		this.translate(7.5, 7.2, 0);
		this.clock.display();
	this.popMatrix();

	this.airplaneAppearance.apply();

	// Airplane
	this.pushMatrix();
		if(this.airplaneMovementStage == 0)
		{
			this.rotate(-Math.PI/2, 1, 0, 0);
			this.rotate(-Math.PI/2, 0, 0, 1);
			this.translate(this.airplaneZ, this.airplaneX, this.airplaneY);
		}
		else if (this.airplaneMovementStage == 1)
		{
			this.rotate(-Math.PI/2, 0, 1, 0);
			this.translate(this.airplaneZ, this.airplaneY, -this.airplaneX-0.15);
		}
		
		this.airplane.display();
	this.popMatrix();

	// Robot
	this.pushMatrix();
		this.robot.displayAppearance(this.robotAppearances[this.robotAppearanceIndex]);
	this.popMatrix();

	// ---- END Primitive drawing section
	
	this.shader.unbind();
};

LightingScene.prototype.animatePlane = function(currTime) {
	
	timeDiff = 0;

	if(this.prevTime == 0)		// First time function is called
		this.prevTime = currTime;
	else						// Following times, update timeDiff
		timeDiff += currTime-this.prevTime;
	
	prevTime = currTime;	

	if(timeDiff != 0)
	{
		if(timeDiff > 50)		// Only gets here on each animation "frame" - 50ms
		{
			timeDiff -= 50;
			
			if(this.airplaneX > 0)
			{
				this.airplaneX -= 0.1;
				this.airplaneY += 0.05;
			}
			else
			{
				this.airplaneX = 0;

				this.airplaneMovementStage = 1;

				if(this.airplaneY > 0)
					this.airplaneY -= 0.1;
			}

		}
	}	
};

LightingScene.prototype.setRobotTex = function(texSet) {
	
	// Standard green texture
	robotAndroidGreen = [];
	robotGeneralAppearance = new CGFappearance(this);
	robotGeneralAppearance.setAmbient(102/255/1.3, 1/1.3, 0);
	robotGeneralAppearance.setDiffuse(102/255/1.3, 1/1.3, 0);
	robotGeneralAppearance.setSpecular(1, 1, 1);
	robotGeneralAppearance.setShininess(400);
	robotAndroidGreen[this.robot.bodyApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.bodyTopApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.armsApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.armTopApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.antennaApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.antennaTopApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.headApIndex] = robotGeneralAppearance;
	robotAndroidGreen[this.robot.headBottomApIndex] = robotGeneralAppearance;
	
	robotEyeAppearance = new CGFappearance(this);
	robotEyeAppearance.setAmbient(0, 0, 0);
	robotEyeAppearance.setDiffuse(0, 0, 0);
	robotEyeAppearance.setSpecular(0.2, 0.2, 0.2);
	robotEyeAppearance.setShininess(10);
	robotAndroidGreen[this.robot.eyeApIndex] = robotEyeAppearance;
	robotAndroidGreen[this.robot.eyeFrontApIndex] = robotEyeAppearance;
	
	robotWheelAppearance = new CGFappearance(this);
	robotWheelAppearance.setAmbient(0.4, 0.4, 0.4);
	robotWheelAppearance.setDiffuse(0.6, 0.6, 0.6);
	robotWheelAppearance.setSpecular(0.2, 0.2, 0.2);
	robotWheelAppearance.setShininess(10);
	robotWheelAppearance.loadTexture("resources/images/wheel.png");
	robotWheelAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	robotAndroidGreen[this.robot.wheelApIndex] = robotWheelAppearance;
	robotAndroidGreen[this.robot.wheelSideApIndex] = robotWheelAppearance;
	
	this.androidGreenIndex = texSet.length;
	texSet.push(robotAndroidGreen);
	
	// Android Ice Cream Sandwich
	robotAndroidICS = [];
	robotGeneralAppearance = new CGFappearance(this);
	robotGeneralAppearance.setAmbient(1, 1, 1);
	robotGeneralAppearance.setDiffuse(1, 1, 1);
	robotGeneralAppearance.setSpecular(1, 1, 1);
	robotGeneralAppearance.setShininess(40);
	robotGeneralAppearance.loadTexture("resources/images/icecreamsandwich.png");
	robotAndroidICS[this.robot.bodyApIndex] = robotGeneralAppearance;

	robotBodyTopAppearance = new CGFappearance(this);
	robotBodyTopAppearance.setAmbient(1, 1, 1);
	robotBodyTopAppearance.setDiffuse(1, 1, 1);
	robotBodyTopAppearance.setSpecular(1, 1, 1);
	robotBodyTopAppearance.setShininess(40);
	robotBodyTopAppearance.loadTexture("resources/images/icecreamsandwichtop.png");
	robotAndroidICS[this.robot.bodyTopApIndex] = robotBodyTopAppearance;
	robotAndroidICS[this.robot.headBottomApIndex] = robotBodyTopAppearance;
	
	robotHeadAppearance = new CGFappearance(this);
	robotHeadAppearance.setAmbient(1, 1, 1);
	robotHeadAppearance.setDiffuse(1, 1, 1);
	robotHeadAppearance.setSpecular(1, 1, 1);
	robotHeadAppearance.setShininess(40);
	robotHeadAppearance.loadTexture("resources/images/icecreamsandwichhead.png");
	robotAndroidICS[this.robot.headApIndex] = robotHeadAppearance;
	
	robotAntennaAppearance = new CGFappearance(this);
	robotAntennaAppearance.setAmbient(1, 1, 1);
	robotAntennaAppearance.setDiffuse(1, 1, 1);
	robotAntennaAppearance.setSpecular(1, 1, 1);
	robotAntennaAppearance.setShininess(40);
	robotAntennaAppearance.loadTexture("resources/images/icecreamsandwichantenna.png");
	robotAndroidICS[this.robot.antennaApIndex] = robotAntennaAppearance;
	robotAndroidICS[this.robot.antennaTopApIndex] = robotAntennaAppearance;
	
	robotEyeAppearance = new CGFappearance(this);
	robotEyeAppearance.setAmbient(0, 0, 0);
	robotEyeAppearance.setDiffuse(0, 0, 0);
	robotEyeAppearance.setSpecular(0.2, 0.2, 0.2);
	robotEyeAppearance.setShininess(10);
	robotAndroidICS[this.robot.eyeApIndex] = robotEyeAppearance;
	robotAndroidICS[this.robot.eyeFrontApIndex] = robotEyeAppearance;
	
	robotWheelAppearance = new CGFappearance(this);
	robotWheelAppearance.setAmbient(0.4, 0.4, 0.4);
	robotWheelAppearance.setDiffuse(0.6, 0.6, 0.6);
	robotWheelAppearance.setSpecular(0.2, 0.2, 0.2);
	robotWheelAppearance.setShininess(10);
	robotWheelAppearance.loadTexture("resources/images/wheel.png");
	robotWheelAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
	robotAndroidICS[this.robot.wheelApIndex] = robotWheelAppearance;
	robotAndroidICS[this.robot.wheelSideApIndex] = robotWheelAppearance;
	
	robotArmsAppearance = new CGFappearance(this);
	robotArmsAppearance.setAmbient(1, 1, 1);
	robotArmsAppearance.setDiffuse(1, 1, 1);
	robotArmsAppearance.setSpecular(1, 1, 1);
	robotArmsAppearance.setShininess(40);
	robotArmsAppearance.loadTexture("resources/images/icecreamsandwicharms.png");
	robotAndroidICS[this.robot.armsApIndex] = robotArmsAppearance;
	
	robotArmsTopAppearance = new CGFappearance(this);
	robotArmsTopAppearance.setAmbient(1, 1, 1);
	robotArmsTopAppearance.setDiffuse(1, 1, 1);
	robotArmsTopAppearance.setSpecular(1, 1, 1);
	robotArmsTopAppearance.setShininess(40);
	robotArmsTopAppearance.loadTexture("resources/images/icecreamsandwicharmstop.png");
	robotAndroidICS[this.robot.armTopApIndex] = robotArmsTopAppearance;

	this.androidICSIndex = texSet.length;
	texSet.push(robotAndroidICS);
}
