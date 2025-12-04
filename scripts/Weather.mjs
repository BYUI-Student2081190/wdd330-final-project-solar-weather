// Get imports for this file
import { getLocalStorage, isNumber, createAlertMessage, renderUsingTemplate, removeAllAlerts } from "./utils.mjs";

// Create a class to handle all the interactions with the site here
export default class Weather {

    constructor (lat, lon, parentElement, dataSource, forecast = false) {
        // These are rules to let the weather.mjs know what to do
        this.lat = lat;
        this.lon = lon;
        this.parentElement = parentElement;
        this.dataSource = dataSource;
        this.forecast = forecast;
        this.forecastCards = [];
    }

    async init() {
        // Start by testing the lat and lon see if they can be used
        if (isNumber(this.lat) && isNumber(this.lon)) {
            // Check to see if they are both numbers if so use them.
            const forecastURL = await this.dataSource.getWeatherDataWithLatLon(this.lat, this.lon);
            this.weatherDisplay(forecastURL);
        } else {
            // If they are not numbers do not use and try to use local storage
            const localData = getLocalStorage("locationData");

            if (localData != null) {
                // If it does not come back null and actually has information in it
                // then use it
                const forecastURL = await this.dataSource.getWeatherDataWithLatLon(localData.lat, localData.lon);
                this.weatherDisplay(forecastURL);
            } else {
                // Handle the alerts to the user
                // Clear all past alerts to make way for the new ones
                removeAllAlerts();
                createAlertMessage("You have no Latitude or Longitude data saved, please save some data with the set button.");
                if (!isNumber(this.lat)) {
                    createAlertMessage("Your entered Latitude is not a proper number or decimal.");
                };

                if (!isNumber(this.lon)) {
                    createAlertMessage("Your entered Longitude is not a proper number or decimal.");
                };
            };
        };
    }

    async weatherDisplay(URL) {
        // Wrap this in a try catch in case we get a 404 back from the server
        try {
            // Get the area location from the api
            const areaLocationContainer = document.getElementById("areaNameContainer");
            const areaLocation = document.createElement("h2");
            areaLocation.textContent = `Location: ${URL.properties.relativeLocation.properties.city}, ${URL.properties.relativeLocation.properties.state}`;
            // Clear it first
            areaLocationContainer.replaceChildren();
            // Then add the location
            areaLocationContainer.appendChild(areaLocation);
            // Because we have made it here, get the actual forecast data
            const forecast = await this.dataSource.getWeatherForecast(URL.properties.forecast);
            // Use the template based on if it is currently day or not
            if (forecast.properties.periods[0].isDaytime) {
                // Set the forecast cards to the right array for the indexs
                this.forecastCards = [2, 4, 6, 8];
                renderUsingTemplate(this.weatherCardTemplateDay(forecast, 0), this.parentElement);
            } else {
                this.forecastCards = [1, 3, 5, 7];
                renderUsingTemplate(this.weatherCardTemplateNight(forecast, 0), this.parentElement);
            }
            
            // Now if we need to create the forcast cards get ready to do that
            if (this.forecast) {
                // Create the div to hold the forcast
                const forecastContainer = document.createElement("div");
                forecastContainer.classList.add("forecastContainer");
                // Create a button to display the four day forecast
                const displayButton = document.createElement("button");
                displayButton.setAttribute("type", "button");
                displayButton.setAttribute("aria-label", "Show Four Day Forecast");
                displayButton.textContent = "View Forecast";
                displayButton.classList.add("forecastShow");
                displayButton.addEventListener("click", () => {
                    // First clear the div
                    forecastContainer.replaceChildren();
                    // Now create a variable to hold all the html data
                    let forecastHtmlData = "";
                    // Create the cards and place them within their own div
                    this.forecastCards.forEach(index => {
                        forecastHtmlData += this.weatherCardTemplateForecast(forecast, index);
                    });
                    // Now add the innerHTML to the div
                    forecastContainer.innerHTML = forecastHtmlData;
                });
                this.parentElement.appendChild(displayButton);
                this.parentElement.appendChild(forecastContainer);
            }
        } catch (error) {
            // Display the error so the user knows what happened
            console.log(`Lat and Lon not valid points for API: ${error.message}`);
            removeAllAlerts();
            createAlertMessage("The Latitude and Longitude you entered was not in the U.S. please enter a new one.");
        }
    }

    // This one also gets used for the normal forcast cards too
    weatherCardTemplateDay(data, index) {
        return `
        <div class="weatherCard">
            <h2>Current Weather</h2>
            <img src="${data.properties.periods[index].icon}" alt="${data.properties.periods[index].shortForecast}">
            <p>Forecast: ${data.properties.periods[index].shortForecast}</p>
            <p>Temp: ${data.properties.periods[index].temperature} F°</p>
            <p>Precipitation Chance: ${data.properties.periods[index].probabilityOfPrecipitation.value}%</p>
            <p>Wind Direction: ${data.properties.periods[index].windDirection}</p>
            <p>Wind Speed: ${data.properties.periods[index].windSpeed}</p>
            <p class="bold">At Night:</p>
            <p>Forecast: ${data.properties.periods[index + 1].shortForecast}</p>
            <p>Temp: ${data.properties.periods[index + 1].temperature} F°</p>
            <p>Precipitation Chance: ${data.properties.periods[index + 1].probabilityOfPrecipitation.value}%</p>
            <p>Wind Direction: ${data.properties.periods[index + 1].windDirection}</p>
            <p>Wind Speed: ${data.properties.periods[index + 1].windSpeed}</p>
        </div>
        `;
    }

    weatherCardTemplateForecast(data, index) {
        return `
        <div class="weatherCard">
            <h2>${data.properties.periods[index].name}</h2>
            <img src="${data.properties.periods[index].icon}" alt="${data.properties.periods[index].shortForecast}">
            <p>Forecast: ${data.properties.periods[index].shortForecast}</p>
            <p>Temp: ${data.properties.periods[index].temperature} F°</p>
            <p>Precipitation Chance: ${data.properties.periods[index].probabilityOfPrecipitation.value}%</p>
            <p>Wind Direction: ${data.properties.periods[index].windDirection}</p>
            <p>Wind Speed: ${data.properties.periods[index].windSpeed}</p>
            <p class="bold">At Night:</p>
            <p>Forecast: ${data.properties.periods[index + 1].shortForecast}</p>
            <p>Temp: ${data.properties.periods[index + 1].temperature} F°</p>
            <p>Precipitation Chance: ${data.properties.periods[index + 1].probabilityOfPrecipitation.value}%</p>
            <p>Wind Direction: ${data.properties.periods[index + 1].windDirection}</p>
            <p>Wind Speed: ${data.properties.periods[index + 1].windSpeed}</p>
        </div>
        `;
    }

    weatherCardTemplateNight(data, index) {
        return `
        <div class="weatherCard">
            <h2>Current Weather</h2>
            <img src="${data.properties.periods[index].icon}" alt="${data.properties.periods[index].shortForecast}">
            <p>Forecast: ${data.properties.periods[index].shortForecast}</p>
            <p>Temp: ${data.properties.periods[index].temperature} F°</p>
            <p>Precipitation Chance: ${data.properties.periods[index].probabilityOfPrecipitation.value}%</p>
            <p>Wind Direction: ${data.properties.periods[index].windDirection}</p>
            <p>Wind Speed: ${data.properties.periods[index].windSpeed}</p>
        </div>
        `;
    }
}