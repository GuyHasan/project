//the main containers for the projects
const projectsDisplay = document.querySelector('.projectsDisplay');
let projectsCategorey;
const projectDivCleaner = document.querySelector('.projectDivCleaner');
const boxSelectors = document.querySelector('.boxSelectors');
//the buttons for the projects categories
const boxButtons = document.querySelectorAll('.boxButton');
const landingPagesButton = document.querySelector('.landingPagesButton');
const gamesButton = document.querySelector('.gamesButton');
const websitesButton = document.querySelector('.websitesButton');
const returnButton = document.querySelector('.returnButton');
//
let projectsData;



async function fetchProjectsData() {
    try {
        const response = await fetch('/project/script/projects.json');
        projectsData = await response.json();
        console.log(projectsData);
    }
    catch (error) {
        console.error('Error:', error);
    }
}


//the constructor for the project cards
class ProjectCard {
    constructor(project) {
        this.project = project;
        this.projectCard = this.cardBuilder(project);
    }
    cardBuilder(project) {
        const projectCard = document.createElement('div');
        projectCard.classList.add('projectexample');
        projectCard.innerHTML = `
                    <img src="${project.image}" alt="דוגמה לפרויקט">
                    <div class="projectsInfo">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="techUsed">
                            ${this.projectTechDisplay(project)}
                        </div>
                        <div class="projbutton normalText"><a href="${project.url}">למעבר לפרויקט</a></div>
        `;
        return projectCard;
    }
    projectTechDisplay(project) {
        return project.tech.map(tech => `<img src="images/svg/${tech}.svg" alt="${tech} logo">`).join('');
    }
    displayCard(projectCard) {
        projectsCategorey.appendChild(this.projectCard);
    }
}


boxButtons.forEach(button => button.addEventListener('click', boxButtonDisplay));
function boxButtonDisplay(e) {
    checkCategory = e.target.innerHTML;
    boxSelectors.style.display = 'none';
    if (checkCategory === 'עמודי נחיתה') {
        showProjectsDisplay(0, 'landingPages');
    }
    else if (checkCategory === 'משחקים') {
        showProjectsDisplay(1, 'games');
    }
    else if (checkCategory === 'אתרים') {
        showProjectsDisplay(2, 'websites');
    }

}


fetchProjectsData().then(() => {
    landingPagesButton.addEventListener('click', () => showProjectsDisplay(0, 'landingPages'));
    gamesButton.addEventListener('click', () => showProjectsDisplay(1, 'games'));
    websitesButton.addEventListener('click', () => showProjectsDisplay(2, 'websites'));
});

function showProjectsDisplay(categoreyIndication, categoryName) {
    projectsDisplay.style.display = 'flex';
    projectDivCleaner.innerHTML = '';
    const projectsArray = projectsData.projects[categoreyIndication][categoryName];
    console.log(projectsArray);
    projectsCategorey = document.createElement('div');
    projectsCategorey.classList.add('listofprojects');
    projectDivCleaner.appendChild(projectsCategorey);
    projectsArray.forEach(project => {
        const currentProject = new ProjectCard(project);
        currentProject.displayCard();
    });
}

returnButton.addEventListener('click', () => {
    projectsDisplay.style.display = 'none';
    boxSelectors.style.display = 'flex';
});