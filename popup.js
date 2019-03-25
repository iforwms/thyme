function getTime(date) {
    return `${date.getHours()}:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
}

function getDuration(date) {
    const ms = new Date() - date;
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);

    return `${hrs < 10 ? "0" + hrs : hrs}:${mins < 10 ? "0" + mins : mins}`;
}

window.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "FETCH_STATE" }, ({ status, res }) => {
        if (status !== 200) {
            return alert("Failed to fetch data. " + JSON.stringify(res));
        }

        const response = JSON.parse(res);

        if (response.timer_running) {
            const date = new Date(response.data.start * 1000);
            document.getElementById("running").innerHTML = `
            <div style="display: flex; margin-bottom: 1em;">
                <div style="flex: 1;">
                    <h2 style="margin-bottom: .5em;">${response.data.project_name}</h2>
                    <h3 style="margin-bottom: .5em;">(${response.data.client_name})</h3>
                    <h3 style="color: #aaa;">${response.data.task_name}</h3>
                </div>
                <div style="margin-top: auto;">
                    <div style="color: #777; font-size: 2em; text-align: right;">
                        ${getDuration(date)}
                    </div>
                    <div style="color: #aaa; font-size: 1em;">
                        Started at ${getTime(date)}
                    </div>
                </div>
            </div>
            <div class="button-container">
                <button id="cancel" class="btn btn-primary" data-id="${
                    response.data.stint_id
                }">Stop Timer</button>
            </div>
            `;

            document.getElementById("cancel").addEventListener("click", () => {
                const that = this;
                chrome.runtime.sendMessage(
                    {
                        action: "STOP_TIMER",
                        payload: {
                            stint_id: document.getElementById("cancel").dataset.id
                        }
                    },
                    res => {
                        if (res) {
                            window.close();
                        } else {
                            alert("Failed to stop timer.");
                        }
                    }
                );
            });
            document.getElementById("thyme").classList.remove("loading");
            document.getElementById("thyme").classList.add("running");
            return;
        }

        let projectsList = document.getElementById("projects");
        let tasksList = document.getElementById("tasks");
        let start = document.getElementById("start");
        let end = document.getElementById("end");

        Object.keys(response.data.clients).map(client => {
            const optGroup = document.createElement("optgroup");
            optGroup.label = client;
            response.data.clients[client].map(project => {
                optGroup.innerHTML += `<option value=${project.id}>${
                    project.project_name
                }</option>`;
            });
            projectsList.appendChild(optGroup);
        });

        projectsList.addEventListener("change", e => {
            const tasks = response.data.tasks.filter(
                task => parseInt(task.project_id, 10) === parseInt(e.target.value, 10)
            );
            tasksList.innerText = null;
            tasks.map(task => {
                tasksList.add(new Option(task.task_name, task.id));
            });
            tasksList.add(new Option("New Task", "NEW_TASK"));
        });

        const newTaskContainer = document.getElementById("new-task-container");

        tasksList.addEventListener("change", e => {
            if (e.target.value === "NEW_TASK") {
                newTaskContainer.classList.toggle("hidden");
            }
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
            {
                action: "START_TIMER",
                payload: {
                    task_id: task.value,
                    start: start.value,
                    end: end.value,
                    notes: document.getElementById("notes").value,
                    project_id: document.getElementById("projects").value,
                    new_task: document.getElementById("new-task").value
                }
            },
            res => {
                if (res) {
                    window.close();
                } else {
                    alert("Failed to start timer.");
                }
            }
        );
    });
});
