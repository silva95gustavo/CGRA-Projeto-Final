/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

 	var ang = Math.PI*2/this.slices;
 	var alfa = 0;
 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];

 	this.secondface = [];
 	this.secondfacenormals = [];

 	verts = 0;

 	for(i = 0; i < this.slices; i++)
	{
		var xi = Math.cos(alfa);
		var yi = Math.sin(alfa);
		this.vertices.push(xi, yi, 0);
		this.vertices.push(xi, yi, 1);
	
		alfa += ang/2;

		normX = Math.cos(alfa);
		normY = Math.sin(alfa);

		alfa += ang/2;

		var xf = Math.cos(alfa);
		var yf = Math.sin(alfa);
		this.vertices.push(xf, yf, 0);
		this.vertices.push(xf, yf, 1);

		verts+=4;

		this.normals.push(normX, normY, 0, normX, normY, 0, normX, normY, 0, normX, normY, 0);

		this.indices.push(verts - 3, verts- 2, verts-1);
		this.indices.push(verts-4, verts-2, verts-3);

		for(j = 2; j <= this.stacks; j++)
		{
			this.vertices.push(xi, yi, j, xf, yf, j);
			verts += 2;
			this.normals.push(normX, normY, 0, normX, normY, 0);

			if(j > 2)
			{
				this.indices.push(verts-1, verts- 2, verts-3);
				this.indices.push(verts-4, verts-3, verts-2);
			}
			else
			{
				this.indices.push(verts-1, verts- 2, verts-5);
				this.indices.push(verts-5, verts-3, verts-1);
			}
			
		}
				
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
