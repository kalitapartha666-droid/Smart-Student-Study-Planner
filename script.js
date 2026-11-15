
const taskForm = document.getElementById("taskForm");

const taskName = document.getElementById("taskName");
const subject = document.getElementById("subject");
const deadline = document.getElementById("deadline");

const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty">No tasks added yet. Start planning!</p>';
    }

    tasks.forEach((task) => {
        const taskElement = document.createElement("div");

        taskElement.className = "task-item";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.name;

        const subjectText = document.createElement("p");
        subjectText.textContent = "Subject: " + task.subject;

        const deadlineText = document.createElement("p");
        deadlineText.textContent = "Deadline: " + task.deadline;

        info.append(title, subjectText, deadlineText);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent =
            task.completed ? "Completed ✓" : "Mark Complete";

        completeButton.disabled = task.completed;

        completeButton.addEventListener("click", () => {
            task.completed = true;
            saveTasks();
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        actions.append(completeButton, deleteButton);

        taskElement.append(info, actions);

        taskList.appendChild(taskElement);
    });

    updateStatistics();
}

function updateStatistics() {
    const total = tasks.length;

    const completed = tasks.filter(
        (task) => task.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent =
        completed;

    document.getElementById("pendingTasks").textContent = pending;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressFill").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        percentage + "% Completed";
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const task = {
        id: Date.now(),
        name: taskName.value.trim(),
        subject: subject.value.trim(),
        deadline: deadline.value,
        completed: false
    };

    if (!task.name || !task.subject || !task.deadline) {
        alert("Please fill in all fields.");
        return;
    }

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskForm.reset();
});

displayTasks();
