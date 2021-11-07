
//****************Memory Game implementation***********************/
// adapted from https://github.com/sandraisrael/Memory-Game-fend    
//*****************************************************************/

// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card];

// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons
const stars = document.querySelectorAll(".fa-star");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

 // stars list
 let starsList = document.querySelectorAll(".stars li");

 // close icon in modal
 let closeicon = document.querySelector(".close");

 // declare modal
 let modal = document.getElementById("popup1")

 // array for opened cards
var openedCards = [];


// @description shuffles cards
// @param {array}
// @returns shuffledarray
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// @description shuffles cards when page is refreshed / loads
document.body.onload = startGame();


// @description function to start a new play 
function startGame(){
 
    // empty the openCards array
    openedCards = [];

    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0; 
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}


// @description toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};


// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};


// @description when cards match
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// description when cards don't match
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
    },1100);
}


// @description disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// @description enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// @description count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}


// @description game timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    if (matchedCard.length == 16){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // show congratulations modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal
        closeModal();
    };
}


// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// @desciption for user to play Again 
function playAgain(){
    modal.classList.remove("show");
    startGame();
}


// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};


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
        

        console.log(Math.round((handPos.x) * 2.75),Math.round((handPos.y) *2.75))
    }
    cursor()


}

var simulateMouseEvent = function(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};


var mannualDelay = 0;
var box = mouseCursor.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;

function cursor(){
    let curx = Math.round((handPos.x) * 2.75);
    let cury = Math.round((handPos.y) *2.75);
    // console.log(handPos.x, handPos.y)
    mouseCursor.style.left = curx + "px";
    mouseCursor.style.top = cury + "px";
    if(mannualDelay===10){
        simulateMouseEvent (mouseCursor, "mousedown", curx,cury);
        console.log("handClicked")
        // if(curx<=955 && cury<=250){
        //     cards[0].click()
        // }else if(curx>955 &&  cury>=250 && cury<480){
        //     cards[1].click()
        // }
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