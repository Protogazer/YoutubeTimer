/**
 * Called when youtube.com/watch* is loaded. 
 * Detects video playback state then messages timer
 */

console.log("vid_detection.js Loaded!")

// wait for page to load, then query for video element
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", queryVideo)
}
else {
    queryVideo();
}

// queries for video on page
function queryVideo() {
    console.log("finding video")
    const video = document.querySelector("video");
    if (video) {
        startListener(video);
    }
    else {
        console.log("no video found.");
    }
}

// create listener for video play event
function startListener(videoId) {
    videoId.addEventListener("play", (event) => {
        // when event is found, send message to timer
        console.log("[vid_detection.js] video playing!")
        messageTimer("playing")
    })
    videoId.addEventListener("pause", (event) => {
        console.log("[vid_detection.js] video paused.")
        messageTimer("paused")
    })
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


/** 
 * TODO: Detect when page is closed or changed, and send stop message
 * OR loop the send message function every x seconds, 
 * and the timer will decrement accordingly
 */
