//generel variables
let isEditing = false;
let isValid = false;

//inPage titles
const headTitle = document.querySelector(".headTitle");
const notStartedTitle = document.querySelector(".notStartedTitle");
const inProgressTitle = document.querySelector(".inProgressTitle");
const doneTitle = document.querySelector(".doneTitle");
const instrections = document.querySelector(".instrections");

//buttons
const logTodos = document.querySelector(".logTodos");
const showTodos = document.querySelector(".showTodos");
const hebrewButton = document.querySelector(".hebrewButton");
const englishButton = document.querySelector(".englishButton");
const homeButton = document.querySelector(".homeButton");

//mobile buttons
const notStartedButtonMobile = document.querySelector(".notStartedButtonMobile");
const inProgressButtonMobile = document.querySelector(".inProgressButtonMobile");
const doneButtonMobile = document.querySelector(".doneButtonMobile");

//display divs
const todosList = document.querySelector(".todosList");
const todosWrap = document.querySelector(".todosWrap");
const notStarted = document.querySelector(".notStarted");
const done = document.querySelector(".done");
const inProgress = document.querySelector(".inProgress");
const todosFormPage = document.querySelector(".todosFormPage");

//form elements
const todoForm = document.querySelector(".todoForm");
const addTodoSubmit = document.querySelector(".addTodoSubmit");
const editTodoSubmit = document.querySelector(".editTodoSubmit");
const formTitleInput = document.querySelector(".formTitleInput");
const formDescriptionInput = document.querySelector(".formDescriptionInput");
const formDueDateInput = document.querySelector(".formDueDateInput");
const formDueDateLabel = document.querySelector(".formDueDateLabel");
const formTitleLabel = document.querySelector(".formTitleLabel");
const formDescriptionLabel = document.querySelector(".formDescriptionLabel");
const formTitle = document.querySelector(".formTitle");

//lng
let lng = localStorage.getItem("lng") || "hebrew";
localStorage.setItem("lng", lng);

//event listeners
logTodos.addEventListener("click", openTodosForm);
showTodos.addEventListener("click", showTodosList);
hebrewButton.addEventListener("click", displayHebrew);
englishButton.addEventListener("click", displayEnglish);
homeButton.addEventListener("click", () => {
	todosList.style.display = "none";
	todosFormPage.style.display = "none";
	logTodos.style.display = "block";
	showTodos.style.display = "block";
	homeButton.style.display = "none";
	todoForm.reset();
	isEditing = false;
});
addTodoSubmit.addEventListener("click", (e) => {
	e.preventDefault();
	let newTodo = new Todo();
	formValidation();
	if (isValid) {
		newTodo.addTodo(todoForm);
	}
});

/* ------------------------------------------------------   local storage functions ------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
	if (localStorage.getItem("todos")) {
		let todos = JSON.parse(localStorage.getItem("todos"));
		todos.forEach((todo) => {
			let newTodo = new Todo();
			newTodo.title = todo.title;
			newTodo.description = todo.description;
			newTodo.dueDate = todo.dueDate;
			newTodo.status = todo.status;
			todoManage.todos.push(newTodo);
		});
		todoManage.displayTodos();
	}
	if (localStorage.getItem("lng") === "english") {
		displayEnglish();
	} else {
		displayHebrew();
	}
});

/* ------------------------------------------------------   lng changes functions ------------------------------------------------------- */

function displayEnglish() {
	lng = "english";
	localStorage.setItem("lng", lng);
	todosWrap.style.flexDirection = "row";
	mobileNavigator.style.flexDirection = "row";
	instrections.style.direction = "ltr";
	todoForm.classList.add("english");
	todoForm.classList.remove("hebrew");
	todoManage.displayTodos();
	todoManage.localStorage();
	pageTranslation();
	fromTranslation();
}
function displayHebrew() {
	lng = "hebrew";
	localStorage.setItem("lng", lng);
	todosWrap.style.flexDirection = "row-reverse";
	mobileNavigator.style.flexDirection = "row-reverse";
	instrections.style.direction = "rtl";
	todoForm.classList.add("hebrew");
	todoForm.classList.remove("english");
	todoManage.displayTodos();
	todoManage.localStorage();
	pageTranslation();
	fromTranslation();
}

