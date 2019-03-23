chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "FETCH_STATE") {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://thyme.test/api/extension", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    sendResponse(xhr.responseText);
                }
            };
            xhr.send();
        }
        return true;
    });
});
