document.addEventListener("DOMContentLoaded", function () {
    const tasksContainer = document.getElementById("tasks");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const newTaskInput = document.getElementById("newTaskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const noTasksMessage = document.getElementById("noTasksMessage");
    const themeSwitcher = document.querySelector(".theme-switcher");
    const themeButtons = themeSwitcher.querySelectorAll("button");

    // --- Theme Switching Logic ---
    const THEME_STORAGE_KEY = 'studyPlannerTheme';

    function applyTheme(themeName) {
        // Remove existing theme classes (Update this list)
        document.body.classList.remove('theme-green', 'theme-yellow', 'theme-red'); // <-- Updated list
        // Add the new theme class
        if (themeName) {
            document.body.classList.add(themeName);
        }
        // Update active button style
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === themeName) {
                btn.classList.add('active-theme');
            } else {
                btn.classList.remove('active-theme');
            }
        });

        // Store preference
        localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }

    themeSwitcher.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.theme) {
            applyTheme(event.target.dataset.theme);
        }
    });

    // Load saved theme on startup
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    // Apply saved theme OR the default class set in HTML (now theme-red)
    applyTheme(savedTheme || document.body.className.split(' ').find(cls => cls.startsWith('theme-')));
    // --- End Theme Switching Logic ---


    // --- Rest of your existing JavaScript ---
    function checkTasksDisplay() {
        const tasks = tasksContainer.querySelectorAll(".task");
        noTasksMessage.style.display = tasks.length === 0 ? "block" : "none";
    }

    function updateProgress() {
        const tasks = tasksContainer.querySelectorAll(".task");
        const totalTasks = tasks.length;
        const completedTasks = tasksContainer.querySelectorAll(".task.completed").length;
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        progressBar.value = progress;
        progressText.textContent = `${Math.round(progress)}% complete`;
        checkTasksDisplay();
    }

    function toggleTaskCompletion(event) {
        const taskElement = event.target.closest('.task');
        if (taskElement) {
            taskElement.classList.toggle("completed");
            updateProgress();
        }
    }

    function createTaskElement(taskName) {
        const taskElement = document.createElement("div");
        taskElement.className = "task";

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskName;

        const taskCheckbox = document.createElement("input");
        taskCheckbox.type = "checkbox";
        taskCheckbox.addEventListener("change", toggleTaskCompletion);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✕";
        deleteButton.className = "delete-task-btn";
        deleteButton.title = "Delete task";
        deleteButton.addEventListener('click', function() {
             taskElement.remove();
             updateProgress();
        });

        taskElement.appendChild(taskCheckbox);
        taskElement.appendChild(taskSpan);
        taskElement.appendChild(deleteButton);
        return taskElement;
    }

    function handleAddTask() {
        const taskName = newTaskInput.value.trim();
        if (taskName !== "") {
            const taskElement = createTaskElement(taskName);
            if (noTasksMessage) {
                 tasksContainer.insertBefore(taskElement, noTasksMessage);
            } else {
                 tasksContainer.appendChild(taskElement);
            }
            newTaskInput.value = "";
            updateProgress();
            newTaskInput.focus();
        } else {
            alert("Please enter a task name!");
        }
    }

    addTaskButton.addEventListener("click", handleAddTask);
    newTaskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleAddTask();
        }
    });

    updateProgress();

    const styleSheet = document.styleSheets[0];
    try {
        styleSheet.insertRule(`
            .delete-task-btn {
                background: none; border: none; color: var(--text-secondary);
                font-size: 1.2em; cursor: pointer; padding: 0 5px;
                margin-left: 10px; line-height: 1; transition: color 0.2s ease;
            }
        `, styleSheet.cssRules.length);
        styleSheet.insertRule(`
            .delete-task-btn:hover { color: #ff4d4d; }
        `, styleSheet.cssRules.length);
     } catch (e) { console.error("Could not insert delete button styles:", e); }
});