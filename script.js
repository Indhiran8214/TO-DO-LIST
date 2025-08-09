const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const themeToggle = document.getElementById("themeToggle");
const taskCounter = document.getElementById("taskCounter");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Event Listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Load Theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
}

// Functions
function addTask() {
    const taskValue = taskInput.value.trim();
    if (!taskValue) return alert("Please enter a task!");

    tasks.push({ text: taskValue, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    let pendingCount = 0;
    let completedCount = 0;

    tasks.forEach((task, index) => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed);

        if (matchesSearch && matchesFilter) {
            const li = document.createElement("li");
            li.classList.toggle("completed", task.completed);

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            `;

            li.querySelector(".task-text").addEventListener("click", () => toggleTask(index));
            li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));

            taskList.appendChild(li);
        }

        if (task.completed) completedCount++;
        else pendingCount++;
    });

    taskCounter.textContent = `Pending: ${pendingCount} | Completed: ${completedCount}`;
}

// Initial Render
renderTasks();
