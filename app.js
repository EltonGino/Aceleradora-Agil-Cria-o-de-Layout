// Trazer as atividade ao carregar a janela
window.onload = loadTasks;

// Subimeter a atividade no formulario
document.querySelector(".app form").addEventListener("submit", function(e) {
  e.preventDefault();
  addTask(1);
});

document.querySelector(".app2 form").addEventListener("submit", function(e) {
  e.preventDefault();
  addTask(2);
});

// Salvar atividade no localStorage antes dá pagina ser descarregada
window.addEventListener("beforeunload", saveTasks);

function loadTasks() {
  for (let i = 1; i <= 2; i++) {
    let tasks = JSON.parse(localStorage.getItem(`tasks${i}`)) || [];
    const list = document.querySelector(`#taskList${i}`);

    // Limpar o display
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    tasks.forEach(task => {
      const li = createTaskElement(task);
      list.appendChild(li);
    });
  }
}

function addTask(appNumber) {
  const taskInput = document.querySelector(`#taskInput${appNumber}`);
  const taskList = document.querySelector(`#taskList${appNumber}`);
  const tasks = JSON.parse(localStorage.getItem(`tasks${appNumber}`)) || [];

  if (taskInput.value.trim() === "") {
    alert("Por favor, adicione uma atividade");
    return;
  }

  if (tasks.some(task => task.task === taskInput.value)) {
    alert("Essa atividade já existe!");
    return;
  }

  const newTask = {
    id: Date.now(),
    task: taskInput.value,
    completed: false
  };

  tasks.push(newTask);
  localStorage.setItem(`tasks${appNumber}`, JSON.stringify(tasks));

  const li = createTaskElement(newTask);
  taskList.appendChild(li);

  taskInput.value = "";
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
    <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
    <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  li.setAttribute("data-task-id", task.id);

  return li;
}

function taskComplete(checkbox) {
  const appNumber = checkbox.closest(".app").classList.contains("app") ? 1 : 2;
  const taskInput = checkbox.nextElementSibling;
  const taskId = taskInput.parentNode.getAttribute("data-task-id");
  let tasks = JSON.parse(localStorage.getItem(`tasks${appNumber}`));

  tasks.forEach(task => {
    if (task.id == taskId) {
      task.completed = !task.completed;
    }
  });

  localStorage.setItem(`tasks${appNumber}`, JSON.stringify(tasks));
  taskInput.classList.toggle("completed");

  // Remover a linha ao apertar no checkbox
  if (checkbox.checked) {
    taskInput.classList.add("line-through");
  } else {
    taskInput.classList.remove("line-through");
  }
}

function removeTask(icon) {
  const appNumber = icon.closest(".app, .app2").classList.contains("app") ? 1 : 2;
  const li = icon.parentNode;
  const taskId = li.getAttribute("data-task-id");
  let tasks = JSON.parse(localStorage.getItem(`tasks${appNumber}`));

  tasks = tasks.filter(task => task.id != taskId);

  localStorage.setItem(`tasks${appNumber}`, JSON.stringify(tasks));
  li.remove();
}

function getCurrentTask(input) {
  currentTask = input.value;
}

function editTask(input) {
  const appNumber = input.closest(".app").classList.contains("app") ? 1 : 2;
  const taskId = input.parentNode.getAttribute("data-task-id");
  let tasks = JSON.parse(localStorage.getItem(`tasks${appNumber}`));

  if (input.value.trim() === "") {
    alert("Task is empty!");
    input.value = currentTask;
    return;
  }

  if (tasks.some(task => task.task === input.value && task.id != taskId)) {
    alert("Task already exists!");
    input.value = currentTask;
    return;
  }

  tasks.forEach(task => {
    if (task.id == taskId) {
      task.task = input.value;
    }
  });

  localStorage.setItem(`tasks${appNumber}`, JSON.stringify(tasks));
}

function saveTasks() {
  for (let i = 1; i <= 2; i++) {
    const taskList = document.querySelector(`#taskList${i}`);
    const tasks = Array.from(taskList.children).map(li => {
      return {
        id: li.getAttribute("data-task-id"),
        task: li.querySelector(".task").value,
        completed: li.querySelector(".check").checked
      };
    });
    localStorage.setItem(`tasks${i}`, JSON.stringify(tasks));
  }
}
