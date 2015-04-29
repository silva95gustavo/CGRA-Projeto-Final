/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(scene) {
	CGFobject.call(this,scene);

	this.quad = new MyUnitCubeQuad(this.scene);

	this.tableAppearance = new CGFappearance(scene);
	this.materialMetal = new CGFappearance(scene);

	this.tableAppearance.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.tableAppearance.setDiffuse(0.5, 0.5,0.5,1);
	this.tableAppearance.setSpecular(0.1,0.1,0.1,1);
	this.tableAppearance.setShininess(2);
	this.tableAppearance.loadTexture("resources/images/table.png");

	this.materialMetal.setAmbient(0.3, 0.3, 0.3, 1.0);
	this.materialMetal.setDiffuse(0.1,0.1,0.1,1);
	this.materialMetal.setSpecular(0.9,0.9,0.9,1);
	this.materialMetal.setShininess(250);
};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor=MyTable;

MyTable.prototype.display = function () {

	this.tableAppearance.apply();

    // Tampo
    this.scene.pushMatrix();
    this.scene.translate(0, 3.6, 0);
    this.scene.scale(5, 0.3, 3);
    this.quad.display();
    this.scene.popMatrix();

	this.materialMetal.apply();
	
    // Perna frente esquerda
    this.scene.pushMatrix();
    this.scene.translate(-2.2, 1.75, 1.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.quad.display();
    this.scene.popMatrix();

     // Perna frente direita
    this.scene.pushMatrix();
    this.scene.translate(2.2, 1.75, 1.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.quad.display();
    this.scene.popMatrix();

    // Perna trás esquerda
    this.scene.pushMatrix();
    this.scene.translate(-2.2, 1.75, -1.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.quad.display();
    this.scene.popMatrix();

     // Perna trás direita
    this.scene.pushMatrix();
    this.scene.translate(2.2, 1.75, -1.2);
    this.scene.scale(0.3, 3.5, 0.3);
    this.quad.display();
    this.scene.popMatrix();
};