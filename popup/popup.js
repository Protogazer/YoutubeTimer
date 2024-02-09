// code modified from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown

 /**
  * TODO
  * The countdown timer will not react to a video ending, and will contine as long as the popup is open.
  * This will only be an issue is someone never clicks off the popup to anything else on the browser.
  * I consider this acceptable... for now.
  */

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("doc loaded, displaying time")
    let checking = checkStorage("clockInfo").then(displayCountdown, onError)
})

function displayCountdown(clockInfo) {
    // Set the date we're counting down to
    var timeRemaining = new Date().getTime()  + clockInfo.clock;

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
    } else {
        // calculate the distance to the countdown, only once since the timer is not running
        var staticDistance = timeRemaining - new Date().getTime();

        // Time calculations for hours, minutes and seconds
        var hours = Math.floor((staticDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((staticDistance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((staticDistance % (1000 * 60)) / 1000);

        document.getElementById("timerDisplay").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

        // If the count down is over, write some text 
        if (staticDistance <= 0) {
            clearInterval(x);
            document.getElementById("timerDisplay").innerHTML = "Timer Ended";
        }
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
