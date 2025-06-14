const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const iconMoon = document.getElementById("icon-moon");
const iconSun = document.getElementById("icon-sun");
const toggleBtn = document.getElementById("toggleDark");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = localStorage.getItem("filter") || "all";
let editIndex = null;

// ===============================
// DARK MODE (localStorage support)
// ===============================

// Terapkan tema dari localStorage saat load halaman
function applyTheme() {
  const theme = localStorage.getItem("theme") || "light";

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  updateThemeIcon();
}

// Perbarui ikon sesuai tema
function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains("dark");

  if (isDark) {
    iconMoon.style.display = "none";
    iconSun.style.display = "block";
  } else {
    iconMoon.style.display = "block";
    iconSun.style.display = "none";
  }

  lucide.createIcons(); // Refresh icon
}

// Tombol toggle tema
toggleBtn.addEventListener("click", () => {
  const isDarkNow = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDarkNow ? "dark" : "light");
  updateThemeIcon();
});

lucide.createIcons();
applyTheme(); // panggil saat awal

// ===============================
// Tugas: Tambah / Edit / Simpan
// ===============================

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  if (editIndex !== null) {
    tasks[editIndex].text = taskText;
    editIndex = null;
  } else {
    tasks.push({ text: taskText, completed: false });
  }

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveFilter() {
  localStorage.setItem("filter", currentFilter);
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded";

    const leftSection = document.createElement("div");
    leftSection.className = "flex items-center gap-2 flex-1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500";
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = task.completed ? "line-through text-gray-500" : "";

    leftSection.appendChild(checkbox);
    leftSection.appendChild(span);

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex gap-2";

    const editBtn = document.createElement("button");
    editBtn.className = "text-blue-600 hover:text-blue-800";
    editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
    editBtn.addEventListener("click", () => {
      taskInput.value = task.text;
      editIndex = tasks.indexOf(task);
      taskInput.focus();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "text-red-600 hover:text-red-800";
    deleteBtn.innerHTML = `<i data-lucide="trash"></i>`;
    deleteBtn.addEventListener("click", () => {
      const taskIndex = tasks.indexOf(task);
      tasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks();
    });

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(leftSection);
    li.appendChild(btnGroup);
    taskList.appendChild(li);
  });

  lucide.createIcons();
  updateFilterUI();
}

// ===============================
// Filter
// ===============================

function updateFilterUI() {
  document.querySelectorAll("[id^='filter']").forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");
    btn.classList.remove("bg-blue-100", "dark:bg-blue-700", "text-blue-800", "font-semibold", "ring");
    btn.classList.add("bg-gray-200", "dark:bg-gray-600", "text-gray-800", "dark:text-white");
  });

  const activeBtn = document.getElementById(`filter${capitalize(currentFilter)}`);
  if (activeBtn) {
    activeBtn.setAttribute("aria-pressed", "true");
    activeBtn.classList.remove("bg-gray-200", "dark:bg-gray-600", "text-gray-800");
    activeBtn.classList.add("bg-blue-100", "dark:bg-blue-700", "text-blue-800", "dark:text-white", "font-semibold", "ring", "ring-blue-400");
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

document.getElementById("filterAll").addEventListener("click", () => {
  currentFilter = "all";
  saveFilter();
  renderTasks();
});

document.getElementById("filterPending").addEventListener("click", () => {
  currentFilter = "pending";
  saveFilter();
  renderTasks();
});

document.getElementById("filterCompleted").addEventListener("click", () => {
  currentFilter = "completed";
  saveFilter();
  renderTasks();
});

// ===============================
// Inisialisasi Awal
// ===============================

renderTasks();
