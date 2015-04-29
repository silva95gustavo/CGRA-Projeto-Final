/**
 * MyCone
 * @constructor
 */
 function MyCone(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
 	this.initBuffers();
 };
 MyCone.prototype = Object.create(CGFobject.prototype);
 MyCone.prototype.constructor = MyCone;
 
	MyCone.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
 	var ang = Math.PI*2/this.slices;
 	var alfa = 0;
 	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
 	verts = 0;
 	dif_height = 1/this.stacks;
	for(j = 0; j <= this.stacks; j++)
	{
		for(i = 0; i < this.slices; i++)
		{
			x = Math.cos(alfa);
			y = Math.sin(alfa);
			scale = 1-j*dif_height;
			this.vertices.push(x*scale, y*scale, j*dif_height);
			this.normals.push(x, y, 0);
			alfa+=ang;
			verts++;
			if(i > 0 && j > 0)
			{
				this.indices.push(verts-1, verts-2, verts-this.slices-1);
				this.indices.push(verts-this.slices-2, verts-this.slices-1, verts-2);
			}
			
			if(i == this.slices-1 && j>0)
			{
				this.indices.push(verts-this.slices-1, verts-this.slices, verts-1);
				this.indices.push(verts-this.slices-1, verts-2*this.slices, verts-this.slices);
			}
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

