// all the pokemon data display in the pokedex
const pokemonName = document.querySelector(".pokemonName");
const pokemonImg = document.querySelector(".pokemonImg");
const pokemonType = document.querySelector(".pokemonType");
const pokemonHeight = document.querySelector(".pokemonHeight");
const pokemonWeight = document.querySelector(".pokemonWeight");
const pokemonDescription = document.querySelector(".pokemonDescription");
const pokemonId = document.querySelector(".pokemonId");
const pokemonStats = document.querySelector(".pokemonStats");

//all the pokemon data display in the myPokemons needed variables
let pokemonInfo;
let parentElement;
let favoritePokemonsData = [] || JSON.parse(sessionStorage.getItem("favoritePokemonsData"));
const pokemonNicknameInput = document.querySelector(".pokemonNameInput");
const pokemonLevelInput = document.querySelector(".pokemonLevelInput");
const pokemonNatureInput = document.querySelector(".pokemonNatureInput");
let pokemonInputs = [pokemonNicknameInput, pokemonLevelInput, pokemonNatureInput];

//all the trainer data display in the pokedex
const trainerName = document.querySelector(".trainerName");
const trainerAge = document.querySelector(".trainerAge");
const trainerGender = document.querySelector(".trainerGender");
const trainerAvatar = document.querySelector(".trainerAvatar");

//search bar
const search = document.querySelector(".search");

//all buttons
const startingButton = document.querySelector(".startingButton");
const viewPokemonsButton = document.querySelector(".viewPokemonsButton");
const yourPokemonsButton = document.querySelector(".yourPokemonsButton");
const homeButtons = document.querySelectorAll(".homeButton");
const searchButton = document.querySelector(".searchButton");
const nextButton = document.querySelector(".nextButton");
const prevButton = document.querySelector(".prevButton");
const caught = document.querySelector(".caught");
const backToPokedex = document.querySelector(".backToPokedex");
const myPokemonsButton = document.querySelector(".myPokemonsButton");
const addPokemon = document.querySelector(".addPokemon");
const updatePokemonButton = document.querySelector(".updatePokemonButton");

//the display divs
const loginPopUp = document.querySelector(".loginPopUp");
const yourPokePopUp = document.querySelector(".yourPokePopUp");
const pokedexBox = document.querySelector(".pokedexBox");
const myPokemonsDisplay = document.querySelector(".myPokemonsDisplay");
const pokemonDataView = document.querySelector(".pokemonDataView");
const pokedexHome = document.querySelector(".pokedexHome");

//all the pokemon data from the api
let pokemonData;
let pokemonSpeciesData;

/* --------------------------------------------------------- Event Listeners -------------------------------------------------------------------------*/
/* ---------------------------------------------------------------------------------------------------------------------------------------------------*/

startingButton.addEventListener("click", login);
viewPokemonsButton.addEventListener("click", () => getPokemonData(1));
yourPokemonsButton.addEventListener("click", showMyPokemons);
myPokemonsButton.addEventListener("click", showMyPokemons);
caught.addEventListener("click", enterYourPokemon);
searchButton.addEventListener("click", () => getPokemonData(search.value));
nextButton.addEventListener("click", nextPokemon);
prevButton.addEventListener("click", previousPokemon);
backToPokedex.addEventListener("click", backToPokedexFunc);
homeButtons.forEach((button) =>
	button.addEventListener("click", () => {
		pokemonDataView.style.display = "none";
		myPokemonsDisplay.style.display = "none";
		pokedexHome.style.display = "flex";
	})
);
addPokemon.addEventListener("click", () => markFavorite(pokemonInputs));
updatePokemonButton.addEventListener("click", () => updatePokemon(parentElement));

/* --------------------------------------------------------- Login Functions -------------------------------------------------------------------------*/
/* ---------------------------------------------------------------------------------------------------------------------------------------------------*/

function login() {
	if (sessionStorage.getItem("trainerInfo") === null) {
		loginPopUp.style.display = "flex";
		const loginButton = document.querySelector(".loginButton");
		loginButton.addEventListener("click", trainerDataHandler);
	} else {
		let trainerInfo = JSON.parse(sessionStorage.getItem("trainerInfo"));
		displayTrainerInfo(trainerInfo);
	}
}