function pageTranslation() {
	if (lng === "english") {
		logTodos.innerHTML = "Adding New Todos";
		showTodos.innerHTML = "Show Exist Todos";
		homeButton.innerHTML = "Back to Home";
		headTitle.innerHTML = "Your Todo List";
		notStartedTitle.innerHTML = "Not Started";
		inProgressTitle.innerHTML = "In Progress";
		doneTitle.innerHTML = "Done";
		notStartedButtonMobile.innerHTML = "Not Started";
		inProgressButtonMobile.innerHTML = "In Progress";
		doneButtonMobile.innerHTML = "Done";
		instrections.innerHTML = "Welcome to your todo list, here you can add new todos, edit them and mark them as done. Enjoy! All the todos are saved and can be viewed at any time.";
	} else {
		logTodos.innerHTML = "הוספת משימות";
		showTodos.innerHTML = "הצג משימות קיימות";
		homeButton.innerHTML = "חזרה לדף הבית";
		headTitle.innerHTML = "רשימת המשימות שלך";
		notStartedTitle.innerHTML = "לא התחילו";
		inProgressTitle.innerHTML = "בתהליך";
		doneTitle.innerHTML = "הושלמו";
		notStartedButtonMobile.innerHTML = "לא התחילו";
		inProgressButtonMobile.innerHTML = "בתהליך";
		doneButtonMobile.innerHTML = "הושלמו";
		instrections.innerHTML = "ברוכים הבאים לרשימת המשימות שלך, כאן תוכל להוסיף משימות חדשות, לערוך אותן ולסמן כאשר הן הושלמו. תהנה מהשימוש! כלל המשימות נשמרות וניתן לצפות בהן בכל עת.";
	}
}
function fromTranslation() {
	if (lng === "english") {
		formTitleInput.placeholder = "Title";
		formDescriptionInput.placeholder = "Description";
		formDueDateInput.placeholder = "Due Date";
		formDueDateLabel.innerHTML = "Due Date";
		formTitleLabel.innerHTML = "Title";
		formDescriptionLabel.innerHTML = "Description";
		addTodoSubmit.innerHTML = "Add Todo";
		editTodoSubmit.innerHTML = "Edit Todo";
		formTitle.style.textAlign = "left";
		isEditing ? (formTitle.innerHTML = "Edit Todo") : (formTitle.innerHTML = "Add New Todo");
	} else {
		formTitleInput.placeholder = "כותרת";
		formDescriptionInput.placeholder = "תיאור";
		formDueDateInput.placeholder = "תאריך לביצוע";
		formDueDateLabel.innerHTML = "תאריך לביצוע";
		formTitleLabel.innerHTML = "כותרת";
		formDescriptionLabel.innerHTML = "תיאור";
		addTodoSubmit.innerHTML = "הוסף משימה";
		editTodoSubmit.innerHTML = "ערוך משימה";
		formTitle.style.textAlign = "right";
		isEditing ? (formTitle.innerHTML = "ערוך משימה") : (formTitle.innerHTML = "הוסף משימה חדשה");
	}
}

/* ------------------------------------------------------   control the display functions ----------------------------------------------- */
function openTodosForm() {
	todosFormPage.style.display = "flex";
	logTodos.style.display = "none";
	showTodos.style.display = "none";
	homeButton.style.display = "block";
	if (isEditing) {
		editTodoSubmit.style.display = "block";
		addTodoSubmit.style.display = "none";
		lng === "english" ? (formTitle.innerHTML = "Edit Todo") : (formTitle.innerHTML = "ערוך משימה");
	} else {
		formDescriptionInput.value = "";
		formTitleInput.value = "";
		formDueDateInput.value = "";
		editTodoSubmit.style.display = "none";
		addTodoSubmit.style.display = "block";
		lng === "english" ? (formTitle.innerHTML = "Add New Todo") : (formTitle.innerHTML = "הוסף משימה חדשה");
	}
}

function showTodosList() {
	todosList.style.display = "flex";
	logTodos.style.display = "none";
	showTodos.style.display = "none";
	homeButton.style.display = "block";
}

/* --------------------------------------------------------   Form Validtion -------------------------------------------------------------- */

