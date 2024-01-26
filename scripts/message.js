/* activates when a youtube watch page opens
 * then sends a message to the timer to increment by 5s.
 * This script first checks for page visibility before sending the message
 * see: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */

// add page visibility listener
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        // if listener becomes visible, send message
        messageTimer(visible)
    }
    else{

    }
})

function messageTimer(message) {
    const sending = browser.runtime.sendMessage({
        status: message,
    });
    sending.then(handleResponse, handleError)
}

// continue to loop, checking for visibility change
