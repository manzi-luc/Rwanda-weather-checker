async function loadWeather() {
    const message = document.getElementById("message");
    const container = document.getElementById("weather-container")

    try{
        message.textContent = "loading weather data...";

        const response = await fetch("/weather");

        if (!response.ok) {
            throw new Error ("Could not load weather data");

        }

        const weatherData = await response.json();

        console.log("Weather data:",weatherData);

        container.innerHTML = "";

        weatherData.forEach(element => {
            const card = document.createElement("div");
            card.className = "weather-card";

            if (element.error) {
                card.textContent = element.city + ": Data unavailable";

            }else{
                card.innerHTML = `
                <h2>${element.city}</h2>
                <h3>${element.temperature}°C</h3>
                <p>Feels like:${element.feels_like}°C</p>
                <p>Humidity:${element.humidity}%</p>
                <p>Wind speed:${element.wind_speed}m/s</p>
                <p>Description:${element.description}</p>
                ${element.rain && typeof element.rain === "object"&& element.rain["1h"] > 0? `<p>Rain: ${element.rain["1h"]}mm</p>`
                : ""}

            `;

            }
            
            container.appendChild(card);
        });

        message.textContent = "Weather data Loaded successfully!";

    } catch (error) {
    message.textContent = error.message;
    console.error("Weather Loading failed: ",error);

    }
    
}

loadWeather();

