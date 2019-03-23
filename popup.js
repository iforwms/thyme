window.addEventListener("DOMContentLoaded", function() {
    chrome.runtime.sendMessage({ action: "FETCH_STATE" }, function(res) {
        const response = JSON.parse(res);

        if (!response.timer_running) {
            document.getElementById("running").innerHTML = `
            <div style="display: flex; margin-bottom: 1em;">
                <div style="flex: 1;">
                    <h1>Project Name</h1>
                    <h2>(Client Name)</h2>
                    <h2>Task Name</h2>
                </div>
                <div style="margin-top: auto;">
                    <div>0:00</div>
                    <div>Started at 12:34</div>
                </div>
            </div>
            <div class="button-container">
                <button id="cancel" class="btn btn-primary">Stop Timer</button>
            </div>
            `;
            document.getElementById("thyme").classList.remove("loading");
            document.getElementById("thyme").classList.add("running");
            return;
        }

        let projectsList = document.getElementById("projects");
        let tasksList = document.getElementById("tasks");

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

        document.getElementById("submit").addEventListener("click", () => {
            alert("clicked!");
        });
    });
});
