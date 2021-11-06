
///// HANDTRACK VARIABLES ////////

// code from https://codepen.io/victordibia/pen/RdWbEY

// get the video and canvas and set the context for the canvas
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// find the button and the update note to display other information
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

// some other variables in the script
let isVideo = false;
let model = null;

let filteredPreds = []; // init predictions to use elsewhere in the code

var contextLineWidth = "3"
var contextStrokeStyle = "black"

///// GAME VARIABLES ///////

const gameCanvas = document.getElementById("gameCanvas");
const cxt = gameCanvas.getContext("2d");

var framesPerSecond = 24;
var frame = 1;

// midpoint on the pred as marked by the dot relative to the canvas
var handPos = {
    x: 0,
    y: 0
};

var newHand = false; // if a new hand detection is observed

var spyPos = {
    x: 0,
    y: 0
}

/*
LEVELS
1: Tutorial level
2: Level with stationary obstacles
3: Level with moving obstacles (left right up down movement)
4: Level with moving obstacles (follow? Rotate?)
*/
var level = 1; 


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

        context.lineWidth = contextLineWidth
        context.strokeStyle = contextStrokeStyle
        context.strokeRect(60, 90, 450, 290);

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
            checkHand();
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

// To render a image
function drawCustomImage(canvasCxt, imgSrc, x, y, width, height) {
    var customImage = new Image();
    customImage.src = imgSrc;
    canvasCxt.drawImage(customImage, x, y, width, height)
}

function moveEverything() {
    // update pos of spy

    // if hand pos is in detection range
    // (80, 90)(530, 350)
}

function checkHand() {
    // if theres just one hand
    if (filteredPreds.length === 1) {

        // calculate the center
        // bbox is x, y width, height
        
        handPos.x = filteredPreds[0].bbox[0] + filteredPreds[0].bbox[2] / 2
        handPos.y = filteredPreds[0].bbox[1] + filteredPreds[0].bbox[3] / 2

        console.log(handPos.x, handPos.y )


        // update that newHand detected is true
        newHand = true;
    }

}