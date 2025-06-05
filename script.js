const taskForm = document.getElementById("taskForm");
const taskDetails = document.getElementById("taskDetails");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Jika form detail belum muncul, tampilkan dulu
  if (taskDetails.classList.contains("hidden")) {
    taskDetails.classList.remove("hidden");
    return;
  }

  // Ambil data dari semua input
  const taskInput = document.getElementById("taskInput");
  const taskDescription = document.getElementById("taskDescription");
  const taskStatus = document.getElementById("taskStatus");

  const taskTitle = taskInput.value.trim();
  const description = taskDescription.value.trim();
  const isCompleted = taskStatus.checked;

  if (taskTitle === "") return;

  // Buat elemen tugas
  const li = document.createElement("li");
  li.className = "bg-gray-100 dark:bg-gray-700 p-3 rounded flex flex-col space-y-1";
  li.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-semibold ${isCompleted ? "line-through text-gray-500 dark:text-gray-400" : ""}">${taskTitle}</span>
      ${isCompleted ? '<i data-lucide="check-circle" class="w-5 h-5 text-green-500"></i>' : ""}
    </div>
    ${description ? `<p class="text-sm text-gray-600 dark:text-gray-300">${description}</p>` : ""}
  `;

  taskList.appendChild(li);
  lucide.createIcons();

  // Reset form
  taskInput.value = "";
  taskDescription.value = "";
  taskStatus.checked = false;
  taskDetails.classList.add("hidden");
});
