/**
 * blocks youtube page from displaying or interaction.
 * Doesn't need to be fort knox, just enough to get me to think
 */

// TODO: only block the video element if possible
// or replace graphic on screen. Do more than blank it

// TODO: start countdown to midnight once blocker has activated

// use storage.onChanged to detect block status
browser.storage.local.onChanged.addListener(checkStatus);


async function checkStatus() {
    let blockStatus = await browser.storage.local.get("blocked")
    if (blockStatus.blocked == true) {
        console.log("[Blocker.js] Blocking tab")
        block();
    }
    else {
        console.log("Not Blocked",);
        unblock();
    }
}

function block() {
    let video = document.querySelector("#movie_player video");
    video.pause();
    document.body.style.display = "none";
}

function unblock() {
    document.body.style.display = "block";
}

function onSetError(error) {
    console.log(error);
}
