const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'ed3886039111ea00953ef8af2d692ba1';

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input');
const historyContainerEl = document.querySelector('#history');
const todayContainerEl = document.querySelector('#today');
const forecastContainerEl = document.querySelector('#forecast');

let searchHistory = [];
if (localStorage.getItem('cities') !== null) {
    searchHistory = JSON.parse(localStorage.getItem('cities'));
    console.log(searchHistory);
};

const handleFormSubmit = function (event) {
    event.preventDefault();
    let cityInput = searchInputEl.value.trim();
    if (cityInput) {

        getCityWeather(cityInput);
        getCityName(cityInput);

        todayContainerEl.textContent = '';
        forecastContainerEl.innerHTML = '';
        searchInputEl.value = '';
    } else {
        alert('Please enter a city');
    };
};

//api fecth coordinate by city name
const getCityWeather = function (cityInput) {
    let apiGeoUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${cityInput}&limit=1&appid=${weatherApiKey}`;

    fetch(apiGeoUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        const lon = data[0].lon;
                        const lat = data[0].lat;
                        const cityGeoUrl = `lat=${lat}&lon=${lon}`;
                        getWeatherCurrent(cityGeoUrl);
                        getWeatherForecast(cityGeoUrl);
                    })
            } else { alert(`Error:${response.statusText}`) }
        }).catch(function (error) { alert('Unable to connect to openweathermap') })
};

//api fecth offical name by city name
const getCityName = function (cityInput) {
    let apiGeoUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${cityInput}&limit=1&appid=${weatherApiKey}`;

    fetch(apiGeoUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        if (searchHistory.includes(data[0].name) !== true) {
                            searchHistory.push(data[0].name);
                            localStorage.setItem('cities', JSON.stringify(searchHistory));
                            renderHistoryBtns();
                        }
                    })
            } else { alert(`Error:${response.statusText}`) }
        }).catch(function (error) { alert('Unable to connect to openweathermap') })
};

//api fetch current weather by coordinate
const getWeatherCurrent = function (cityGeoUrl) {
    let apiCurrentUrl = `${weatherApiRootUrl}/data/2.5/weather?${cityGeoUrl}&units=metric&appid=${weatherApiKey}`;
    fetch(apiCurrentUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        renderCurrent(data);
                    })
            } else { alert(`Error:${response.statusText}`) }
        }).catch(function (error) { alert('Unable to connect to openweathermap') })
};

//api fetch 5-day forecast weather by coordinate
const getWeatherForecast = function (cityGeoUrl) {
    let apiForecastUrl = `${weatherApiRootUrl}/data/2.5/forecast?${cityGeoUrl}&units=metric&appid=${weatherApiKey}`;
    fetch(apiForecastUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        renderForecast(data);
                    })
            } else { alert(`Error:${response.statusText}`) }
        }).catch(function (error) { alert('Unable to connect to openweathermap') })
};

//render forecast div 
const renderForecast = function (data) {
    const forecastHeaderEl = document.createElement('h4');
    forecastHeaderEl.textContent = '5-Day Forecast:';
    forecastContainerEl.appendChild(forecastHeaderEl);
    const fiveDayEl = document.createElement('div');
    forecastContainerEl.appendChild(fiveDayEl);
    fiveDayEl.setAttribute('class', 'row');

    for (let i = 0; i < data.list.length; i++) {
        if (i % 8 === 7) {
            const iconcode = data.list[i].weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            const iconAlt = data.list[i].weather[0].description;

            const forecastCardsEl = document.createElement('div');
            forecastCardsEl.setAttribute('class', 'card col m-2 text-light')

            const forecastDateEl = document.createElement('h5');
            const forecastIconEl = document.createElement('img');
            const forecastTempEl = document.createElement('p');
            const forecastWindEl = document.createElement('p');
            const forecastHumidityEl = document.createElement('p');

            forecastDateEl.textContent = data.list[i].dt_txt.slice(0, 10);
            forecastIconEl.setAttribute('src', iconUrl);
            forecastIconEl.setAttribute('alt', iconAlt);
            forecastIconEl.setAttribute('width', '50');
            forecastTempEl.textContent = `Temp: ${data.list[i].main.temp} °C`;
            forecastWindEl.textContent = `Wind: ${data.list[i].wind.speed} m/s`;
            forecastHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity}%`;

            forecastCardsEl.appendChild(forecastDateEl);
            forecastCardsEl.appendChild(forecastIconEl);
            forecastCardsEl.appendChild(forecastTempEl);
            forecastCardsEl.appendChild(forecastWindEl);
            forecastCardsEl.appendChild(forecastHumidityEl);
            fiveDayEl.appendChild(forecastCardsEl);
            forecastContainerEl.setAttribute('class', 'mt-3');
        };
    };
};

//render today div 
const renderCurrent = function (data) {

    const currentIconCode = data.weather[0].icon;
    const currentIconUrl = "http://openweathermap.org/img/w/" + currentIconCode + ".png";
    const currentIconEl = document.createElement('img');
    const currentTooltipEl = document.createElement('p');
    currentTooltipEl.setAttribute('id', 'tooltip');
    currentIconEl.setAttribute('src', currentIconUrl);
    currentIconEl.setAttribute('alt', data.weather[0].description);
    currentIconEl.setAttribute('id', 'current-icon');


    const currentHeaderEl = document.createElement('div');
    const cityDateEl = document.createElement('h3');
    currentHeaderEl.setAttribute('class', 'd-inline-flex');
    cityDateEl.textContent = data.name + ' (' + dayjs().format('YYYY/MM/DD') + ')';

    currentHeaderEl.appendChild(cityDateEl);
    currentHeaderEl.appendChild(currentIconEl);
    currentHeaderEl.appendChild(currentTooltipEl);
    todayContainerEl.appendChild(currentHeaderEl);


    const currentTempEl = document.createElement('h6');
    const currentWindEl = document.createElement('h6');
    const currentHumidityEl = document.createElement('h6');
    currentTempEl.textContent = `Temp: ${data.main.temp}°C`;
    currentWindEl.textContent = `Wind: ${data.wind.speed} m/s`;
    currentHumidityEl.textContent = `Humidity: ${data.main.humidity}%`;

    todayContainerEl.appendChild(currentTempEl);
    todayContainerEl.appendChild(currentWindEl);
    todayContainerEl.appendChild(currentHumidityEl);
    todayContainerEl.setAttribute('class', 'border border-2 border-secondary p-2');

    currentIconEl.addEventListener("mouseover", (e) => {
        currentTooltipEl.textContent = data.weather[0].description;
    });

    currentIconEl.addEventListener("mouseleave", (e) => {
        currentTooltipEl.textContent = '';
    });

};

//render history div 
const renderHistoryBtns = function () {
    historyContainerEl.innerHTML = '';

    for (let i = searchHistory.length - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'd-block fw-bold btn btn-history col-12 mt-3 mb-3 text-dark');
        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        historyContainerEl.appendChild(btn);
    };
};

historyContainerEl.addEventListener('click', function (event) {
    const element = event.target;
    if (element.matches('button') === true) {
        const citySelected = element.textContent;
        getCityWeather(citySelected);
        todayContainerEl.innerHTML = '';
        forecastContainerEl.innerHTML = '';
    }
})

searchFormEl.addEventListener('submit', handleFormSubmit);
renderHistoryBtns();
