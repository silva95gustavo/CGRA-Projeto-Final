/**
 * MyChair
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyChair(scene) {
	CGFobject.call(this,scene);

	this.quad = new MyUnitCubeQuad(this.scene);

	this.materialWood = new CGFappearance(scene);
	this.materialMetal = new CGFappearance(scene);

	this.materialWood.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.materialWood.setDiffuse(0.5,0.5,0.5,1);
	this.materialWood.setSpecular(0.1,0.1,0.1,1);
	this.materialWood.setShininess(2);
	this.materialWood.loadTexture("resources/images/table.png");

	this.materialMetal.setAmbient(0.3, 0.3, 0.3, 1.0);
	this.materialMetal.setDiffuse(0.2,0.2,0.2,1);
	this.materialMetal.setSpecular(0.95,0.95,0.95,1);
	this.materialMetal.setShininess(250);
};

MyChair.prototype = Object.create(CGFobject.prototype);
MyChair.prototype.constructor=MyChair;

MyChair.prototype.display = function () {

	this.materialWood.apply();

    // Assento
    this.scene.pushMatrix();
    this.scene.translate(0, 1.8 + 0.25/2, 0);
    this.scene.scale(2, 0.25, 1.8);
    this.quad.display();
    this.scene.popMatrix();

    // Encosto
    this.scene.pushMatrix();
    this.scene.translate(-1.8 / 2, 1.8 + 0.25 + 2.0 / 2, 0);
    this.scene.scale(0.2, 2.0, 1.8);
    this.quad.display();
    this.scene.popMatrix();

	this.materialMetal.apply();
	
    // Perna frente esquerda
    this.scene.pushMatrix();
    this.scene.translate((2.0 - 0.2) / 2, 1.8/2, -(1.8 - 0.2) / 2);
    this.scene.scale(0.2, 1.8, 0.2);
    this.quad.display();
    this.scene.popMatrix();

    // Perna frente direita
    this.scene.pushMatrix();
    this.scene.translate((2.0 - 0.2) / 2, 1.8/2, (1.8 - 0.2) / 2);
    this.scene.scale(0.2, 1.8, 0.2);
    this.quad.display();
    this.scene.popMatrix();

    // Perna trás esquerda
    this.scene.pushMatrix();
    this.scene.translate(-(2.0 - 0.2) / 2, 1.8/2, -(1.8 - 0.2) / 2);
    this.scene.scale(0.2, 1.8, 0.2);
    this.quad.display();
    this.scene.popMatrix();

     // Perna trás direita
    this.scene.pushMatrix();
    this.scene.translate(-(2.0 - 0.2) / 2, 1.8/2, (1.8 - 0.2) / 2);
    this.scene.scale(0.2, 1.8, 0.2);
    this.quad.display();
    this.scene.popMatrix();
};