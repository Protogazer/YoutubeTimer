/**
 * Listens for messages from content script when video is played and paused.
 * Initializes and maintains countdown timer that persists across sessions.
 * Timer is reset every day at midnight, and records the date (dd only) to storage.
 */

// TODO detect navigation change or tab closure and stop timer appropriately

console.log("YouTimer Loaded")

// set default timer in minutes allow user to change
var minutes = 5;

// milliseconds per minute
const milliseconds = 60000;

// frequency the script updates at in ms (default 1 second)
const timeInterval = 1000;

// create clock for countdown
var clock = (minutes * milliseconds);

// get tomorrow's date at midnight in ms
var tomorrow = new Date();
tomorrow.setHours(24,0,0,0);

// create clock object with time remaining, timestamp from when object last reset, and running status of timer
var initialClockInfo = {clock:clock, timestamp:Date.now(), running:false, defaultMin:clock};
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
    else {
        console.log("Clock info already exsists.")
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
        clockInfo.running = false;
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
    checkStorage("clockInfo").then(timer => {
        timer.running = false;
        browser.storage.local.set({"clockInfo":timer});
    })
    console.log("Timer Paused");
}


// TODO
function resetTimer(clockInfo) {
    console.log("RESET TIMER NOT FULLY IMPLEMENTED");
    if (!clockInfo) {
        console.log("Getting clockInfo");
        checkStorage("clockInfo").then(timer => {
            timer.clock = timer.defaultMin;
            console.log("Timer:", timer)
            browser.storage.local.set({"clockInfo": timer});
            browser.storage.local.set({"blocked": false});
            console.log("Timer has been reset")
        })
    }
    else {
        clockInfo.clock = clockInfo.defaultMin;
        clockInfo.timestamp = Date.now(); // Leaving this in for now, may remove if problematic for other resetting
        browser.storage.local.set({"clockInfo": clockInfo});
        browser.storage.local.set({"blocked": false});
        console.log("Timer has been reset");
    }

}


// gets date and time, resetting vars for tomorrow and day
function reinitializeDate() {
    let newDay = new Date();
    tomorrow = newDay.setHours(24,0,0,0);
}


// Start timer
function startTimer(clockInfo) {
    clockInfo.timestamp = Date.now();
    clockInfo.running = true;
    console.log("[startTimer Function] Clock time updated", clockInfo)

    // if date rolls over, reset timer and tomorrow's date
    if (clockInfo.timestamp >= tomorrow) {
        console.log("New day, resetting timer");
        reinitializeDate();
        resetTimer(clockInfo);
    }   
    // check timer is not <= 0 
    else if (clockInfo.clock <= 0) {
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
                resetTimer();
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
    console.log(sender);

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
    else if (request.status === "reset") {
        console.log("[timer.js] Resetting timer")
        sendResponse ( { response: "resetting timer"});
        resetTimer();
    }
};

// listen for content script message
browser.runtime.onMessage.addListener(handleMessage);





function handleRemovedTab(tabId, removeInfo) {
    console.log(`Tab: ${tabId} is closing`);
    console.log(`Window: ${removeInfo.windowId}`);
}

function handleChangedTab(tabId, changeInfo) {
    console.log(`Tab: ${tabId} changed`)
    console.log(changeInfo);
}


// TODO If tab is closed or changed, ping the vid detection script for that tab, and get the video status
// if there is no response, or an error, pause the timer, otherwise run timer accordingly
browser.tabs.onRemoved.addListener(handleRemovedTab);



// TODO send a message to vid_detection.js asking for video status. If no response in x time, pause timer.
browser.tabs.onUpdated.addListener(handleChangedTab, {
    urls: ["*://*.youtube.com/*"],
    properties: ["title"]
    // tabId: tabId from message
});