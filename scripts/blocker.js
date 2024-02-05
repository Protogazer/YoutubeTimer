/**
 * blocks youtube page from displaying or interaction.
 * Doesn't need to be fort knox, just enough to get me to think
 */

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
    let video = document.querySelector("video");
    video.pause();
    document.body.style.display = "none";
}

function unblock() {
    document.body.style.display = "block";
}

function onSetError(error) {
    console.log(error);
}
