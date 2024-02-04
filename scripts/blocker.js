/**
 * blocks youtube page from displaying or interaction.
 * Doesn't need to be fort knox, just enough to get me to think
 */

// use storage.onChanged to detect block status
function runblock() {
}
let blockStatus = browser.storage.local.get("clockInfo").then(block, onError)
console.log(blockStatus);
// if () = true) {
//     block();
// }

function block() {
    document.body.style.display = "none";
}

function unblock() {
    document.body.style.display = "block";
}

function onError(error) {
    console.log(error);
}
