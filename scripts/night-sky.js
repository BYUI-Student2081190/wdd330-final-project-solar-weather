// Import needed things into file
import { loadHeaderFooterNavLatLonForm, isDarkModeActive, openLoadingScreen, closeLoadingScreen } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import SolarWeather from "./SolarWeather.mjs";
import Weather from "./Weather.mjs"; // Make sure to run this before SolarWeather because it has the lat and lon checks

// Create the header, nav, form, and footer
loadHeaderFooterNavLatLonForm().then(() => {
    // After the first task is completed, move on to the next one
    isDarkModeActive();

    // Create the click event on the get data button
    document.getElementById("obtainData").addEventListener("click", () => {
        // Open loading screen
        openLoadingScreen();
        // Create a new ExtrenalServices to use in the program
        const dataSource = new ExternalServices();
        // Obtain the lat and lon from the document
        const lat = document.getElementById("latitude").value;
        const lon = document.getElementById("longitude").value;
        // Obtain the parentElements
        const solarParentElement = document.querySelector(".solarWeatherContainer");
        const weatherParentElement = document.querySelector(".weatherContainer");

        // Create weather object
        const WeatherGen = new Weather(lat, lon, weatherParentElement, dataSource); // This defaults to false so we only get the weather card

        // Init the weather object
        WeatherGen.init().then(() => {
            // If everything was okay during the weather generation check it and move on
            if (WeatherGen.success) {
                // Create the solar weather object
                const SolarWeatherGen = new SolarWeather(lat, solarParentElement, dataSource);
                // Init the SolarWeatherGen
                SolarWeatherGen.init();
            }
            // Close the loading screen
            closeLoadingScreen();
        });
    });
});