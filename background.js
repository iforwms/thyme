chrome.runtime.onInstalled.addListener(() => {
    let token = null;

    chrome.storage.sync.get("token", data => {
        if (!data || !data.token) {
            return alert("Please go to the options page to set your personal access token.");
        }

        token = data.token;
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const xhr = new XMLHttpRequest();
        if (request.action === "FETCH_STATE") {
            xhr.open("GET", "http://thyme.test/api/extension", true);
            xhr.setRequestHeader("X-PAT", token);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        sendResponse({ status: xhr.status, res: xhr.responseText });
                    } else {
                        sendResponse({ status: xhr.status, res: xhr.responseText });
                    }
                }
            };
            xhr.send();
        }

        if (request.action === "START_TIMER") {
            xhr.open("POST", "http://thyme.test/api/stints", true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("X-PAT", token);
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

        if (request.action === "STOP_TIMER") {
            xhr.open(
                "PATCH",
                `http://thyme.test/api/stints/${request.payload.stint_id}/stop`,
                true
            );
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("X-PAT", token);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        sendResponse(true);
                    } else {
                        sendResponse(false);
                    }
                }
            };
            xhr.send();
        }

        return true;
    });
});
