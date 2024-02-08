/**
 * Called when youtube.com/watch* is loaded. 
 * Detects video playback state then messages timer
 */

// wait for element to exist code: https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists

console.log("vid_detection.js Loaded!")

const videoSelector = "#movie_player video";

// check for video element, if not ready, create observer to listen for it. Return element when available.
function waitForVid() {
    return new Promise(resolve => {
        if (document.querySelector(videoSelector)) {
            return resolve(document.querySelector(videoSelector));
        }
        
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(videoSelector)) {
                observer.disconnect();
                resolve(document.querySelector(videoSelector));
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});
    });
}


waitForVid().then((vidId) => {
    console.log("Video player found!");
    startListener(vidId);
});


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
 */