function trainerDataHandler() {
	let isValid = true;
	clearErrors();
	const trainerNameInput = document.querySelector(".trainerNameInput").value;
	const trainerAgeInput = document.querySelector(".trainerAgeInput").value;
	const trainerGenderInput = document.querySelector('input[name="gender"]:checked').value;
	const trainerInfo = [trainerNameInput, trainerAgeInput, trainerGenderInput];
	if (trainerNameInput == "") {
		isValid = false;
		showErrors(document.querySelector(".trainerNameInput"), "Name Is Required");
	} else if (trainerNameInput.length > 10) {
		isValid = false;
		showErrors(document.querySelector(".trainerNameInput"), "Up to 10 Characters");
	}
	if (trainerAgeInput == "") {
		isValid = false;
		showErrors(document.querySelector(".trainerAgeInput"), "Age Is Required");
	}
	if (trainerAgeInput > 99) {
		isValid = false;
		showErrors(document.querySelector(".trainerAgeInput"), "Max Age 120");
	}
	if (isValid) {
		displayTrainerInfo(trainerInfo);
	}
}

function showErrors(input, message) {
	const errorElement = document.createElement("div");
	errorElement.classList.add("error");
	errorElement.innerText = message;

	// Position the error message above the input field
	errorElement.style.bottom = "50%"; // Position above the input field
	errorElement.style.right = "0";
	errorElement.style.transform = "translateY(-10px)"; // Adjust the position
	errorElement.style.marginBottom = "5px"; // Space between input and error

	input.parentElement.appendChild(errorElement);
}

function clearErrors() {
	const errorElements = document.querySelectorAll(".error");
	errorElements.forEach((element) => element.remove());
}

function displayTrainerInfo(trainerInfo) {
	if (sessionStorage.getItem("trainerInfo") === null) {
		sessionStorage.setItem("trainerInfo", JSON.stringify(trainerInfo));
	}
	trainerName.innerHTML = capitalizeFirstLetter(trainerInfo[0]);
	trainerAge.innerHTML = `Age: ${trainerInfo[1]}`;
	genderSet(trainerInfo[2]);
	loginPopUp.style.display = "none";
	startingButton.style.display = "none";
	pokedexBox.style.display = "flex";
}

function capitalizeFirstLetter(name) {
	return String(name).charAt(0).toUpperCase() + String(name).slice(1);
}

function genderSet(gender) {
	if (gender == "boy") {
		trainerAvatar.src = "images/boyAvatar.webp";
		trainerGender.src = "images/maleIcon.svg";
	} else {
		trainerAvatar.src = "images/girlAvatar.webp";
		trainerGender.src = "images/femaleIcon.svg";
	}
}

/* ----------------------------------------------- Pokemon Data Display Functions -------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------*/

async function getPokemonData(pokemon) {
	try {
		const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
		pokemonData = await pokemonResponse.json();
		const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
		pokemonSpeciesData = await speciesResponse.json();

		displayPokemonData();
	} catch (error) {
		console.error("Error fetching Pokemon data:", error);
	}
}

function displayPokemonData() {
	pokedexHome.style.display = "none";
	pokemonDataView.style.display = "flex";
	clearCurrentPokemon();
	pokemonId.innerHTML = `#${pokemonData.id}`;
	pokemonName.textContent = capitalizeFirstLetter(pokemonData.name);
	pokemonImg.src = pokemonData.sprites.front_default;
	pokemonHeight.innerHTML = `Height : ${pokemonData.height * 10}cm`;
	pokemonWeight.innerHTML = `Weight : ${pokemonData.weight / 10}kg`;
	pokemonDescription.innerHTML = `<p>${pokemonSpeciesData.flavor_text_entries[0].flavor_text}</p>`;
	displayType();
	displayStats();
}

function clearCurrentPokemon() {
	pokemonName.textContent = "";
	pokemonImg.src = "";
	pokemonType.innerHTML = "";
	pokemonHeight.textContent = "";
	pokemonWeight.textContent = "";
	pokemonDescription.textContent = "";
	pokemonId.textContent = "";
	pokemonStats.innerHTML = "";
}

function displayType() {
	typesRow = document.createElement("div");
	typesRow.classList.add("typesRow");
	pokemonType.appendChild(typesRow);
	pokemonData.types.forEach((type) => {
		let typeBox = document.createElement("div");
		typeBox.textContent = type.type.name;
		typeBox.classList.add("typeBox");
		typeColor = checkTypeColor(type.type.name);
		typeBox.style.backgroundColor = typeColor;
		typesRow.appendChild(typeBox);
	});
}

