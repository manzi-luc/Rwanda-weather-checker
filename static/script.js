let allCities = [];
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
        
        allCities = weatherData;

        console.log("All cities:", allCities);
        console.log("Number of cities: ",allCities.length);
        
        drawWeather();



        message.textContent = "Weather data Loaded successfully!";

    } catch (error) {
    message.textContent = error.message;
    console.error("Weather Loading failed: ",error);

    }
    
}

loadWeather();

document.getElementById("search-input").addEventListener("input", drawWeather);
document.getElementById("filter-select").addEventListener("change",drawWeather);
document.getElementById("sort-select").addEventListener("change",drawWeather);

function drawWeather() {
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("filter-select");
    const sortSelect = document.getElementById("sort-select")

    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const sortValue = sortSelect.value;


let filteredCities = allCities.filter(city => {
    return city.city.toLowerCase().includes(searchText);

});

console.log("filtered cities: ", filteredCities);
console.log("Filtered count:",filteredCities.length);

// Weather filters

if (filterValue === "rainy") {
    filteredCities = filteredCities.filter(city => {
        return city.rain > 0 ||
        (typeof city.rain === "object" && city.rain !== null && city.rain["1h"] > 0);

    });

}
else if (filterValue == "warm") {
    filteredCities = filteredCities.filter(city =>{
        return !city.error && city.temperature > 22;
    });
}
else if (filterValue === "cool") {
    filteredCities = filteredCities.filter(city =>{
        return !city.error && city.temperature <= 22;

    });
}



    // Sorting

    if (sortValue === "name") {
        filteredCities.sort((a,b) => {
            return a.city.localeCompare(b.city);
        });
    }

    else if (sortValue === "hottest") {
        filteredCities = filteredCities.filter(city => !city.error);
        filteredCities.sort((a,b)=> b.temperature - a.temperature);

        }

    
    else if (sortValue === "coolest") {
        filteredCities = filteredCities.filter(city => !city.error);
        filteredCities.sort((a,b) => a.temperature - b.temperature);


        }

    // Display weather cards

    const container = document.getElementById("weather-container");

    container.innerHTML = "";

    if (filteredCities.length === 0) {
        container.textContent = "NO cities match your search and filter."
        return;
    }
    
    console.log("About to create cards: ",filteredCities.length)

    filteredCities.forEach(element => {
            const card = document.createElement("div");
            card.className = "weather-card";
    console.log("Creating card for: ",element.city);

        card.innerHTML = `
        <h2>${element.city}</h2>
        <h3>${element.temperature}°C</h3>
        <p> Feels like: ${element.feels_like}°C</p>
        <p> Humidity: ${element.humidity}%</p>
        <p> Wind speed: ${element.wind_speed}m/s</p>
        <p> Description: ${element.description}</p>
        `;

        container.appendChild(card);
        console.log("Card added: ",element.city)
    });

}


