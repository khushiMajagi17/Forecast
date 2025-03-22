const apikey = "f431392de6d6b572e9440a5c9d808d5d";

// On page load, get weather based on user's geolocation
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`; // Added units=metric

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    console.log('Weather Data:', data); // Debugging line
                    weatherReport(data);
                })
                .catch(error => console.error('Error:', error));
        });
    }
});

// Fetch and display weather data based on the city input
function searchByCity() {
    const place = document.getElementById('input').value;
    const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}&units=metric`; // Added units=metric

    fetch(urlsearch)
        .then(res => res.json())
        .then(data => {
            console.log('City Data:', data); // Debugging line
            weatherReport(data);
        })
        .catch(error => console.error('Error:', error));

    document.getElementById('input').value = '';
}

// Fetch detailed forecast data and update the UI
function weatherReport(data) {
    const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}&units=metric`; // Added units=metric

    fetch(urlcast)
        .then(res => res.json())
        .then(forecast => {
            console.log('Forecast Data:', forecast); // Debugging line
            hourForecast(forecast);
            dayForecast(forecast);

            document.getElementById('city').innerText = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').innerText = `${Math.floor(data.main.temp)} °C`; // Fixed conversion
            document.getElementById('clouds').innerText = data.weather[0].description;

            const icon1 = data.weather[0].icon;
            const iconurl = `https://api.openweathermap.org/img/w/${icon1}.png`;
            document.getElementById('img').src = iconurl;
        })
        .catch(error => console.error('Error:', error));
}

// Update the hourly forecast section of the UI
function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const date = new Date(forecast.list[i].dt * 1000);

        const hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        const div = document.createElement('div');
        const time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const temp = document.createElement('p');
        temp.innerText = `${Math.floor(forecast.list[i].main.temp_max)} °C / ${Math.floor(forecast.list[i].main.temp_min)} °C`; // Fixed conversion

        div.appendChild(time);
        div.appendChild(temp);

        const desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
    }
}

// Update the daily forecast section of the UI
function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = '';

    for (let i = 0; i < forecast.list.length; i += 8) {
        if (i >= 8) {  // Start after the first day to avoid the initial data point which might be incomplete
            const div = document.createElement('div');
            div.setAttribute('class', 'dayF');

            const day = new Date(forecast.list[i].dt * 1000);
            const dayText = day.toDateString(); // Gets the full date

            const date = document.createElement('p');
            date.setAttribute('class', 'date');
            date.innerText = dayText;
            div.appendChild(date);

            const temp = document.createElement('p');
            temp.innerText = `${Math.floor(forecast.list[i].main.temp_max)} °C / ${Math.floor(forecast.list[i].main.temp_min)} °C`; // Fixed conversion
            div.appendChild(temp);

            const description = document.createElement('p');
            description.setAttribute('class', 'desc');
            description.innerText = forecast.list[i].weather[0].description;
            div.appendChild(description);

            const humidity = document.createElement('p');
            humidity.setAttribute('class', 'humidity');
            humidity.innerText = `Humidity: ${forecast.list[i].main.humidity}%`;
            div.appendChild(humidity);

            const wind = document.createElement('p');
            wind.setAttribute('class', 'wind');
            wind.innerText = `Wind: ${forecast.list[i].wind.speed} km/h`;
            div.appendChild(wind);

            document.querySelector('.weekF').appendChild(div);
        }
    }
}