function checkTypeColor(type) {
	switch (type) {
		case "normal":
			return "#A8A77A";
		case "fire":
			return "#EE8130";
		case "water":
			return "#6390F0";
		case "electric":
			return "#F7D02C";
		case "grass":
			return "#7AC74C";
		case "ice":
			return "#96D9D6";
		case "fighting":
			return "#C22E28";
		case "poison":
			return "#A33EA1";
		case "ground":
			return "#E2BF65";
		case "flying":
			return "#A98FF3";
		case "psychic":
			return "#F95587";
		case "bug":
			return "#A6B91A";
		case "rock":
			return "#B6A136";
		case "ghost":
			return "#735797";
		case "dragon":
			return "#6F35FC";
		case "dark":
			return "#705746";
		case "steel":
			return "#B7B7CE";
		case "fairy":
			return "#D685AD";
		default:
			return "#000";
	}
}

function displayStats() {
	pokemonData.stats.forEach((stat) => {
		let statBox = document.createElement("div");
		let statName = document.createElement("div");
		let statGauge = document.createElement("div");
		statGauge.classList.add("statGauge");
		statName.classList.add("statName");
		statBox.classList.add("statBox");
		statName.innerHTML = `${stat.stat.name}: ${stat.base_stat}`;
		let width = stat.base_stat / 2;
		statGauge.style.width = `${width}%`;
		statGauge.style.backgroundColor = checkStatColor(stat.stat.name);
		pokemonStats.appendChild(statBox);
		statBox.appendChild(statName);
		statBox.appendChild(statGauge);
	});
}

function checkStatColor(stat) {
	switch (stat) {
		case "hp":
			return "#FF5959";
		case "attack":
			return "#F5AC78";
		case "defense":
			return "#FAE078";
		case "special-attack":
			return "#9DB7F5";
		case "special-defense":
			return "#A7DB8D";
		case "speed":
			return "#FA92B2";
		default:
			return "#000"; // Default color if stat name doesn't match any case
	}
}

function nextPokemon() {
	getPokemonData(pokemonData.id + 1);
}
function previousPokemon() {
	getPokemonData(pokemonData.id - 1);
}

/* --------------------------------------------------------- MyPokemons Functions -------------------------------------------------------------------------*/
/* --------------------------------------------------------------------------------------------------------------------------------------------------------*/

function showMyPokemons() {
	myPokemonsDisplay.style.display = "flex";
	pokemonDataView.style.display = "none";
	pokedexHome.style.display = "none";
	if (sessionStorage.getItem("favoritePokemonsData") !== null) {
		favoritePokemonsData = JSON.parse(sessionStorage.getItem("favoritePokemonsData"));
		displayFavoritePokemons();
	}
}

function displayFavoritePokemons() {
	favoritePokemonsData.forEach((pokemon, index) => {
		pokemonCardMaker(pokemon, index);
	});
}

function enterYourPokemon() {
	yourPokePopUp.style.display = "flex";
}

function markFavorite(pokemonInputs) {
	let isValidPokemon = true;
	clearErrors();
	if (pokemonInputs[0].value.length > 10) {
		isValidPokemon = false;
		showErrors(pokemonInputs[0], "Up to 10 Characters");
	}
	if (pokemonInputs[1].value > 99) {
		isValidPokemon = false;
		showErrors(pokemonInputs[1], "Max Level 99");
	}
	if (isValidPokemon) {
		let pokemonInputsValues = [pokemonInputs[0].value || pokemonName.textContent, pokemonInputs[1].value || 5, pokemonInputs[2].value, pokemonImg.src, pokemonName.textContent];
		favoritePokemonsData.push(pokemonInputsValues);
		let index = favoritePokemonsData.length - 1;
		pokemonCardMaker(pokemonInputsValues, index);
		clearFields();
		sessionStorage.setItem("favoritePokemonsData", JSON.stringify(favoritePokemonsData));
		yourPokePopUp.style.display = "none";
		pokemonDataView.style.display = "none";
		myPokemonsDisplay.style.display = "flex";
	}
}

