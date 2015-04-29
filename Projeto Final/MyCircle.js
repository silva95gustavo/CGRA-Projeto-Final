/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
 	this.initBuffers();
 };
 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;
 MyCircle.prototype.initBuffers = function() {
 	
 	var ang = Math.PI*2/this.slices;
 	var alfa = 0;
 	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];

	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5, 0.5);
	
	verts=1;
	alfa=0;

	for(i = 0; i < this.slices; i++)
	{
		x=Math.cos(alfa);
		y=Math.sin(alfa);
		this.vertices.push(x, y, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(x/2+0.5, -y/2+0.5);
		
		alfa+=ang;
		verts++;

		if(i < this.slices-1)
			this.indices.push(0, verts-1, verts);
		else
			this.indices.push(0, verts-1, 1);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

