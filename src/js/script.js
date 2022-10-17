class Task {
  id = (Date.now() + "").slice(-10);

  constructor(status = "undone", text, statusText = "Done") {
    this.status = status;
    this.text = text;
    this.statusText = statusText;
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
// const dropdown = document.querySelector(".dropdown");

var select = document.querySelector("dropdown");
var text = select.options[select.selectedIndex].text;
console.log(text);

class App {
  tasks = [];
  constructor() {
    // this.reset();
    // Get data and render from localStorage

    this._getLocalStorage();
    // Submit new task
    form.addEventListener("submit", this._newTask.bind(this));
    ulTasks.addEventListener("click", this._removeTask.bind(this));
    ulTasks.addEventListener("click", this._changeStatus.bind(this));
  }
  _newTask(e) {
    // get task variables
    const text = input.value;
    let task;
    // prevent default
    e.preventDefault();
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
    console.log(task);
  }
  _renderTask(task) {
    // prettier-ignore
    let markupStatusItem = `${ task.status === "complete" ? "task-complete" : ""}`;
    let markupTextBtn = `${task.status === "complete" ? "Undone" : "Done"}`;
    // prettier-ignore
    let markupClassBtn = `${task.status === "complete" ? "btn-uncomplete" : "btn-complete"}`;
    let html = `
      <li class="task-item ${markupStatusItem}" data-id="${task.id}">
      <span class="task-info"
        ><span class="text">${task.text}</span
        ><span class="date">${task.date}</span></span
      ><span class="task-btn">
        <button class="btn btn-mark ${markupClassBtn}">${markupTextBtn}</button>
        <button class="btn btn-remove">Remove</button>
      </span>
    </li>
      `;
    console.log(task.status);
    ulTasks.insertAdjacentHTML("afterbegin", html);
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
  }

  _removeTask(e) {
    // get removeBtn
    const btn = e.target.closest(".btn-remove");
    // Guard Close
    if (!btn) return;

    const [markedEl, arr, index] = this._checkIndex(e);

    // if index is correct run:
    if (index > -1) {
      // remove object from arr
      arr.splice(index, 1);
      // update local storage
      this._setLocalStorage();
      // remove task from dom
      markedEl.remove();
    }
  }
  _changeStatus(e) {
    // take btn
    const btn = e.target.closest(".btn-mark");
    // Guard Clouse
    if (!btn) return;

    const [markedEl, arr, index] = this._checkIndex(e);

    markedEl.classList.toggle("task-complete");
    const validate = markedEl.classList.contains("task-complete");

    this._checkValidate(validate, arr, index, btn);

    this._setLocalStorage();
  }
  _checkIndex(e) {
    const markedEl = e.target.parentElement.parentElement;
    const arr = this.tasks;
    const index = arr.findIndex((el) => el.id === markedEl.dataset.id);
    return [markedEl, arr, index];
  }
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
  reset() {
    localStorage.removeItem("tasks");
  }
}

const app = new App();
