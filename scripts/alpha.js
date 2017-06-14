// Initialize function: START FROM HERE:

function init() {

  // Flag to check whether mouse is down:
  var checkDown = 0;

  // Initialize a counter for the no of points:
  var ptCount = 0;
  var ptArray = [];


  // Create the main viewer.
  var viewer = new MJPEGCANVAS.Viewer({
    divID: 'mjpeg',
    host: 'localhost',
    width: 640,
    height: 480,
    topic: '/mavros/camera1/image_raw',
  });



  // Add a Listener for mouse clicks on the Canvas: MAY BE DO THIS ONLY AFTER SELECT TARGET BUTTON HAS BEEN CLICKED:
  viewer.canvas.addEventListener('mousedown', function(evt) {

    // Set the flag to 1:
    checkDown =1;


    // Get the start Position:
    window.startPos = getMousePos(viewer.canvas , evt);

    // WORKS:
    this.style.cursor = "crosshair";

            // Add a listener for mouse movements:
            viewer.canvas.addEventListener('mousemove', function(evt) {



            if (checkDown == 1) {

                window.mousePos = getMousePos(viewer.canvas, evt);
                var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                updateDisplay(viewer.canvas, message, mousePos);
              }



      // Set interval to repeatedly draw the rectangle:
      interval = setInterval( updateDisplayMouseDown(viewer.canvas, mousePos) 100);


    }, false);




  // Mouse up event listner:
  viewer.canvas.addEventListener('mouseup', function(evt) {

    checkDown = 0;

    clearInterval(interval);

});


///////////////////// --------------------------   SUB-FUNCTIONS ----------------------------- //////////////////////////////////////////

// 1. Function to get the mouse position:
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


// 2. Function to updateDisplay:
function updateDisplay(canvas, message, mousePos) {

  var context = canvas.getContext('2d');

  var width = mousePos.x - startPos.x;
  var height = mousePos.y - startPos.y;



  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '18pt Calibri';
  context.fillStyle = 'black';
  context.fillText(message, 10, 25);


  // Draw a rectangle inside the canvas:
  // Specs: Start at (5,5) and of size 200,300:

  if (height > 0 && width > 0) {
    // // Start the object being drawn:
    context.beginPath();



    // Set params:
    context.lineWidth = "6";
    context.strokeStyle = "red";
    context.rect(startPos.x , startPos.y , width, height );

    //Execute:
    context.stroke();

  }



}

// 3. Function to updateDisplay when the mouse is down:
function updateDisplayMouseDown(canvas, mousePos) {

  var context = canvas.getContext('2d');

  var width = mousePos.x - startPos.x;
  var height = mousePos.y - startPos.y;



  // Draw a rectangle inside the canvas:
  // Specs: Start at (5,5) and of size 200,300:

  if (height > 0 && width > 0) {
    // // Start the object being drawn:
    context.beginPath();



    // Set params:
    context.lineWidth = "6";
    context.strokeStyle = "red";
    context.rect(startPos.x , startPos.y , width, height );

    //Execute:
    context.stroke();

  }



}




}
