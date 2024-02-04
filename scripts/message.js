/* 
 * activates when a youtube watch page opens
 * then sends a message to the timer to increment by 5s.
 * This script first checks for page visibility before sending the message
 * see: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */

console.log("Message.js Loaded!")

var video = document.querySelector("video");

// document.addEventListener("DOMContentLoaded", (event) => {
    //     const triggerURL = "youtube.com/watch"; 
    //     let tabURL = document.URL;
    //     if ()
    // })
    

    // TODO:
    /**
     * detect video
     * start timer when playing
     * pause timer when paused or ended
     * 
     * No need for visibility and all that if it works!
     */

document.addEventListener("play", (event) => {
    // set play variable to true
    // checkStatus()
})


function checkStatus() {
    // if play = true AND if visible:
    // start timer

    // else, pause timer
}

// add page visibility listener
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        // if listener becomes visible, send message
        console.log("Youtube Tab is Visible");
        messageTimer("visible")
    }
    else{
        // listener is invisible, send message
        console.log("Youtube Tab is NOT visible");
        messageTimer("invisible");
    }
})


function handleResponse(response) {
    console.log("timer.js sent a response: ", response) ;
}


function handleError(error) {
    console.log(error);
}


function messageTimer(message) {
    const sending = browser.runtime.sendMessage({
        status: message,
    });
    sending.then(handleResponse, handleError)
}

// continue to loop, checking for visibility change
