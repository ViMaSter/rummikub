// prevents "drag down to refresh" behavior 
const preventScrollRefreshBehavior = (event) => {
    if (event.target == document.getElementById("playingfield")) {
        return;
    }
    if (event.target == document.getElementById("inventory")) {
        return;
    }
    if (event.target.parentNode.parentNode.parentNode == document.getElementById("inventory")) {
        return;
    }
    event.preventDefault();
};
document.addEventListener("touchmove", preventScrollRefreshBehavior, { passive: false });

// helper to allow html elements to be a drop-target
const allowDrop = (event) => {
    event.preventDefault();
};

Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
}

location.hashObject = Object.fromEntries(location.hash
    .substring(1, location.hash.length)
    .split("&")
    .map(entry => entry.split("="))
    .filter(entry => entry.length > 1)
);

window.addEventListener('error', (event) => {
    console.log(event.data, event.stack);
    alert("Fehlercode: " + event.code);
    setTimeout(() => {
        location.reload();
    }, 5000);
})