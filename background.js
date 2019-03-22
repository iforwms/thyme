chrome.runtime.onInstalled.addListener(function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jsonplaceholder.typicode.com/users", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            localStorage.setItem("THYME_INIT", xhr.responseText);
            console.log("%cres", "color: #3490dc; font-weight: bold", xhr.responseText);
        }
    };
    xhr.send();

    chrome.runtime.onMessage.addListener(function(msg) {
        console.log("message recieved from popup.js:" + msg);
    });

    // chrome.runtime.sendMessage({
    //     msg: "something_completed",
    //     data: {
    //         subject: "Loading",
    //         content: "Just completed!"
    //     }
    // });
});
