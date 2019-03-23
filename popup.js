window.addEventListener("DOMContentLoaded", function() {
    chrome.runtime.sendMessage({ action: "FETCH_STATE" }, function(res) {
        const response = JSON.parse(res);

        if (response.timer_running) {
            document.getElementById("running").innerHTML = `
            <div style="display: flex; margin-bottom: 1em;">
                <div style="flex: 1;">
                    <h2 style="margin-bottom: .5em;">Project Name</h2>
                    <h3 style="margin-bottom: .5em;">(Client Name)</h3>
                    <h3 style="color: #aaa;">Task Name</h3>
                </div>
                <div style="margin-top: auto;">
                    <div style="color: #777; font-size: 2em; text-align: right;">0:00</div>
                    <div style="color: #aaa; font-size: 1em;">Started at 12:34</div>
                </div>
            </div>
            <div class="button-container">
                <button id="cancel" class="btn btn-primary">Stop Timer</button>
            </div>
            `;

            document
                .getElementById("cancel")
                .addEventListener("click", () => alert("timer stopped!"));
            document.getElementById("thyme").classList.remove("loading");
            document.getElementById("thyme").classList.add("running");
            return;
        }

        let projectsList = document.getElementById("projects");
        let tasksList = document.getElementById("tasks");
        let start = document.getElementById("start");
        let end = document.getElementById("end");

        response.data.map(project => {
            projectsList.add(new Option(project.project_name, project.id));
        });

        projectsList.addEventListener("change", e => {
            const tasks = response.data.filter(
                project => parseInt(project.id, 10) === parseInt(e.target.value, 10)
            )[0].tasks;
            tasksList.innerText = null;
            tasks.map(task => {
                tasksList.add(new Option(task.task_name, task.id));
            });
        });

        document.getElementById("thyme").classList.remove("loading");
    });

    document.getElementById("submit").addEventListener("click", () => {
        const tasksList = document.getElementById("tasks");
        const task = tasksList.options[tasksList.selectedIndex];
        if (!task) {
            return alert("Select a task!");
        }

        chrome.runtime.sendMessage(
            { action: "START_TIMER", task_id: task.value, start: start.value, end: end.value },
            function(res) {
                alert(JSON.stringify(res));
            }
        );
    });
});
