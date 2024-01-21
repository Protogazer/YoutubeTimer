var clock = 60000;
var timeInterval = 5000; // 5 seconds

function countdown(timeInterval) {
    clock = clock - timeInterval;
    if (clock <= 0 ) {
        console.log("BOOM!");
        clearInterval(intervalId);
    }
    else {
        console.log("Time remaining: ", clock);
    }
}

// the setInterval function does not work with CSP evals because it can execute strings
// because of this, the countdown must be called inside an inline function.
let intervalId = setInterval(function () {
    countdown(timeInterval);
},timeInterval);
