// code modified from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown

/**
 * TODO
 * timer doesn't reset properly while video is playing
 * 
 * The countdown timer will not react to a video ending, and will contine as long as the popup is open.
 * This will only be an issue is someone never clicks off the popup to anything else on the browser.
 * I consider this acceptable... for now.
 */

const minutesInDay = 1440;
const millisecondsPerMinute = 60000;

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("doc loaded, displaying time")
    docEventListeners();
    // startListeners();
    let checking = checkStorage("clockInfo").then(displayCountdown, onError)
})


function docEventListeners() {
    // start event listener for cog settings menu
    document.getElementById("cog").addEventListener("click", (event) => {
        let settings = document.getElementById("settingsMenu");
        if (settings.classList.contains("hidden")) {
            document.getElementById("cog").classList.add("rotate90");
            settings.classList.remove("hidden");
        }
        else {
            document.getElementById("cog").classList.remove("rotate90");
            settings.classList.add("hidden");
        }
    })

    // start event listener for minutes submit button
    document.getElementById("setMinutes").addEventListener("click", () => {
        setMinutes(document.getElementById("xMinutes"));
    })

    // start event listener for reset timer button
    document.getElementById("resetTimer").addEventListener("click", () => {
        messageTimer("reset")
        checkStorage("clockInfo").then((storageItem) => {
            setMinutes(storageItem.defaultMin / millisecondsPerMinute);
        })
    })
}


// Overwrites timer's clock attribute in milliseconds
function setMinutes(input) {
    if (typeof input === 'object') {
        input = input.valueAsNumber;
    }

    if (input > 0 && input < minutesInDay) {
        document.getElementById("minutesValueError").classList.add("hidden");

        let minutes = input * millisecondsPerMinute;
        let storageCall = checkStorage("clockInfo").then((storageItem) => {
            if (storageItem.clock) {
                storageItem.clock = minutes;
                storageItem.defaultMin = minutes;
                browser.storage.local.set({"clockInfo": storageItem});
                displayCountdown(storageItem);
            }
            else {
                console.log("[popup.js setMinutes()] ERROR: could not locate clockInfo");
            }
        })
    }
    else {
        console.log("[popup.js setMinutes()] ERROR: Minutes value must be greater than 0 and less than 1440");
        document.getElementById("minutesValueError").classList.remove("hidden");
    }
}


function displayCountdown(clockInfo) {
    // Set the date we're counting down to
    var timeRemaining = new Date().getTime()  + clockInfo.clock;

    // calculate the distance to the countdown, only once since the timer is not running
    var staticDistance = timeRemaining - new Date().getTime();

    // Time calculations for hours, minutes and seconds
    var hours = Math.floor((staticDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((staticDistance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((staticDistance % (1000 * 60)) / 1000);

    document.getElementById("timerDisplay").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

    if (clockInfo.running === true) {
        // Update the count down every 1 second
        var x = setInterval(function() {
        
            // Get today's date and time
            var now = new Date().getTime();
                
            // Find the distance between now and the count down date
            var distance = timeRemaining - now;
                
            // Time calculations for hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
            // Output the result to "timer_display" element
            document.getElementById("timerDisplay").innerHTML = hours + "h "
            + minutes + "m " + seconds + "s ";
                
            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timerDisplay").innerHTML = "Timer Ended";
            }
        }, 1000);
    } else if (staticDistance <= 0){
        // If the count down is over, write some text
        clearInterval(x);
        document.getElementById("timerDisplay").innerHTML = "Timer Ended";
    }
}

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

function onError(error) {
    console.log(error);
}


// message send and response handling
function handleResponse(response) {
    console.log("timer.js sent a response: ", response) ;
}

function handleError(error) {
    console.log("printing error", error);
}

function messageTimer(message) {
    const sending = browser.runtime.sendMessage({
        status: message,
    });
    sending.then(handleResponse, handleError)
}
