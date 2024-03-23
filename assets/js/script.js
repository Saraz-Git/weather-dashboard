const searchHistory = [];
const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'ed3886039111ea00953ef8af2d692ba1';

//dayjs.extend(window.dayjs_plugin_utc);
//dayjs.extend(window.dayjs_plugin_timezone);

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input');
const todayContainerEl = document.querySelector('#today');
const fivedayDivEl = document.querySelector('#five-day');
const forecastContainerEl = document.querySelector('#forecast');
const historyContainerEl = document.querySelector('#history');

const handleFormSubmit = function (event) {
    event.preventDefault();
    let cityInput = searchInputEl.value.trim();
    if (cityInput) {
        getCityWeather(cityInput);
        todayContainerEl.textContent = '';
        fivedayDivEl.textContent = '';
        forecastContainerEl.textContent = '';
        searchInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};


const getCityWeather = function (cityInput) {
    let apiGeoUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${cityInput}&limit=1&appid=${weatherApiKey}`;

    fetch(apiGeoUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        const lon = (data[0].lon);
                        const lat = (data[0].lat);
                        getWeatherCurrent(lat, lon);
                        getWeatherForecast(lat, lon);
                    })
            } else { alert(`Error:${response.statusText}`) }
        }).catch(function (error) { alert('Unable to connect to openweathermap') })
};

const getWeatherCurrent = function (lat, lon) {
    let apiCurrentUrl = `${weatherApiRootUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;
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

const getWeatherForecast = function (lat, lon) {
    let apiForecastUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`;
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

const renderForecast = function (data) {
    const forecastHeaderEl = document.createElement('h4');
    forecastHeaderEl.textContent = '5-Day Forecast:';
    fivedayDivEl.appendChild(forecastHeaderEl);

    for (let i = 0; i < data.list.length; i++) {
        if (i % 8 === 0) {

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
            forecastContainerEl.appendChild(forecastCardsEl);
            fivedayDivEl.appendChild(forecastContainerEl);
            fivedayDivEl.setAttribute('class','mt-3');
        }
    }
}

const renderCurrent = function (data) {

    const currentIconCode = data.weather[0].icon;
    const currentIconUrl = "http://openweathermap.org/img/w/" + currentIconCode + ".png";
    const currentIconEl = document.createElement('img');
    currentIconEl.setAttribute('src', currentIconUrl);
    currentIconEl.setAttribute('alt', data.weather[0].description);
    currentIconEl.setAttribute('id','current-icon');

    const currentCityEl = document.createElement('h3');
    currentCityEl.textContent = data.name + ' (' + dayjs().format('YYYY/MM/DD')+')';
    todayContainerEl.appendChild(currentCityEl);
    todayContainerEl.appendChild(currentIconEl);

    const currentTempEl = document.createElement('h6');
    const currentWindEl = document.createElement('h6');
    const currentHumidityEl = document.createElement('h6');
    currentTempEl.textContent = `Temp: ${data.main.temp}°C`;
    currentWindEl.textContent = `Wind: ${data.wind.speed} m/s`;
    currentHumidityEl.textContent = `Humidity: ${data.main.humidity}%`;
    todayContainerEl.appendChild(currentTempEl);
    todayContainerEl.appendChild(currentWindEl);
    todayContainerEl.appendChild(currentHumidityEl);
    todayContainerEl.setAttribute('class','border border-2 border-secondary p-2');
    

};





searchFormEl.addEventListener('submit', handleFormSubmit);