///// HANDTRACK VARIABLES ////////

// code from https://codepen.io/victordibia/pen/RdWbEY

// get the video and canvas and set the context for the canvas
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// find the button and the update note to display other information
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let mouseCursor = document.querySelector(".cursor")


// some other variables in the script
let isVideo = false;
let model = null;

let filteredPreds = []; // init predictions to use elsewhere in the code

var contextLineWidth = "3"
var contextStrokeStyle = "black"

///// GAME VARIABLES ///////

var framesPerSecond = 24;
var frame = 1;

// midpoint on the pred as marked by the dot relative to the canvas
var cursorPos, handPos = {
    x: 0,
    y: 0
};

//////////////////// HANDTRACK CODES /////////////////////////


/* 
object with the handtrack plugin configurations.
model params to be loaded into the tracking model to make it work properly
Apparently 0.5 makes for the fastest framerate on his demo site
Can reduce the number of boxes as we do not need more than 3 tbh (unless we make a two player segment)
*/
const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

// Function based off the handtrack helper methods in their library
function startVideo() {

    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            // optional update of text on screen to indicate the tracking has started successfully
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            // runDetection defined in this script below
            runDetection()
        } else {
            // optional update of text on screen to indicate video is not enabled
            updateNote.innerText = "Please enable video"
        }
    });
}

// Function to toggle the starting and stopping of the video using library helper methods
function toggleVideo() {

    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();

    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

// Function to return the predictions as used above
function runDetection() {
    model.detect(video).then(predictions => {        
        //removing face and pinch labels

        filteredPreds = predictions.filter(innerArray => innerArray.label !== 'face' && innerArray.label !== 'pinch' ); 

        model.renderPredictions(filteredPreds, canvas, context, video);

        if (isVideo) {
            // not sure how this call works
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model (note this function runs outside the functions (i think it only runs once?))
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});


//////////////////// GAME LOGIC CODES /////////////////////////

// starting function
window.onload = function() {
    // note canvas context set above

	setInterval(function() {
            updateCursor();
			// moveEverything();
			// drawEverything();	

            // increment frame
            if (frame === 24) {
                frame = 1;
            } else {
                frame++;
            }
		}, 1000/framesPerSecond);

};


// let x_scale_factor = windowWidth/videoWidth;
// let y_scale_factor = windowHeight/videoHeight;
function updateCursor() {
    // take oldest entry of hand
    if (filteredPreds.length ===1) {

        // calculate the center
        // bbox is x, y width, height
        
        handPos.x = filteredPreds[0].bbox[0] + filteredPreds[0].bbox[2] / 2
        handPos.y = filteredPreds[0].bbox[1] + filteredPreds[0].bbox[3] / 2
        

        // console.log(handPos.x, handPos.y )
    }
    cursor()


}

// var simulateMouseEvent = function(element, eventName, coordX, coordY) {
//   element.dispatchEvent(new MouseEvent(eventName, {
//     view: window,
//     bubbles: true,
//     cancelable: true,
//     clientX: coordX,
//     clientY: coordY,
//     button: 0
//   }));
// };

document.body.addEventListener('click', () => console.log('clicked'))

const evt = new MouseEvent("click", {
  view: window,
  bubbles: true,
  cancelable: true,
  clientX: 20,
});


var mannualDelay = 0;
// var box = mouseCursor.getBoundingClientRect(),
//         coordX = box.left + (box.right - box.left) / 2,
//         coordY = box.top + (box.bottom - box.top) / 2;

function cursor(){
    // console.log(handPos.x, handPos.y)
    mouseCursor.style.left = Math.round((handPos.x) * 2.75) + "px";
    mouseCursor.style.top = Math.round((handPos.y) *2.75) + "px";
    if(mannualDelay===10){
        simulateMouseEvent (mouseCursor, "mousedown",  Math.round((handPos.x) * 2.75),Math.round((handPos.y) *2.75));
        document.body.dispatchEvent(evt);
        console.log("handClicked")
        simulateMouseEvent (mouseCursor, "click",  Math.round((handPos.x) * 2.75),Math.round((handPos.y) *2.75));
        mannualDelay = 0;
    }else if(filteredPreds.length ===1 && filteredPreds.find(innerArray => innerArray.label === 'closed')){
        mannualDelay+=1;
    }else{    
        simulateMouseEvent (mouseCursor, "mouseup", coordX, coordY);
        mannualDelay = 0
    }

}
    // mouseCursor.style.left = handPos.x + "px";
    // mouseCursor.style.top = handPos.y +"px";
    // console.log(mouseCursor.style.top,  mouseCursor.style.left)


// simulateMouseEvent (mouseCursor, "mousedown", coordX, coordY);
// simulateMouseEvent (mouseCursor, "mouseup", coordX, coordY);

window.addEventListener("mousedown", () => {
    mouseCursor.classList.add("mouse-down")
})

window.addEventListener("mouseup", () =>{
    mouseCursor.classList.remove("mouse-down")
})