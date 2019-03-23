chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("token", data => {
        if (!data || !data.token) {
            return alert("Please go to the options page to set your personal access token.");
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const xhr = new XMLHttpRequest();
        if (request.action === "FETCH_STATE") {
            xhr.open("GET", "http://thyme.test/api/extension", true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        sendResponse(xhr.responseText);
                    } else {
                        sendResponse(null);
                    }
                }
            };
            xhr.send();
        }

        if (request.action === "START_TIMER") {
            xhr.open("POST", "http://thyme.test/api/stints", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        sendResponse(true);
                    } else {
                        sendResponse(false);
                    }
                }
            };
            xhr.send(JSON.stringify(request.payload));
        }

        return true;
    });
});
