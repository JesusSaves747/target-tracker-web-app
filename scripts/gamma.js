
var upIntervalExists = false;


// Initialize function: START FROM HERE:
function alpha(){

  // Initialize Listeners for the three buttons:
  window.startBtn = document.getElementById("startBtn");
  window.selectBtn = document.getElementById("selectBtn");
  window.trackBtn = document.getElementById("trackBtn");
  //window.takeOffBtn = document.getElementById("takeOffBtn");


  startBtn.addEventListener('click', init, false);
  selectBtn.addEventListener('click', select, false);
  trackBtn.addEventListener('click', track, false);
//takeOffBtn.addEventListener('click', takeOff, false);



}


// Function to track the objects in the selected region:
function track(){


// Step 1: Create a connection to ROS bridge server:
// Open up a connection on the localhost at port 9090:

window.rbServer = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
 });

 if (rbServer){

   console.log("Started ROS bridge server connection");
 }


// Step 2: Get the startPos and endPos and compute their average abd publish to the topic ROI center:


// Step 3: Run the node color tracker: Do this by creating a ROS Param: Change color of rectangle to Green:
var startTracker = new ROSLIB.Param({
  ros : rbServer,
  name : 'Start_Tracker'
});

startTracker.set(1);


//sleep(2);

// Step 4: Now acquire the processed images on the canvas:
//Trying this out:
// Create the main viewer.

var context = viewer.canvas.getContext('2d');
context.clearRect(0, 0, viewer.canvas.width, viewer.canvas.height);

viewer.changeStream('/mavros/camera1/image_proc');


if (upIntervalExists){
  clearInterval(upInterval);
}


}


// Function to launch the UAV to a desired position:
function takeOff(){


// Open up a connection on the localhost at port 9090:

 //  window.rbServer = new ROSLIB.Ros({
 //    url : 'ws://localhost:9090'
 // });


// Create an object to communicate with the topic /mavros/setpoint_position/local:
// These lines create a topic object as defined by roslibjs
var setPosTopic = new ROSLIB.Topic({
    ros : rbServer,
    name : '/mavros/setpoint_position/local:',
    messageType : 'geometry_msgs/PoseStamped'
});



}



// Callback for the select region button:

function select(){

  var mjpeg = document.getElementById("mjpeg");

  // WORKS:
  mjpeg.style.cursor = "crosshair";


  if (upIntervalExists){

    clearInterval(upInterval);

  }



// Add a Listener for mouse clicks on the Canvas: MAY BE DO THIS ONLY AFTER SELECT TARGET BUTTON HAS BEEN CLICKED:
viewer.canvas.addEventListener('mousedown', function(evt) {


  checkDown =1;

  // Get the start Position:
  window.startPos = getMousePos(viewer.canvas , evt);



                  // Add a listener for mouse movements:
                  viewer.canvas.addEventListener('mousemove', function(evt){
                    window.mousePos = getMousePos(viewer.canvas, evt);

                    if (checkDown == 1) {

                      var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                      updateDisplay(viewer.canvas, message);
                    }


                  } , false);

    // Set interval to repeatedly draw the rectangle:
    interval = setInterval( function updateDisplayMouseDown() {

        var context = viewer.canvas.getContext('2d');

        var width = mousePos.x - startPos.x;
        var height = mousePos.y - startPos.y;



        // Draw a rectangle inside the canvas:
        // Specs: Start at (5,5) and of size 200,300:

        if (height > 0 && width > 0) {
          // // Start the object being drawn:
          context.beginPath();



          // Set params:
          context.lineWidth = "1";
          context.strokeStyle = "red";
          context.rect(startPos.x , startPos.y , width, height );

          //Execute:
          context.stroke();


        }



}, 1);



});


// Mouse up event listner:
viewer.canvas.addEventListener('mouseup', function(evt) {

checkDown =0;



  trackBtn.disabled =false;
  selectBtn.disabled = true;



clearInterval(interval);

window.endPos = getMousePos(viewer.canvas, evt);

// Set interval to repeatedly draw the rectangle:
upInterval = setInterval( function updateDisplayMouseUp() {

    var context = viewer.canvas.getContext('2d');

    var width = endPos.x - startPos.x;
    var height = endPos.y - startPos.y;



    // Draw a rectangle inside the canvas:
    // Specs: Start at (5,5) and of size 200,300:

    if (height > 0 && width > 0) {
      // // Start the object being drawn:
      context.beginPath();



      // Set params:
      context.lineWidth = "1";
      context.strokeStyle = "orange";
      context.rect(startPos.x , startPos.y , width, height );

      //Execute:
      context.stroke();


    }


}, 1);  // END set Interval:

upIntervalExists = true;



});   // END mouseup event listner



}  // END Select Btn Callback



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
function updateDisplay(canvas, message) {

  var context = canvas.getContext('2d');

  var width = mousePos.x - startPos.x;
  var height = mousePos.y - startPos.y;



  //context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '18pt Calibri';
  context.fillStyle = 'black';
  //context.fillText(message, 10, 25);


  // Draw a rectangle inside the canvas:
  // Specs: Start at (5,5) and of size 200,300:

  if (height > 0 && width > 0) {
    // // Start the object being drawn:
    context.beginPath();



    // Set params:
    context.lineWidth = "1";
    context.strokeStyle = "red";
    context.rect(startPos.x , startPos.y , width, height );

    //Execute:
    context.stroke();

  }


}





// 4. Initialize function:
function init() {



  // Flag to check whether mouse is down:
  var checkDown = 0;

  // Initialize a counter for the no of points:
  var ptCount = 0;
  var ptArray = [];


  // Create the main viewer.
  window.viewer = new MJPEGCANVAS.Viewer({
    divID: 'mjpeg',
    host: 'localhost',
    width: 800,
    height: 600,
    topic: '/mavros/camera1/image_raw',
  });




  // Enable the select target region button:
  if (viewer){

    selectBtn.disabled =false;
    //takeOffBtn.disabled = false;
    startBtn.disabled = true;
  }




}  //END init function:
