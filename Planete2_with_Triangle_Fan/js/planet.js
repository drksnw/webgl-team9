/**
*	planet.js - class handling the Planet object
*/


/**
* planet.js - class handling the Planet object
*	@params -
*		name[string] - name of the planet
*		radius[float] - radius of the planet
*		color[array(r,g,b)] - color of the planet
*		x[float] - x position of the planet
*		y[float] - y position of the planet
*
**/
class Planet{
	constructor(name, radius, color, x, y, z)
	{
		this.name = name;
		this.radius = radius;
		this.color = color;
		//Initialisation of the buffers within the object
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;
		//Initialisation of the arrays used to construct the object
		this.indices = [];
		this.vertices = [];
		this.colors = [];
		this.x = x;
		this.y = y;
		this.z = z;
		//Static definition of the subdivision of the perimeter of the planet to creater the various points for the verticies
		this.division = 100;
		//Creation of a model view matrix specific for the object
		this.mvMatrix = mat4.create();

		//Call of the initialisation method
		this.init();

	}

	//Initialisation method of a planet object
	init()
	{
		//Defining the center point of the circle
		this.vertices.push(0.0,0.0,0.0);

		//Based on division, generates the various vertices for the circle
		for(var i = 0;i<360;i+=360/this.division)
		{
			this.vertices.push(this.radius * Math.sin(glMatrix.toRadian(i)), this.radius * Math.cos(glMatrix.toRadian(i)),0.0);
		}

		//And defines the same color for each of the vertices
		for(var i =0;i<this.division+1;i++)
		{
			this.colors.push(this.color.r, this.color.g, this.color.b, 1.0);
		}

		//Pushing initial point
		this.indices.push(0);

		//Definies the indexes for the objects, used to link each point
		for(var i=1;i<=this.division-1;i++)
		{
			//Used for TRIANGLE_STRIP
			//this.indices.push(0,i+1,i+2);

			//Here we're using TRIANGLE_FAN, so we don't have to push the origin point for each division
			this.indices.push(i);
		}
		//and links the last vertices
		this.indices.push(1);

		//Converts the values to buffers
		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer  = getVertexBufferWithVertices(this.colors);
		this.indexBuffer  = getIndexBufferWithIndices(this.indices);


	}

	//Draw method of the planet object
	draw()
	{
		//Resets the local model view matrix
		mat4.identity(this.mvMatrix);
		//Translates the mv matrix
		mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, this.z));

		//Links and sends the vertexBuffer to the shader, defining the format to send it as
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
		glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

		//Links and sends the colorBuffer to the shader, defining the format to send it as
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
		glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
		//Links the indexBuffer with the shader
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		//Based on the render variable
		if(render)
		{
			//Renders the objet as a wireframe
			glContext.drawElements(glContext.LINE_STRIP, this.indices.length, glContext.UNSIGNED_SHORT,0);
		}
		else
		{
			//Renders the object as triangles
			glContext.drawElements(glContext.TRIANGLE_FAN, this.indices.length, glContext.UNSIGNED_SHORT,0);
		}
	}
}
