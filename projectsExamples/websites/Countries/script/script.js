let apiUrl = "https://restcountries.com/v3.1/independent?status=true";
let cityName;
let weatherApiKey = "a0d4feadd4822c1fadfba065178efe1e"; // Until I learn how to hide this key
let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&units=metric&q=`;

const countries = document.querySelector(".countries");
const weather = document.querySelector(".weather");
const search = document.querySelector(".search");

fetchCountries();
search.addEventListener("input", searchCountries);

function fetchCountries() {
	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => cardsDisplay(data))
		.catch((error) => console.error(error));
}

function cardsDisplay(data) {
	let cityList = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
	cityList.forEach((country) => {
		let cityCard = document.createElement("div");
		cityCard.className = "card";
		cityCard.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}/>
            <div class="card-body">
                <h2 class="countryName">${country.name.common}</h2>
                <p>Capital: ${country.capital}</p>
                <p>Region: ${country.region}</p>
                <p>Population: ${country.population}</p>
                <p>Area: ${country.area} km<sup>2</sup></p>
                <button class="weatherButton">Show Weather</button>
            </div>
        `;
		const weatherButton = cityCard.querySelector(".weatherButton");
		weatherButton.addEventListener("click", () => getWeather(country));
		countries.appendChild(cityCard);
	});
}

function searchCountries() {
	let searchValue = search.value.toLowerCase();
	let cards = document.querySelectorAll(".card");
	cards.forEach((card) => {
		let countryName = card.querySelector(".countryName").textContent.toLowerCase();
		if (countryName.includes(searchValue)) {
			card.style.display = "flex";
		} else {
			card.style.display = "none";
		}
	});
}

function getWeather(country) {
	cityName = country.capital;
	let encodedCityName = encodeURIComponent(cityName);
	fetch(weatherApiUrl + encodedCityName)
		.then((response) => response.json())
		.then((data) => {
			showWeather(data);
		})
		.catch((error) => console.error(error));
}

function showWeather(data) {
	countries.style.display = "none";
	search.style.display = "none";
	weather.style.display = "flex";
	weather.innerHTML = `
        <div class="weatherCard">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"/>
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <button class="closeWeather">Close</button>
        </div>
    `;
	const closeWeather = weather.querySelector(".closeWeather");
	closeWeather.addEventListener("click", () => backToCountryList());
}

function backToCountryList() {
	weather.style.display = "none";
	weather.innerHTML = "";
	countries.style.display = "flex";
	search.style.display = "block";
}
