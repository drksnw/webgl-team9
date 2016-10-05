/**
* scene.js - This class handles the whole scene. It contains the initialisation of the gl context, the objects displayed, handles the js interactions on the page and draws the scene
*/

//Creation of 2 global matrix for the model view (mvMatrix) and for the projection (pMatrix)
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

//Creation of a global array to store the objectfs drawn in the scene
var sceneObjects = [];


//Render swap handling, the variable render contains a value used to define if the objects should be rendered as triangles or as lines
var render = 0;
function changeRender(){
	render = render ? 0 : 1;
}

//Projection type handling, the projection variable defines whether the projection should use perspective or be orthogonal
var projection = 0;
function changeProjection(){
	if(projection)
	{
		//setting the projection in perspective
		mat4.perspective(pMatrix, degToRad(40), c_width / c_height, 0.1, 1000.0);
		projection = 0;
	}
	else
	{
		//setting the projection in orthogonal
		mat4.ortho(pMatrix, -1.2, 1.2, -1.2, 1.2, 1, 10);
		projection = 1;
	}

	//Sending the new projection matrix to the shaders
	glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}


//Initialisation of the shader parameters, this very important method creates the links between the javascript and the shader.
function initShaderParameters(prg)
{
	//Linking of the attribute "vertex position"
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
	glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
	//Linking of the attribute "color"
	prg.colorAttribute 			= glContext.getAttribLocation(prg, "aColor");
	glContext.enableVertexAttribArray(prg.colorAttribute);
	//Linking of the uniform [mat4] for the projection matrix
	prg.pMatrixUniform          = glContext.getUniformLocation(prg, 'uPMatrix');
	//Linking of the uniform [mat4] for the movement matrix
	prg.mvMatrixUniform         = glContext.getUniformLocation(prg, 'uMVMatrix');
}



//Initialisation of the scene
function initScene()
{
	// Create instances here ! //

  var t = new Tetra({r:0.0,g:1.0,b:1.0});
  sceneObjects.push(t);

	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);

	//Sets the color black for the clear of the scene
	glContext.clearColor(0.0, 0.0, 0.0, 1.0);

	//Setting the projection matrix as an identity matrix
	mat4.identity(pMatrix);

	//Defining the viewport as the size of the canvas
	glContext.viewport(0.0, 0.0, c_width, c_height);

	//Calling the projection change method and setting it as orthogonal by default
	changeProjection();

	//Starting the render loop
	renderLoop();
}


//Draw scene method called when the render loop is started
function drawScene()
{

	//Clearing the previous render based on color and depth
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

	//Calling draw for each object in our scene
	for(var i= 0;i<sceneObjects.length;i++)
	{
		//Reseting the mvMatrix
		mat4.identity(mvMatrix);
		//Handling the mouse rotation on the scene
		rotateModelViewMatrixUsingQuaternion();
		//Multiplying the mvMatrix handling the camera with the object position
		mat4.multiply(mvMatrix, sceneObjects[i].mvMatrix, mvMatrix );
		//Sending the current mvMatrix to the shader
		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
		//Calling draw on the object
		sceneObjects[i].draw();
	}


}

//Initialisation of the webgl context
function initWebGL()
{
	//Initilisation on the canvas "webgl-canvas"
    glContext = getGLContext('webgl-canvas');
	//Initialisation of the programme
    initProgram();
	//Initialisation of the scene
    initScene();
}
