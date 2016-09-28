//Modifications file
//Try to keep the original code as vanilla as possible

function updateDivisions(){
  var newVal = document.getElementById("myRange").value;
  for(var i=0; i<sceneObjects.length; i++){
    sceneObjects[i].changeDiv(newVal);
  }
}
