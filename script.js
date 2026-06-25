async function getData(e) {
    e.preventDefault();
    let loadingElem = document.getElementById("loading");


    let textboxElem = document.getElementById("textBox");
    let city = textboxElem.value.trim();
    if (city == "") {
        alert("please enter city name")
        return;
    }

    loadingElem.style.display = "block";

    let api = `https://api.weatherapi.com/v1/forecast.json?key=76a368caa21646d7b5740739251402&q=${city}`;
    try {
        let res = await fetch(api);
        let data = await res.json();
        display(data)
    }
    catch (err) {
        alert("please check city name");
    }
    finally {
        loadingElem.style.display = "none";
        textboxElem.value = "";
    }
}

function display(data) {

    let { location, current, forecast } = data;
    let dailyForecast = forecast.forecastday[0].hour;
    let sevenDay = forecast.forecastday;


    let htmlCode = `
        <div class="col-md-8">
            <div class="weather-card main-card mb-4">
                <div class="d-flex justify-content-between">
                    <div>
                        <h2 class="fw-bold">${location.name}</h2>
                        <p class="text-secondary">Chance of rain: ${sevenDay[0].day.daily_chance_of_rain}%</p>
                        <h1 class="display-1 fw-bold mt-4">${current.temp_c}°</h1>
                    </div>
                    <div>
                        <img src="${current.condition.icon}" width="150" alt="weather-icon">
                    </div>
                </div>

                <div class="mt-5">
                    <p class="text-uppercase small text-secondary fw-bold">Today's Forecast</p>
                    <div class="d-flex justify-content-between text-center overflow-auto">
                        ${[6, 9, 12, 15, 18, 21].map(hour => {
        let icon = dailyForecast[hour].condition.icon;
        let temp = dailyForecast[hour].temp_c;
        return `
                                <div class="forecast-item">
                                    <span class="small text-secondary">${hour}:00 ${hour < 12 ? 'AM' : 'PM'}</span>
                                    <img src="${icon}" width="40" class="d-block mx-auto my-2">
                                    <span class="fw-bold">${temp}°</span>
                                </div>
                            `;
    }).join('')}
                    </div>
                </div>
            </div>

            <div class="weather-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <p class="text-uppercase small text-secondary fw-bold m-0">Air Conditions</p>
                </div>
                <div class="row g-3">
                    <div class="col-6">
                        <p class="text-secondary mb-1 small">Real Feel</p>
                        <h4 class="fw-bold">${current.feelslike_c}°</h4>
                    </div>
                    <div class="col-6">
                        <p class="text-secondary mb-1 small">Wind</p>
                        <h4 class="fw-bold">${current.wind_kph} km/h</h4>
                    </div>
                    <div class="col-6">
                        <p class="text-secondary mb-1 small">Chance of rain</p>
                        <h4 class="fw-bold">${sevenDay[0].day.daily_chance_of_rain}%</h4>
                    </div>
                    <div class="col-6">
                        <p class="text-secondary mb-1 small">UV Index</p>
                        <h4 class="fw-bold">${current.uv}</h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="weather-card h-100">
                <p class="text-uppercase small text-secondary fw-bold mb-4">7-Day Forecast</p>
                ${sevenDay.map(day => {
        let dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        return `
                        <div class="d-flex justify-content-between align-items-center border-bottom border-secondary py-3">
                            <span class="text-secondary">${dayName}</span>
                            <div class="d-flex align-items-center">
                                <img src="${day.day.condition.icon}" width="30">
                                <span class="ms-2 fw-bold">${day.day.condition.text}</span>
                            </div>
                            <div>
                                <span class="fw-bold">${day.day.maxtemp_c}</span>
                                <span class="text-secondary">/${day.day.mintemp_c}</span>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
    document.getElementById("ref").innerHTML = htmlCode;
}