function pokemonCardMaker(pokemonInputsValues, index) {
	let pokemonNickname = pokemonInputsValues[0];
	let pokemonLevel = pokemonInputsValues[1];
	let pokemonNature = pokemonInputsValues[2];
	let pokemonImg = pokemonInputsValues[3];
	let pokemonName = pokemonInputsValues[4];
	pokemonInfo = [pokemonNickname, pokemonLevel, pokemonNature, pokemonImg, pokemonName];
	let favorite = document.createElement("div");
	favorite.classList.add("favorite");
	favorite.id = index;
	favorite.innerHTML = `
		<img src="${pokemonInfo[3]}" alt="${pokemonInfo[4]}" class="favoriteImg">
        <div class="favoriteName">${pokemonInfo[0]}</div>
        <div class="row">
            <div class="favoriteLevel">Level: ${pokemonInfo[1]}</div>
            <div class="favoriteNature">Nature: ${pokemonInfo[2]}</div>
        </div>
        <button class="editPokemonButton"><img src="images/editPen.svg" alt="edit" title="Edit"/></button>
        <button class="deletePokemonButton"><img src="images/deleteThrash.svg" alt="delete" title="Delete"/></button>
        `;
	myPokemonsDisplay.appendChild(favorite);
	const editPokemonButton = favorite.querySelector(".editPokemonButton");
	editPokemonButton.addEventListener("click", (e) => editPokemon(e));
	const deletePokemonButton = favorite.querySelector(".deletePokemonButton");
	deletePokemonButton.addEventListener("click", () => deletePokemon(favorite));
}

function editPokemon(e) {
	parentElement = e.target.closest(".favorite");
	yourPokePopUp.style.display = "flex";
	pokemonNicknameInput.value = parentElement.querySelector(".favoriteName").textContent;
	pokemonLevelInput.value = parentElement.querySelector(".favoriteLevel").textContent.replace("Level: ", "");
	pokemonNatureInput.value = parentElement.querySelector(".favoriteNature").textContent.replace("Nature: ", "");
	updatePokemonButton.style.display = "block";
	addPokemon.style.display = "none";
}

function deletePokemon(parentElement) {
	console.log(parentElement.id);
	favoritePokemonsData.splice(parentElement.id, 1);
	sessionStorage.setItem("favoritePokemonsData", JSON.stringify(favoritePokemonsData));
	parentElement.remove();
	// Update remaining elements' IDs
	const remainingCards = document.querySelectorAll(".favorite");
	remainingCards.forEach((card, index) => {
		card.id = index;
	});
}

function updatePokemon(parentElement) {
	let isValidPokemon = true;
	clearErrors();
	if (pokemonInputs[0].value == "") {
		isValidPokemon = false;
		showErrors(pokemonInputs[0], "Name Is Required");
	}
	if (pokemonInputs[0].value.length > 10) {
		isValidPokemon = false;
		showErrors(pokemonInputs[0], "Up to 10 Characters");
	}
	if (pokemonInputs[1].value > 99) {
		isValidPokemon = false;
		showErrors(pokemonInputs[1], "Max Level 99");
	}
	if (isValidPokemon) {
		// Get current input values
		const newNickname = pokemonNicknameInput.value;
		const newLevel = pokemonLevelInput.value;
		const newNature = pokemonNatureInput.value;

		// Update DOM
		parentElement.querySelector(".favoriteName").textContent = `${newNickname}`;
		parentElement.querySelector(".favoriteLevel").textContent = `Level: ${newLevel}`;
		parentElement.querySelector(".favoriteNature").textContent = `Nature: ${newNature}`;

		// Find and update array
		const pokemonIndex = favoritePokemonsData.findIndex((_, index) => index == parentElement.id);
		if (pokemonIndex !== -1) {
			const existingImgSrc = parentElement.querySelector(".favoriteImg").src;
			const existingPokemon = favoritePokemonsData[pokemonIndex];
			const existingPokemonName = existingPokemon[4];
			favoritePokemonsData[pokemonIndex] = [newNickname, newLevel, newNature, existingImgSrc, existingPokemonName];
			console.log(favoritePokemonsData);

			// Update storage
			sessionStorage.setItem("favoritePokemonsData", JSON.stringify(favoritePokemonsData));
		}
		clearFields();
		yourPokePopUp.style.display = "none";
	}
}

function clearFields() {
	pokemonInputs.forEach((input) => {
		input.value = "";
		if (input.type == "select-one") {
			input.selectedIndex = 0;
		}
	});
	updatePokemonButton.style.display = "none";
	addPokemon.style.display = "block";
}

function backToPokedexFunc() {
	if (pokemonData == undefined) {
		getPokemonData(1);
		myPokemonsDisplay.style.display = "none";
	} else {
		pokemonDataView.style.display = "flex";
		myPokemonsDisplay.style.display = "none";
	}
}
