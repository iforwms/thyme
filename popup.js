chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg === "something_completed") {
        //  To do something
        console.log(request.data.subject);
        console.log(request.data.content);
    }
});

window.addEventListener("DOMContentLoaded", function() {
    const res = JSON.parse(localStorage.getItem("THYME_INIT"));
    let list = document.getElementById("users");
    // let options = res.map(user => ({ id: user.id, name: user.name }));
    res.forEach(user => {
        list.add(new Option(user.name, user.id));
    });

    // document.getElementById("JSON").innerText = options;
    //
    //     chrome.runtime.sendMessage({
    //         msg: "something_completed",
    //         data: {
    //             subject: "Loading",
    //             content: "Just completed!"
    //         }
    //     });
});
