// TODO
// Funciton may run slow, limit JSON parse to the first time the countdown starts
// and limit stringify to run and save when the countdown pauses or continues.

/**
 * TODO: use the timestamp to calculate time,
 * not the inteval(could vary slightly depending on CPU)
 */

// set default timer in minutes allow user to change
var minutes = 180;

// milliseconds per minute
const milliseconds = 60000;

// frequency the script updates at in ms
const timeInterval = 5000;

// create clock for countdown
var clock = (minutes * milliseconds);

// create clock object with time remaining and timestamp from when object last reset.
var day = new Date();
var clockInfo = {clock:clock, timestamp:day.getDate()};

// create var for interval to save and call Id from
var intervalId = null;


// save clockInfo to local storage if not saved already
if (! localStorage.getItem("clockInfo")) {
    localStorage.setItem("clockInfo", JSON.stringify(clockInfo));
};


function countdown() {
    let counter = JSON.parse(localStorage.getItem("clockInfo"));
    counter.clock = counter.clock - timeInterval;
    
    // Update localstorage info
    localStorage.setItem("clockInfo", JSON.stringify(counter));

    if (counter.clock <= 0 ) {
        console.log("BOOM!");
        clearInterval(intervalId);
        intervalId = null;
    }
    else {
        console.log("Time remaining: ", counter.clock);
    }
}


// pauses the timer and sets intervalId to null.
function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Timer Paused");
}

// Start timer
function startTimer() {
    // check that another timer isn't already running
    if (intervalId === null) {
        /**
         * the setInterval function does not work with CSP evals because it can execute strings.
         * Because of this, the countdown must be called inside an inline function. 
         */
        intervalId = setInterval(function () {
            countdown(timeInterval);
            console.log(JSON.parse(localStorage.getItem("clockInfo")));
        },timeInterval);
    }
    else{
        countdown(timeInterval);
        console.log(JSON.parse(localStorage.getItem("clockInfo")));
    }
};


// handle message
function handleMessage(request, sender, sendResponse) {
    // check if current tab is active and playing
    let currentTab = browser.tabs.query({ active: true, currentWindow: true});
    let senderTab = sender.tab;
    console.log("CurrentTab:",currentTab);
    console.log("senderTab: ", senderTab);

    console.log(`Message.js sent a message: ${request.status}`)
    // if page is visible and actively playing, start counter, otherwise try once again.
    // && currentTab[0].id === senderTab.id
    if (request.status === "visible") {
        console.log("[timer.js] Starting Timer");
        sendResponse({ response: "timer is starting"});
        startTimer();
    }
    if (request.status === "invisible") {
        console.log("[timer.js] Pausing Timer.");
        sendResponse( { response: "pausing timer"});
        pauseTimer();
    }
};

// listen for content script message
browser.runtime.onMessage.addListener(handleMessage);
