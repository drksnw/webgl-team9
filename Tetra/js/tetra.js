class Tetra
{
  constructor(color)
  {
    this.color = color;
    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.colorBuffer = null;
    this.indices = [];
    this.vertices = [];
    this.colors = [];

    this.mvMatrix = mat4.create();

    this.init();
  }

  init()
  {
    this.vertices.push(0.0, 0.0, 0.0); //Point A
    this.vertices.push(1.0, 0.0, 0.0); //Point B
    this.vertices.push(.5, 0.0, -1.0); //Point C
    this.vertices.push(.5, 1.0, -.5); //Point D

    this.indices.push(0, 1, 2, 3, 0, 2); // ACBDCA

    this.colors.push(1.0, 0.0, 0.0, 1.0);
    this.colors.push(0.0, 1.0, 0.0, 1.0);
    this.colors.push(0.0, 0.0, 1.0, 1.0);
    this.colors.push(0.0, 1.0, 1.0, 1.0);
    this.colors.push(1.0, 1.0, 1.0, 1.0);

    this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
    this.colorBuffer = getVertexBufferWithVertices(this.colors);
    this.indexBuffer = getIndexBufferWithIndices(this.indices);

  }

  draw()
  {
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(-1.0, -1.0, -1.0));

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    glContext.drawElements(glContext.TRIANGLE_STRIP, this.indices.length, glContext.UNSIGNED_SHORT, 0);
  }
}