function formValidation() {
	let msg;
	isValid = true;
	clearErrors();
	if (formTitleInput.value === "" || formTitleInput.value.length > 20 || (titleExist(formTitleInput.value) && isEditing === false)) {
		if (titleExist(formTitleInput.value)) {
			msg = lng === "english" ? "not Possible using existing title" : "לא ניתן להשתמש באותה כותרת פעמיים";
			showError(formTitleInput, msg);
		} else if (formTitleInput.value.length > 20) {
			msg = lng === "english" ? "Title must be less than 20 characters" : "הכותרת חייבת להיות פחות מ-20 תווים";
			showError(formTitleInput, msg);
		} else {
			msg = lng === "english" ? "Please enter a title" : "אנא הכנס כותרת";
			showError(formTitleInput, msg);
		}
		isValid = false;
	}
	if (formDescriptionInput.value === "" || formDescriptionInput.value.length > 250) {
		if (formDescriptionInput.value.length > 250) {
			msg = lng === "english" ? "Description must be less than 50 characters" : "התיאור חייב להיות פחות מ-250 תווים";
			showError(formDescriptionInput, msg);
		} else {
			msg = lng === "english" ? "Please enter a description" : "אנא הכנס תיאור";
			showError(formDescriptionInput, msg);
		}
		isValid = false;
	}
	if (formDueDateInput.value === "" || formDueDateInput.value < new Date().toISOString().split("T")[0]) {
		if (formDueDateInput.value === "") {
			msg = lng === "english" ? "Please enter a due date" : "אנא הכנס תאריך לביצוע";
			showError(formDueDateInput, msg);
		} else if (formDueDateInput.value < new Date().toISOString().split("T")[0]) {
			msg = lng === "english" ? "Due date must be in the future" : "תאריך לביצוע חייב להיות בעתיד";
			showError(formDueDateInput, msg);
		}
		isValid = false;
	}
}
// Function to show error messages
function showError(input, message) {
	const errorElement = document.createElement("div");
	errorElement.classList.add("error");
	errorElement.innerText = message;
	input.parentElement.appendChild(errorElement);
}

function clearErrors() {
	const errorElements = document.querySelectorAll(".error");
	errorElements.forEach((element) => element.remove());
}

function flipDate(dateStr) {
	// Split the input date string by the hyphen
	const [yy, mm, dd] = dateStr.split("-");
	// Return the flipped date string
	return `${dd}-${mm}-${yy}`;
}

function titleExist(title) {
	return todoManage.todos.some((todo) => todo.title === title);
}

/* --------------------------------------------------------   classes to manage the todo -------------------------------------------------- */

class Todo {
	constructor(title, description, dueDate, status) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.status = status;
	}
	startStatus() {
		if (lng === "english") {
			return "Not Started";
		} else {
			return "לא בוצע";
		}
	}
	addTodo() {
		let title = formTitleInput.value;
		let description = formDescriptionInput.value;
		let dueDate = flipDate(formDueDateInput.value);
		let newTodo = new Todo(title, description, dueDate, this.startStatus());
		todoManage.add(newTodo);
		todosFormPage.style.display = "none";
		todosList.style.display = "flex";
		todoForm.reset();
	}
	todoCard() {
		if (lng === "hebrew") {
			if (this.status === "Not Started") {
				this.status = "לא בוצע";
			} else if (this.status === "In Progress") {
				this.status = "בתהליך";
			} else if (this.status === "Done") {
				this.status = "הושלם";
			}
			return `
        <div class="todoCard">
			<div class="todoCardText cardRow">
            <h3>${this.title}</h3>
            <p>${this.description}</p>
			</div>
			<div class="todoCardInfo cardRow">
            <p>תאריך לביצוע: ${this.dueDate}</p>
            <div>
            <p>סטטוס: ${this.status}</p>
            <button class="statusChange">שנה סטטוס</button>
            </div>
            <i class="fa-solid fa-trash-can deleteTodoCard"></i>
			<i class="fa-solid fa-pen editTodoCard"></i>
			</div>
        </div>
        `;
		} else {
			if (this.status === "לא בוצע") {
				this.status = "Not Started";
			} else if (this.status === "בתהליך") {
				this.status = "In Progress";
			} else if (this.status === "הושלם") {
				this.status = "Done";
			}
			return `
			<div class="todoCard">
				<div class="todoCardText">
				<h3>${this.title}</h3>
				<p>${this.description}</p>
				</div>
				<div class="todoCardInfo cardRow">
				<p>Due Date: ${this.dueDate}</p>
				<div>
				<p>Status: ${this.status}</p>
				<button class="statusChange">Change Status</button>
				</div>
				<i class="fa-solid fa-trash-can deleteTodoCard"></i>
				<i class="fa-solid fa-pen editTodoCard"></i>
				</div>
			</div>
			`;
		}
	}
	todoDelete(e) {
		let currentTodo = e.target.parentElement.parentElement;
		let currentTitle = currentTodo.querySelector("h3");
		todoManage.todos = todoManage.todos.filter((todo) => todo.title !== currentTitle.innerHTML);
		todoManage.localStorage();
		todoManage.displayTodos();
	}
	todoEdit(todo) {
		isEditing = true;
		formTitleInput.value = todo.title;
		formDescriptionInput.value = todo.description;
		formDueDateInput.value = todo.dueDate;
		todosList.style.display = "none";
		openTodosForm();
		editTodoSubmit.addEventListener("click", (e) => {
			e.preventDefault();
			formValidation();
			if (isValid) {
				todoManage.edit(todo.title);
				isEditing = false;
				todosFormPage.style.display = "none";
				todosList.style.display = "flex";
			}
		});
	}
	todoStatusChange() {
		if (lng === "english") {
			if (this.status === "Not Started") {
				this.status = "In Progress";
			} else if (this.status === "In Progress") {
				this.status = "Done";
			} else if (this.status === "Done") {
				this.status = "Not Started";
			}
		} else {
			if (this.status === "לא בוצע") {
				this.status = "בתהליך";
			} else if (this.status === "בתהליך") {
				this.status = "הושלם";
			} else if (this.status === "הושלם") {
				this.status = "לא בוצע";
			}
		}
		todoManage.localStorage();
	}
}

