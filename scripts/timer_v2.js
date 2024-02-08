/**
 * Listens for messages from content script when video is played and paused.
 * Initializes and maintains countdown timer that persists across sessions.
 * Timer is reset every day at midnight, and records the date (dd only) to storage.
 */

console.log("YouTimer Loaded")

// set default timer in minutes allow user to change
var minutes = 1;

// milliseconds per minute
const milliseconds = 60000;

// frequency the script updates at in ms
const timeInterval = 5000;

// create clock for countdown
var clock = (minutes * milliseconds);

// get tomorrow's date at midnight in ms
var tomorrow = new Date();
tomorrow.setHours(24,0,0,0);

// create clock object with time remaining and timestamp from when object last reset.
var initialClockInfo = {clock:clock, timestamp:Date.now()};
console.log("Initializing Clock:", initialClockInfo)

// create var for interval to save and call Id from
var intervalId = null;


// check for "storageKey" in local storage. Return object if found, null otherwise
async function checkStorage(storageKey) {
    let gettingItem = await browser.storage.local.get(storageKey);

    if (gettingItem[storageKey]) {
        console.log("Found entry in storage:", gettingItem[storageKey]);
        return Promise.resolve(gettingItem[storageKey]);
    }
    else {
        return null;
    }
}

// initialize block message to false
browser.storage.local.set({"blocked": false});

// check for a clockInfo entry, if none is found, make one
checkStorage("clockInfo").then(returned => {
    if (!returned) {
        console.log("saving clock info");
        browser.storage.local.set({"clockInfo": initialClockInfo}).then(setStorageItem, onError);
    }
})


// promise handling
function setStorageItem() {
    console.log("OK ITEM SET", browser.storage.local.get("clockInfo"));
}

function onError(error) {
    console.log(error);
}


// decrements the counter based on current time in ms, then saves it
function countdown(clockInfo) {
    clockInfo.clock = clockInfo.clock - (Date.now() - clockInfo.timestamp);
    clockInfo.timestamp = Date.now();

    // Update localstorage info
    browser.storage.local.set({clockInfo});

    // check timer and block page if <= 0
    if (clockInfo.clock <= 0 ) {
        console.log("BOOM!");
        browser.storage.local.set({"blocked": true});
        clearInterval(intervalId);
        intervalId = null;
    }
    else {
        console.log("Time remaining: ", clockInfo.clock);
    }
}


// pauses the timer and sets intervalId to null.
function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Timer Paused");
}


// TODO
function resetTimer() {
    console.log("RESET TIMER NOT YET IMPLEMENTED");
    checkStorage("clockInfo").then(timer => {
        timer.clock = 60000;
        console.log("Timer:", timer)
        browser.storage.local.set({"clockInfo": timer});
        browser.storage.local.set({"blocked": false});
        console.log("Timer has been reset")
    })

}


// gets date and time, resetting vars for tomorrow and day
function reinitializeDate() {
    let newDay = new Date();
    tomorrow = newDay.setTime(24,0,0,0);
}


// Start timer
function startTimer(clockInfo) {
    clockInfo.timestamp = Date.now();
    console.log("[startTimer Function] Clock time updated", clockInfo)

    // check timer is not <= 0 
    if (clockInfo.clock <= 0) {
        browser.storage.local.set({"blocked": true});
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
            // if date has rolled over, reinitialize Date and reset timer
            if (clockInfo.timestamp >= tomorrow) {
                console.log("New day, resetting timer");
                reinitializeDate();
                resetTimer(clockInfo);
            }
            else {
                countdown(clockInfo);
            }
        },timeInterval);
    }
    else {
        console.log("Timer already running", clockInfo);
    }
};


// handle message
function handleMessage(request, sender, sendResponse) {
    // get sender tab info
    // let senderTab = sender.tab;
    // console.log("senderTab: ", senderTab);

    console.log(`Message.js sent a message: ${request.status}`)

    if (request.status === "playing") {
        console.log("[timer.js] Starting Timer");
        sendResponse({ response: "timer is starting"});
        let checking = checkStorage("clockInfo").then(startTimer, onError)
    }
    else if (request.status === "paused") {
        console.log("[timer.js] Pausing Timer.");
        sendResponse( { response: "pausing timer"});
        pauseTimer();
    }
};

// listen for content script message
browser.runtime.onMessage.addListener(handleMessage);
