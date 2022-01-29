const locationInputEl =document.querySelector('#location')
const recentlySearchEl = document.querySelector('#recently-search')
const searchDisplay = document.querySelector("#searchDisplay");
const searchDisplayList = document.querySelector("#searchList");
const searchDisplayDays = document.querySelector("#searchDisplayDays");
const btnEl = document.querySelector('#search-btn')

let loadData = [];


// Fetch the current weather
const getWeather = function (location) {

    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&cnt=7&APPID=859703ec2c35d55d411c037402bef9ad";

    fetch(apiUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                getLan(data, location);
                currentWeather(data, location);
                console.log(data);
            });
        } else {
            alert("City wasn't found");
            
        }
    });
}


// Submit handler
const formSubmitHandler = function (event) {
    event.preventDefault();
    const location = locationInputEl.value.trim();

    if (location) {
        getWeather(location);
        locationInputEl.value = "";

    } else {
        alert("Please enter a location");
    }
 
    loadData.push(location);

    saveInput();
    displayRecentSearch();
};


// Display rececntly search
const displayRecentSearch = function () {

    recentlySearchEl.textContent = "";

    const saveArr = JSON.parse(localStorage.getItem("locations"));

    for (var i = 0; i < saveArr.length; i++) {

        const saved = document.createElement("li");
        saved.classList = "my-3";


        saved.textContent = saveArr[i];

        recentlySearchEl.appendChild(saved);
    }
};


// Displat current weather
const currentWeather = function (weather, searchTerm) {

    const iconLink = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
    const iconSpan = document.createElement("img");
    iconSpan.setAttribute('src', iconLink);

    searchDisplayList.textContent = "";
    searchDisplay.textContent = searchTerm + " " + moment().format("MM/DD/YYYY");
    searchDisplay.appendChild(iconSpan);

    const farenheight = Math.round((weather.main.temp - 273.15) * 9 / 5 + 32);

    const temp = document.createElement("li");
    temp.textContent = farenheight + "°F";
    temp.classList.add("today-data");

    const wind = document.createElement("li");
    wind.textContent = "Wind: " + weather.wind.speed + " MPH";
    wind.classList.add("today-data");

    const humidity = document.createElement("li");
    humidity.textContent = "Humidity: " + weather.main.humidity + "%";
    humidity.classList.add("today-data");

    searchDisplayList.appendChild(temp);
    searchDisplayList.appendChild(wind);
    searchDisplayList.appendChild(humidity);

};

// Get lat data
const getLan = function (weather) {

    const lat = weather.coord.lat;
    console.log(lat);

    const lon = weather.coord.lon;
    console.log(lon);

    const apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&cnt=5&exclude=hourly&appid=859703ec2c35d55d411c037402bef9ad";

    fetch(apiUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                displayNextDays(data, location)
                console.log(data);
            });
        } else {
            alert("Error");
        }
    });
};

// Display 5 next days
const displayNextDays = function (weather, searchTerm) {

    const uvInfo = document.createElement("li");
    uvInfo.textContent = "UV Index: " + weather.current.uvi;
    if (weather.current.uvi <= 5) {
        uvInfo.classList.add("uv-favorable");
    } else if (weather.current.uvi >= 5.1 || weather.current.uvi <= 9) {
        uvInfo.classList.add("uv-moderate");
    } else if (weather.current.uvi > 0) {
        uvInfo.classList.add("uv-severe");
    }

    searchDisplayList.appendChild(uvInfo);
    searchDisplayDays.textContent = "";

    for (i = 1; i < 6; i++) {

        const weatherCard = document.createElement("div");
        weatherCard.classList = "card col-2 mr-4 pl-2";
        weatherCard.setAttribute("id", "card-day")

        const iconLink = "http://openweathermap.org/img/wn/" + weather.daily[i].weather[0].icon + "@2x.png";
        const iconSpan = document.createElement("img");
        iconSpan.setAttribute('src', iconLink);

        const cardDate = document.createElement("h4");
        cardDate.textContent = moment().add(i, 'days').format("MM/DD/YYYY");
        cardDate.appendChild(iconSpan);

        weatherCard.appendChild(cardDate);

        const farenheight = Math.round((weather.daily[i].temp.day - 273.15) + 9 / 5 + 32);

        const temp = document.createElement("li");
        temp.textContent = farenheight + "*F";
        temp.classList.add("other-data");

        const wind = document.createElement("li");
        wind.textContent = "Wind: " + weather.daily[i].wind_speed + " MPH";
        wind.classList.add("other-data");

        const humidity = document.createElement("li");
        humidity.textContent = "Humidity: " + weather.daily[i].humidity + "%";
        humidity.classList.add("other-data");

        weatherCard.appendChild(temp);
        weatherCard.appendChild(wind);
        weatherCard.appendChild(humidity);

        searchDisplayDays.appendChild(weatherCard);
    }
};


const loadInput = function () {
    const loadLocation = JSON.parse(localStorage.getItem('locations'));

    for (i = 0; i < loadLocation.length; i++) {
        loadData.push(loadLocation[i]);

    }
};


// Save Input
const saveInput = function () {

    localStorage.setItem('locations', JSON.stringify(loadData));
    
}


btnEl.addEventListener("click", formSubmitHandler);

loadInput();
displayRecentSearch();