class TodoManage {
	constructor() {
		this.todos = [];
	}
	add(todo) {
		this.todos.push(todo);
		this.localStorage();
		this.displayTodos();
	}
	displayTodos() {
		notStarted.innerHTML = "";
		done.innerHTML = "";
		inProgress.innerHTML = "";
		this.todos.forEach((todo) => {
			let todoCard = document.createElement("div");
			todoCard.innerHTML = todo.todoCard();
			if (todo.status === "Not Started" || todo.status === "לא בוצע") {
				notStarted.appendChild(todoCard);
				todoCard.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
			}
			if (todo.status === "In Progress" || todo.status === "בתהליך") {
				inProgress.appendChild(todoCard);
				todoCard.style.backgroundColor = "rgba(255, 255, 0, 0.2)";
			}
			if (todo.status === "Done" || todo.status === "הושלם") {
				done.appendChild(todoCard);
				todoCard.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
			}
			todoCard.style.direction = lng === "english" ? todoCard.classList.add("english") : todoCard.classList.add("hebrew");

			const deleteTodoCard = todoCard.querySelector(".deleteTodoCard");
			deleteTodoCard.addEventListener("click", (e) => {
				todo.todoDelete(e);
			});
			const editTodoCard = todoCard.querySelector(".editTodoCard");
			editTodoCard.addEventListener("click", () => {
				todo.todoEdit(todo);
			});
			const statusChange = todoCard.querySelector(".statusChange");
			statusChange.addEventListener("click", () => {
				todo.todoStatusChange();
				this.displayTodos();
			});
		});
	}
	edit(title) {
		this.todos.map((todo) => {
			if (todo.title === title) {
				todo.title = formTitleInput.value;
				todo.description = formDescriptionInput.value;
				todo.dueDate = formDueDateInput.value;
			}
		});
		this.localStorage();
		this.displayTodos();
	}
	localStorage() {
		localStorage.setItem("todos", JSON.stringify(this.todos));
	}
}

/* ---------------------------------------------------------------------------------------------------------------------------- */

const todoManage = new TodoManage();

//mobile Control
const notStartedContainer = document.querySelector(".notStartedContainer");
const inProgressContainer = document.querySelector(".inProgressContainer");
const doneContainer = document.querySelector(".doneContainer");
const mobileNavigator = document.querySelector(".mobileNavigator");

notStartedButtonMobile.addEventListener("click", () => {
	notStartedContainer.style.display = "flex";
	inProgressContainer.style.display = "none";
	doneContainer.style.display = "none";
});
inProgressButtonMobile.addEventListener("click", () => {
	notStartedContainer.style.display = "none";
	inProgressContainer.style.display = "flex";
	doneContainer.style.display = "none";
});
doneButtonMobile.addEventListener("click", () => {
	notStartedContainer.style.display = "none";
	inProgressContainer.style.display = "none";
	doneContainer.style.display = "flex";
});
