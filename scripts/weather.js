// Import needed things into file
import { loadHeaderFooterNavLatLonForm, isDarkModeActive, openLoadingScreen, closeLoadingScreen } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import Weather from "./Weather.mjs";

// Create the header, nav, form, and footer
loadHeaderFooterNavLatLonForm().then(() => {
    // After the first task is completed, move on to the next one
    isDarkModeActive();

    // Create a click event on the button to get the data
    document.getElementById("obtainData").addEventListener("click", () => {
        // Open Loading Screen
        openLoadingScreen();

        // Create the elements needed for the rest of the page
        const parentElement = document.querySelector(".weatherContainer");
        const lat = document.getElementById("latitude").value;
        const lon = document.getElementById("longitude").value;
        const dataSource = new ExternalServices();
        const weatherGenerator = new Weather(lat, lon, parentElement, dataSource, true);

        // Call the function for the weather display
        weatherGenerator.init().then( () => {
            closeLoadingScreen();
        });
    });
});