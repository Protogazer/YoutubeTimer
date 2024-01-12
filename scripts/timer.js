// this script will run when on youtube's domain
/**
 * TODO
 * once timer is <= 0, block further redirects from the page, and show a popup
 * allow for an extension, but require a break first
 */

// set default timer in minutes allow user to change
var minutes = 180;

// milliseconds per minute
const milliseconds = 60000;

// timer decrement interval
const interval = 5000;

// setting timer for decrementation
var timeSpent = (minutes * milliseconds)


// starts the countdown
function countdown(minutes){
    // check if an interval has been setup already
    if (!nIntervId) {
        nIntervId = setInterval(decrement(interval), interval);
    }
};


// begins decrementing from the timer, checks if timer has reached or surpassed 0.
function decrement(interval_ms) {
    timeSpent = timeSpent-interval_ms;
    if (timeSpent <= 0){
        clearInterval(nIntervId)
        blockPage();
    }
}

function blockPage() {
    // block the page somehow... to be determined.
}
