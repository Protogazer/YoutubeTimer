// this script will run when on youtube's domain and is active tab

/**
 * TODO
 * once timer is <= 0, block further redirects from the page, and show a popup
 * allow for an extension, but require a break first
 */

// set default timer in minutes allow user to change
var minutes = 180;

// milliseconds per minute
const milliseconds = 60000;

// frequency the script updates at in ms
const interval = 5000;

var nIntervId;

// create a timer object with time remaining AND date established
var day = new Date();
var timerInfo = {timeRemaining:(minutes * milliseconds), date:day.getDate()}

// save timer to local storage along with date initiated if not set already
if (! localStorage.getItem("timerInfo")) {
    localStorage.setItem("timerInfo", JSON.stringify(timerInfo));
};


// starts the countdown
function countdown(){
    // check if an interval has been setup already
    if (nIntervId === undefined) {
        console.log("creating Interval")
        nIntervId = setInterval(decrement(interval), interval);
    }
    else {
        console.log("Timer already in progress");
    }
};


// begins decrementing from the timer, checks if timer has reached or surpassed 0.
function decrement(interval_ms) {
    console.log(localStorage.getItem("timerInfo"));
    let timer = dateChecker(localStorage.getItem("timerInfo"));

    timer.timeRemaining = timer.timeRemaining - interval_ms;
    localStorage.setItem = ("timerInfo", JSON.stringify(timer));

    console.log("Time Remaining: ", localStorage.getItem("timerInfo"));

    if (timer.timeRemaining <= 0){
        clearInterval(nIntervId)
        blockPage();
    }
}


// checks for date rollover (and resets if found) then returns the timer localStorage item
function dateChecker(timerObject) {
    let currentDate = new Date();
    var date;
    if (timerObject !== undefined) {
        var parsedObj = JSON.parse(timerObject);
        date = parsedObj.date;
    }

    if (date != currentDate.getDate()) { //this could bite me in the ass if it has been a month or more since the last date update
        console.log("It's a new day!");
        // make a new timer entry and reset the time remaining
        console.log("Time remaining: ", (minutes * milliseconds));
        let newTimerInfo = {timeRemaining:(minutes * milliseconds), date: currentDate.getDate()};
        localStorage.setItem("timerInfo", JSON.stringify(newTimerInfo));
        console.log("time local storage remaining: ", localStorage.getItem("timerInfo"))
    }

    return localStorage.getItem("timerInfo");
}

function blockPage() {
    // block the page somehow... to be determined.
    console.log("BLOCK THIS!!");
}

window.onload =  (event) => {
    console.log("countdown started");
    countdown();
};
