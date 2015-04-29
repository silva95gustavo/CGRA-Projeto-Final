/**
 * MyLamp
 * @constructor
 */
 function MyLamp(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MyLamp.prototype = Object.create(CGFobject.prototype);
 MyLamp.prototype.constructor = MyLamp;

 MyLamp.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

 	var ang = Math.PI*2/this.slices;
 	var alfa = 0;

	var ang2 = (Math.PI/2)/this.stacks;
 	var beta = 0;


 	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
 	verts = 0;

	for(j = 0; j <= this.stacks; j++)
	{
		this.vertices.push(1 * Math.cos(beta), 0, Math.sin(beta));
		this.normals.push(1 * Math.cos(beta), 0, Math.sin(beta));
		verts += 1;

		for(i = 0; i < this.slices; i++)
		{
			alfa+=ang;
			x = Math.cos(alfa);
			y = Math.sin(alfa);
			this.vertices.push(x * (Math.cos(beta)), y * (Math.cos(beta)), Math.sin(beta));
			this.normals.push(x * Math.cos(beta), y * Math.cos(beta), Math.sin(beta));
			verts++;

			if(j > 0)
			{
				this.indices.push(verts-1, verts-2, verts-this.slices-2);
				this.indices.push(verts-this.slices-3, verts-this.slices-2, verts-2);
			}
		}

		beta += ang2;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
