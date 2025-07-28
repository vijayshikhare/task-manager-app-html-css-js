document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const categoryInput = document.getElementById("category");
    const deadlineInput = document.getElementById("deadline");
    const priorityInput = document.getElementById("priority");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Check if elements exist before adding event listeners
    if (!taskInput || !categoryInput || !deadlineInput || !priorityInput || !addTaskButton || !taskList) {
        console.error("One or more required elements are missing.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        let completedCount = 0;
        let highPriorityCount = 0;

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            if (task.completed) li.classList.add("completed");

            li.innerHTML = `
                <span><strong>${task.name}</strong> (${task.category}) - Due: ${task.deadline} - 
                    <span class="priority ${task.priority}">${task.priority}</span>
                </span>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Mark task as completed
            li.querySelector(".complete-btn").addEventListener("click", () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            // Delete task
            li.querySelector(".delete-btn").addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);

            if (task.completed) completedCount++;
            if (task.priority === "high") highPriorityCount++;
        });

        // Update UI safely
        updateTaskCounters(completedCount, highPriorityCount);
    }

    function updateTaskCounters(completedCount, highPriorityCount) {
        if (document.getElementById("totalTasks")) {
            document.getElementById("totalTasks").textContent = tasks.length;
        }
        if (document.getElementById("completedTasks")) {
            document.getElementById("completedTasks").textContent = completedCount;
        }
        if (document.getElementById("tasksCompleted")) {
            document.getElementById("tasksCompleted").textContent = completedCount;
        }
        if (document.getElementById("tasksPending")) {
            document.getElementById("tasksPending").textContent = tasks.length - completedCount;
        }
        if (document.getElementById("highPriorityTasks")) {
            document.getElementById("highPriorityTasks").textContent = highPriorityCount;
        }
    }

    addTaskButton.addEventListener("click", () => {
        const taskName = taskInput.value.trim();
        const category = categoryInput.value.trim();
        const deadline = deadlineInput.value;
        const priority = priorityInput.value;

        if (!taskName || !category || !deadline) {
            alert("Please fill out all fields before adding a task.");
            return;
        }

        const newTask = {
            name: taskName,
            category: category,
            deadline: deadline,
            priority: priority,
            completed: false,
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        taskInput.value = "";
        categoryInput.value = "";
        deadlineInput.value = "";
        priorityInput.value = "low";
    });

    renderTasks();
});

function toggleMenu() {
    const nav = document.querySelector("nav");
    if (nav) {
        nav.classList.toggle("active");
    }
}

const getStartedBtn = document.getElementById("getStarted");
if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function () {
        const tasksSection = document.getElementById("tasks");
        if (tasksSection) {
            tasksSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}
