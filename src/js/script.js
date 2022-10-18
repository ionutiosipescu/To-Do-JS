// Task Object
class Task {
  id = (Date.now() + "").slice(-10);

  constructor(status = "undone", text) {
    this.status = status;
    this.text = text;
    this._setDate();
  }
  _setDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    this.date = `${month}/${day}/${year}`;
  }
}

// APPLICATION ARCHITECTURE
const form = document.querySelector(".form");
const input = document.querySelector(".form_field");
const btn = document.querySelector(".btn");
const btnSubmit = document.querySelector(".btn-submit");
const ulTasks = document.querySelector(".task-group");
const liItem = document.querySelector(".task-item");
const btnRemove = document.querySelectorAll(".btn-remove");
const dropdown = document.querySelector(".dropdown");
const errorMessage = document.querySelector(".error-message");

class App {
  tasks = [];
  constructor() {
    // this.reset();

    // Get data from localStorage and render tasks
    this._getLocalStorage();

    // Event Handlers
    form.addEventListener("submit", this._newTask.bind(this));
    ulTasks.addEventListener("click", this._removeTask.bind(this));
    ulTasks.addEventListener("click", this._changeStatus.bind(this));
    dropdown.addEventListener("click", this._filterTodo.bind(this));
  }
  // CREATE TASK
  _newTask(e) {
    // get task variables
    const text = input.value;
    let task;

    e.preventDefault();

    // Show or hide error message
    if (text === "" || text.length > 40) {
      input.style.border = "3px solid red";
      errorMessage.classList.remove("hidden");
      return;
    } else {
      errorMessage.classList.add("hidden");

      input.style.border = "";
      // Create new object
      task = new Task(undefined, text);
      // add object to arr
      this.tasks.push(task);
      // clear fields
      input.value = "";

      // render task
      this._renderTask(task);
      // add to LocalStorage
      this._setLocalStorage();
    }
  }
  // RENDER TASK
  _renderTask(task) {
    // ternary variables

    // prettier-ignore
    let markupStatusItem = `${ task.status === "complete" ? "task-complete" : ""}`;
    let markupTextBtn = `${task.status === "complete" ? "Undone" : "Done"}`;
    // prettier-ignore
    let markupClassBtn = `${task.status === "complete" ? "btn-uncomplete" : "btn-complete"}`;

    // Markup for Task
    let html = `
      <li class="task-item animate__animated animate__fadeInDown ${markupStatusItem}" data-id="${task.id}">
      <span class="task-info"
        ><span class="text">${task.text}</span
        ><span class="date">${task.date}</span></span
      ><span class="task-btn">
        <button class="btn btn-mark ${markupClassBtn}">${markupTextBtn}</button>
        <button class="btn btn-remove">Remove</button>
      </span>
    </li>
      `;
    // Add html to <ul>
    ulTasks.insertAdjacentHTML("afterbegin", html);
  }
  // SEND DATA TO LOCAL STORAGE
  _setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  // GET DATA FROM LOCAL STORAGE AND RENDER EACH TASK
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));

    if (!data) return;

    this.tasks = data;

    this.tasks.forEach((task) => {
      this._renderTask(task);
    });
  }
  // REMOVE TASK
  _removeTask(e) {
    const btn = e.target.closest(".btn-remove");
    // Guard Close
    if (!btn) return;

    const [markedEl, arr, index] = this._checkIndex(e);

    markedEl.classList.remove("animate__fadeInDown");

    markedEl.classList.add("animate__backOutRight");
    // if index is correct run:
    if (index > -1) {
      // remove object from arr
      arr.splice(index, 1);
      // update local storage
      this._setLocalStorage();
      // remove task from dom
    }

    markedEl.addEventListener("animationend", () => {
      markedEl.remove();
    });
  }
  // CHANGE STATUS OF TASK
  _changeStatus(e) {
    // take btn
    const btn = e.target.closest(".btn-mark");
    // Guard Clouse
    if (!btn) return;

    const [markedEl, arr, index] = this._checkIndex(e);

    markedEl.classList.toggle("task-complete");

    markedEl.classList.remove("animate__fadeInDown");

    markedEl.classList.toggle("animate__pulse");

    const validate = markedEl.classList.contains("task-complete");

    this._checkValidate(validate, arr, index, btn);

    this._setLocalStorage();
  }
  // GET INDEX OF CLICKED TASK
  _checkIndex(e) {
    const markedEl = e.target.parentElement.parentElement;
    const arr = this.tasks;
    const index = arr.findIndex((el) => el.id === markedEl.dataset.id);
    return [markedEl, arr, index];
  }
  // UPDATE TASK BY VALIDATE
  _checkValidate(validate, arr, index, btn) {
    if (validate) {
      btn.textContent = "Undone";
      btn.classList.remove("btn-complete");
      btn.classList.add("btn-uncomplete");
      arr[index].status = "complete";
    } else {
      btn.textContent = "Done";
      btn.classList.remove("btn-uncomplete");
      btn.classList.add("btn-complete");
      arr[index].status = "undone";
    }
  }
  // FILTER TASKS
  _filterTodo(e) {
    const todos = ulTasks.childNodes;
    todos.forEach(function (todo) {
      if (!todo.classList) return;
      switch (e.target.value) {
        case "All":
          todo.style.display = "flex";
          break;
        case "Complete":
          if (todo.classList.contains("task-complete")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
        case "Undone":
          if (!todo.classList.contains("task-complete")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
      }
    });
  }
  // REMOVE ALL TASKS FROM LOCAL STORAGE
  reset() {
    localStorage.removeItem("tasks");
  }
}

const app = new App();
