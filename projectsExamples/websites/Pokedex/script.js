// all the pokemon data display in the pokedex
const pokemonName = document.querySelector('.pokemonName');
const pokemonImg = document.querySelector('.pokemonImg');
const pokemonType = document.querySelector('.pokemonType');
const pokemonHeight = document.querySelector('.pokemonHeight');
const pokemonWeight = document.querySelector('.pokemonWeight');
const pokemonDescription = document.querySelector('.pokemonDescription');
const pokemonId = document.querySelector('.pokemonId');
const pokemonStats = document.querySelector('.pokemonStats');
//search bar
const search = document.querySelector('.search');
//all buttons
const searchButton = document.querySelector('.searchButton');
const nextButton = document.querySelector('.nextButton');
const prevButton = document.querySelector('.prevButton');
const caught = document.querySelector('.caught');
const backToPokedex = document.querySelector('.backToPokedex');
const myPokemonsButton = document.querySelector('.myPokemonsButton');
//the display divs
const myPokemonsDisplay = document.querySelector('.myPokemonsDisplay');
const pokemonDataView = document.querySelector('.pokemonDataView');
//all the pokemon data from the api
let pokemonData;
let pokemonSpeciesData;


async function getPokemonData(pokemon) {
    try {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        pokemonData = await pokemonResponse.json();
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
        pokemonSpeciesData = await speciesResponse.json();

        displayPokemonData();
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
    }
}

getPokemonData(1);
searchButton.addEventListener('click', () => getPokemonData(search.value));


function displayPokemonData() {
    clearCurrentPokemon();
    pokemonId.innerHTML = `#${pokemonData.id}`;
    pokemonName.textContent = pokemonData.name;
    pokemonImg.src = pokemonData.sprites.front_default;
    pokemonHeight.innerHTML = `Height : ${pokemonData.height * 10}cm`;
    pokemonWeight.innerHTML = `Weight : ${pokemonData.weight / 10}kg`;
    pokemonDescription.innerHTML = `<p>${pokemonSpeciesData.flavor_text_entries[0].flavor_text}</p>`;
    displayType();
    displayStats();
}

function clearCurrentPokemon() {
    pokemonName.textContent = '';
    pokemonImg.src = '';
    pokemonType.innerHTML = '';
    pokemonHeight.textContent = '';
    pokemonWeight.textContent = '';
    pokemonDescription.textContent = '';
    pokemonId.textContent = '';
    pokemonStats.innerHTML = '';
}

function displayType() {
    typesRow = document.createElement('div');
    typesRow.classList.add('typesRow');
    pokemonType.appendChild(typesRow);
    pokemonData.types.forEach(type => {
        let typeBox = document.createElement('div');
        typeBox.textContent = type.type.name;
        typeBox.classList.add('typeBox');
        typeColor = checkTypeColor(type.type.name);
        typeBox.style.backgroundColor = typeColor;
        typesRow.appendChild(typeBox);
    });
}

function checkTypeColor(type) {
    switch (type) {
        case 'normal':
            return '#A8A77A';
        case 'fire':
            return '#EE8130';
        case 'water':
            return '#6390F0';
        case 'electric':
            return '#F7D02C';
        case 'grass':
            return '#7AC74C';
        case 'ice':
            return '#96D9D6';
        case 'fighting':
            return '#C22E28';
        case 'poison':
            return '#A33EA1';
        case 'ground':
            return '#E2BF65';
        case 'flying':
            return '#A98FF3';
        case 'psychic':
            return '#F95587';
        case 'bug':
            return '#A6B91A';
        case 'rock':
            return '#B6A136';
        case 'ghost':
            return '#735797';
        case 'dragon':
            return '#6F35FC';
        case 'dark':
            return '#705746';
        case 'steel':
            return '#B7B7CE';
        case 'fairy':
            return '#D685AD';
        default:
            return '#000';
    }
}

function displayStats() {
    pokemonData.stats.forEach(stat => {
        let statBox = document.createElement('div');
        let statName = document.createElement('div');
        let statGauge = document.createElement('div');
        statGauge.classList.add('statGauge');
        statName.classList.add('statName');
        statBox.classList.add('statBox');
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
        case 'hp':
            return '#FF5959';
        case 'attack':
            return '#F5AC78';
        case 'defense':
            return '#FAE078';
        case 'special-attack':
            return '#9DB7F5';
        case 'special-defense':
            return '#A7DB8D';
        case 'speed':
            return '#FA92B2';
        default:
            return '#000'; // Default color if stat name doesn't match any case
    }
}


nextButton.addEventListener('click', nextPokemon);
prevButton.addEventListener('click', previousPokemon);

function nextPokemon() {
    getPokemonData(pokemonData.id + 1);
}
function previousPokemon() {
    getPokemonData(pokemonData.id - 1);
}



myPokemonsButton.addEventListener('click', showMyPokemons);
caught.addEventListener('click', markFavorite);
backToPokedex.addEventListener('click', () => {
    myPokemonsDisplay.style.display = 'none';
    pokemonDataView.style.display = 'flex';
});

function showMyPokemons() {
    myPokemonsDisplay.style.display = 'flex';
    pokemonDataView.style.display = 'none';
}

function markFavorite() {
    let favorite = document.createElement('div');
    favorite.classList.add('favorite');
    favorite.innerHTML =
        `<img src="${pokemonImg.src}" alt="${pokemonName.textContent}">
        <div class="favoriteName">${pokemonName.textContent}</div>`;
    myPokemonsDisplay.appendChild(favorite);
}