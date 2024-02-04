/**
 * Listens for messages from content script when video is played and paused.
 * Initializes and maintains countdown timer that persists across sessions.
 * Timer is reset every day at midnight, and records the date (dd only) to storage.
 */

console.log("YouTimer Loaded")

/**
 * TODO: use the timestamp to calculate time,
 * not the inteval(could vary slightly depending on CPU)
 */


// set default timer in minutes allow user to change
var minutes = 1;

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


// check for clockInfo in local storage. Create if not stored already
async function checkStorage() {
    let gettingItem = await browser.storage.local.get("clockInfo")
    if (gettingItem.clockInfo) {
        console.log("Found clock info", gettingItem);
        return;
    }
    else {
        console.log("creating clock info");
        let settingItem = browser.storage.local.set({clockInfo}).then(setItem, onError);
    }
}

checkStorage();

function setItem() {
    console.log("OK ITEM SET", browser.storage.local.get("clockInfo"));
}

function onError(error) {
    console.log("Not Good", error);
}


function countdown() {
    let counter = JSON.parse(localStorage.getItem("clockInfo"));
    counter.clock = counter.clock - timeInterval;
    
    // Update localstorage info
    localStorage.setItem("clockInfo", JSON.stringify(counter));

    // check timer and block page if <= 0
    if (counter.clock <= 0 ) {
        console.log("BOOM!");
        localStorage.setItem("blocked", true);
        clearInterval(intervalId);
        intervalId = null;
    }
    else {
        localStorage.setItem("blocked", false);
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
    // check timer is not <= 0
    if ((JSON.parse(localStorage.getItem("clockInfo"))).clock <= 0) {
        console.log("Timer has ended");

        // TODO send message to detection script to stop listening

        return;
    }

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

// TODO
// adds or removes tab from list (can be used to block [pages with this tab id])
function updateTabsList(tabId) {
    // tabsList list is added to or subtracted here
    console.log(tabId);
    tabsList.push(tabsId);
    console.log("tabsList: ", tabsList);
}


// handle message
function handleMessage(request, sender, sendResponse) {
    // get sender tab info
    // let senderTab = sender.tab;
    // console.log("senderTab: ", senderTab);

    console.log(`Message.js sent a message: ${request.status}`)

    if (request.status === "playing") {
        console.log("[timer.js] Starting Timer");
        sendResponse({ response: "timer is starting"});
        startTimer();
    }
    else if (request.status === "paused") {
        console.log("[timer.js] Pausing Timer.");
        sendResponse( { response: "pausing timer"});
        pauseTimer();
    }
};

// listen for content script message
browser.runtime.onMessage.addListener(handleMessage);
