window.addEventListener("DOMContentLoaded", () => {
    let accessTokenBtn = document.getElementById("access-token-submit");
    let accessToken = document.getElementById("access-token");

    chrome.storage.sync.get("token", data => {
        if (data && data.token) {
            accessToken.value = data.token;
        }
    });

    accessTokenBtn.addEventListener("click", () => {
        chrome.storage.sync.set({ token: accessToken.value }, () => {
            alert("Token saved!");
        });
    });
});
