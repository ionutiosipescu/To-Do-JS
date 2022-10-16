class Task {
  id = (Date.now() + "").slice(-10);
  constructor(status, text) {
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

class App {
  tasks = [];
  constructor() {
    // this.reset();
    // Get data and render from localStorage

    this._getLocalStorage();
    // Submit new task
    form.addEventListener("submit", this._newTask.bind(this));
    ulTasks.addEventListener("click", this._removeTask.bind(this));
    // btnRemove.addEventListener("click", this._removeTask.bind(this));
  }
  _newTask(e) {
    // get task variables
    const text = input.value;
    const status = "undone";
    let task;
    // prevent default
    e.preventDefault();
    // Create new object
    task = new Task(status, text);
    // add object to arr
    this.tasks.push(task);
    // clear fields
    input.value = "";

    // render task
    this._renderTask(task);
    // add to LocalStorage
    this._setLocalStorage();
    console.log(task);
  }
  _renderTask(task) {
    let html = `
      <li class="task-item">
      <span class="task-info"
        ><span class="text">${task.text}</span
        ><span class="date">${task.date}</span></span
      ><span class="task-btn">
        <button class="btn btn-complete">Done</button>
        <button class="btn btn-remove">Remove</button>
      </span>
    </li>
      `;
    ulTasks.innerHTML += html;
  }

  _setLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));

    if (!data) return;

    this.tasks = data;

    this.tasks.forEach((task) => {
      this._renderTask(task);
    });
    // const btnRemove = document.querySelectorAll(".btn-remove");
    // this._removeTask(btnRemove);
  }
  _removeTask(e) {
    const arrOfTasks = this.tasks;
    const btn = e.target.closest(".btn-remove");
    const index = arrOfTasks.findIndex((task) => task);
    console.log(btn);
  }
  reset() {
    localStorage.removeItem("tasks");
  }
}

const app = new App();
