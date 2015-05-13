/**
 * MyRobotBody
 * @constructor
 */
 function MyRobotBody(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
 	this.initBuffers();
 };
 MyRobotBody.prototype = Object.create(CGFobject.prototype);
 MyRobotBody.prototype.constructor = MyRobotBody;
 MyRobotBody.prototype.initBuffers = function() {
 	var ang = Math.PI*2/this.slices;
 	var alfa = 0;

 	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
	this.texCoords = [];
 	verts = 0;
 	
 	for(j = 0; j <= this.stacks; j++)
	{
		this.vertices.push(1, 0, j / this.stacks);
		this.normals.push(1, 0, j / this.stacks);
		this.texCoords.push(0, 0);
		verts += 1;

		for(i = 0; i <= this.slices; i++)
		{
			alfa+=ang;
			x = Math.cos(alfa);
			y = Math.sin(alfa);
			this.vertices.push(x, y, j / this.stacks);
			this.normals.push(x, y, j / this.stacks);
			this.texCoords.push(i / this.slices, j / this.stacks);
			verts++;

			if(j > 0 && i > 0)
			{
				this.indices.push(verts-1, verts-2, verts-this.slices-3);
				this.indices.push(verts-this.slices-4, verts-this.slices-3, verts-2);
			}
		}
	}
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };