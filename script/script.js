//the main containers for the projects
const mainPage = document.querySelector(".mainPage");
const projectsDisplay = document.querySelector(".projectsDisplay");
let projectsCategorey;
const projectDivCleaner = document.querySelector(".projectDivCleaner");
const boxSelectors = document.querySelector(".boxSelectors");
//the buttons for the projects categories
const boxButtons = document.querySelectorAll(".boxButton");
const landingPagesButton = document.querySelector(".landingPagesButton");
const gamesButton = document.querySelector(".gamesButton");
const websitesButton = document.querySelector(".websitesButton");
const returnButton = document.querySelector(".returnButton");
// data for the projects
let projectsData;

//form inputs
const fullName = document.getElementById("fullname");
const phone = document.getElementById("phonenumber");
const email = document.getElementById("email");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitbutton");
const contactForm = document.getElementById("contactForm");

async function fetchProjectsData() {
	try {
		//const response = await fetch("/project/script/projects.json"); //fetch that works with github pages
		const response = await fetch("../script/projects.json"); //fetch that works with local server
		projectsData = await response.json();
	} catch (error) {
		console.error("Error:", error);
	}
}

//the constructor for the project cards
class ProjectCard {
	constructor(project) {
		this.project = project;
		this.projectCard = this.cardBuilder(project);
	}
	cardBuilder(project) {
		const projectCard = document.createElement("div");
		projectCard.classList.add("projectexample");
		projectCard.innerHTML = `
                    <img src="${project.image}" alt="דוגמה לפרויקט">
                    <div class="projectsinfo">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="techUsed">
                            ${this.projectTechDisplay(project)}
                    </div>
                    <div class="projbutton normalText">למעבר לפרויקט</div>
        `;
		const projectButton = projectCard.querySelector(".projbutton");
		projectButton.addEventListener("click", (e) => openDisplayPage(e));
		return projectCard;
	}
	projectTechDisplay(project) {
		return project.tech.map((tech) => `<img src="images/svg/${tech}.svg" alt="${tech} logo">`).join("");
	}
	displayCard(projectCard) {
		projectsCategorey.appendChild(this.projectCard);
	}
}

boxButtons.forEach((button) => button.addEventListener("click", boxButtonDisplay));
function boxButtonDisplay(e) {
	checkCategory = e.target.innerHTML;
	boxSelectors.style.display = "none";
	if (checkCategory === "עמודי נחיתה") {
		showProjectsDisplay(0, "landingPages");
	} else if (checkCategory === "משחקים") {
		showProjectsDisplay(1, "games");
	} else if (checkCategory === "אתרים") {
		showProjectsDisplay(2, "websites");
	}
}

fetchProjectsData().then(() => {
	landingPagesButton.addEventListener("click", () => showProjectsDisplay(0, "landingPages"));
	gamesButton.addEventListener("click", () => showProjectsDisplay(1, "games"));
	websitesButton.addEventListener("click", () => showProjectsDisplay(2, "websites"));
});

function showProjectsDisplay(categoreyIndication, categoryName) {
	projectsDisplay.style.display = "flex";
	projectDivCleaner.innerHTML = "";
	const projectsArray = projectsData.projects[categoreyIndication][categoryName];
	projectsCategorey = document.createElement("div");
	projectsCategorey.classList.add("listofprojects");
	projectDivCleaner.appendChild(projectsCategorey);
	projectsArray.forEach((project) => {
		const currentProject = new ProjectCard(project);
		currentProject.displayCard();
	});
}

returnButton.addEventListener("click", () => {
	projectsDisplay.style.display = "none";
	boxSelectors.style.display = "flex";
});

//form validation
submitButton.addEventListener("click", formValidation);

function formValidation(e) {
	e.preventDefault();
	let isValid = true;
	clearErrors();

	if (fullName.value.trim() === "") {
		showError(fullName, "שם מלא הינו שדה חובה");
		isValid = false;
	}
	const phonePattern = /^[0-9]{10}$/;
	if (!phonePattern.test(phone.value.trim())) {
		showError(phone, "מספר טלפון חייב להכיל 10 ספרות");
		isValid = false;
	}

	// Validate email
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email.value.trim())) {
		showError(email, "אימייל אינו תקין");
		isValid = false;
	}

	// Validate message
	if (message.value.trim() === "") {
		showError(message, "הודעה היא שדה חובה");
		isValid = false;
	}

	if (isValid) {
		messageSuccess();
		contactForm.reset(); // until i will add the server side
	}
}

// Function to show error messages
function showError(input, message) {
	const errorElement = document.createElement("div");
	errorElement.classList.add("error");
	errorElement.innerText = message;

	// Position the error message above the input field
	errorElement.style.bottom = "100%"; // Position above the input field
	errorElement.style.left = "0";
	errorElement.style.transform = "translateY(-10px)"; // Adjust the position
	errorElement.style.marginBottom = "5px"; // Space between input and error

	input.parentElement.appendChild(errorElement);
}

// Function to clear previous error messages
function clearErrors() {
	const errorElements = document.querySelectorAll(".error");
	errorElements.forEach((element) => element.remove());
}

function messageSuccess() {
	const popUpMessage = document.createElement("div");
	popUpMessage.classList.add("popUpMessage");
	const successMessageBox = document.createElement("div");
	successMessageBox.classList.add("successMessageBox");
	successMessageBox.innerText = "ההודעה נשלחה בהצלחה";
	document.body.appendChild(popUpMessage);
	popUpMessage.appendChild(successMessageBox);
	setTimeout(() => {
		popUpMessage.remove();
	}, 1500);
}

/* ------------------------------------------------------- Display Page Functions ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------- */
const displayPage = document.querySelector(".displayPage");
const displayPageTitle = document.querySelector(".displayPageTitle");
const displayPageDescription = document.querySelector(".displayPageDescription");
const showProject = document.querySelector(".showProject");
const downloadProject = document.querySelector(".downloadProject");
const displayPageTech = document.querySelector(".displayPageTech");
const displayPageImage = document.querySelector(".displayPageImage");

function openDisplayPage(e) {
	const projectTitle = e.target.parentElement.querySelector("h3").innerText;
	let allProjects = projectsData.projects.flatMap((obj) => Object.values(obj)).flat();
	const project = allProjects.find((project) => project.title === projectTitle);
	mainPage.style.display = "none";
	displayPage.style.display = "block";

	displayPageTitle.innerText = project.title;
	displayPageDescription.innerText = project.description;
	displayPageImage.src = project.image;
	displayPageTech.innerHTML = project.tech.map((tech) => `<img src="images/svg/${tech}.svg" alt="${tech} logo">`).join("");
	showProject.href = project.url;
	downloadProject.href = project.downloadLink;

	const backToMainButton = document.querySelector(".backToMainButton");
	backToMainButton.addEventListener("click", () => {
		displayPage.style.display = "none";
		mainPage.style.display = "block";
	});
}
