// Imports needed
import ExternalServices from "./ExternalServices.mjs";

// Function built to load a template and use it to create a text
// version of the html template to be used in creating the content
// for the parent element
async function loadTemplate(path) {
    const file = await fetch(path);
    const result = await file.text();
    return result;
}

// Function used to add the current year and last modified date to the footer of the page
function setModAndYear() {
    // Create a new date object to use
    const date = new Date();
    const copyrightyear = date.getFullYear();

    // Get the document last modified date
    const modDate = document.lastModified;

    // Get the parent elements
    const copyright = document.getElementById("copyright");
    const modified = document.getElementById("lastmodified");

    // Now set their text content to be the text we got
    copyright.textContent = copyrightyear;
    modified.textContent = modDate;
}

// Function used to create the event listners for the buttons in the header, and form
function setEventHandlers() {
    // Darkmode Handler
    const darkmode = document.getElementById("darkmode-toggle");
    darkmode.addEventListener("click", () => {
        // Add darkmode to body to provide CSS with a guide
        document.body.classList.toggle("darkmode");

        // Get the img inside the button
        const img = darkmode.getElementsByTagName("img")[0];

        // If darkmode is active change the picture in the button
        if (document.body.classList.contains("darkmode")) {
            img.setAttribute("src", "/images/moon-fill.svg");
            img.setAttribute("alt", "Dark Mode Icon");
            darkmode.setAttribute("aria-label", "Toggle Darkmode Off");
        } else {
            img.setAttribute("src", "/images/moon.svg");
            img.setAttribute("alt", "Light Mode Icon");
            darkmode.setAttribute("aria-label", "Toggle Darkmode On");
        };
    });
    // Hamburger Handler -- Add Later
    // LatAndLon Form Handler
    const latAndLonForm = document.getElementById("latandlon-form");
    latAndLonForm.addEventListener("submit", async (event) => {
        // Prevent the default action because we want to stay on this page
        event.preventDefault();

        // Get the values from the form
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;

        // Check to see if they are valid float values
        function isNumber(value) {
            const num = Number(value);
            return !isNaN(num);
        };

        if (isNumber(latitude) && isNumber(longitude)) {
            // Add local storage calls later, use confirm() to see if the user wants to save it to local storage. For now just get the api calls running
            const apiCall = new ExternalServices();
            const solarData = await apiCall.getSolarData();
            const mostRecent = solarData[solarData.length - 1];
            console.log(mostRecent);
            const weatherData = await apiCall.getWeatherDataWithLatLon(Number(latitude), Number(longitude));
            const forecastData = await apiCall.getWeatherForecast(weatherData.properties.forecast);
            console.log(forecastData);
            // Display the data to the home page just to show off the data
            const apiTestContainer = document.getElementById("testApiData");
            apiTestContainer.innerHTML = `
                <h1>Solar Data</h1>
                <p>Estimated kp: ${mostRecent.estimated_kp}</p>
                <p>kp: ${mostRecent.kp}</p>
                <p>kp Index: ${mostRecent.kp_index}</p>
                <p>Time Tag: ${mostRecent.time_tag}</p>
                <h1>Weather Forcast Data</h1>
                <p>DetailedForecast: ${forecastData.properties.periods[0].detailedForecast}</p>
                <p>End Time: ${forecastData.properties.periods[0].endTime}</p>
                <p>Name: ${forecastData.properties.periods[0].name}</p>
                <p>Short Forecast: ${forecastData.properties.periods[0].shortForecast}</p>
                <p>Temperature: ${forecastData.properties.periods[0].temperature}</p>
            `;
        } else {
            // Clear all past alerts to make way for the new ones
            removeAllAlerts();
            if (!isNumber(latitude)) {
                createAlertMessage("Your entered Latitude is not a proper number or decimal.");
            };

            if (!isNumber(longitude)) {
                createAlertMessage("Your entered Longitude is not a proper number or decimal.");
            };
        };
    });
}

// Function built to render the object with a template to save
// to the parent element in the document
export async function renderUsingTemplate(template, parentElement, data, callback, clear = true) {
    // If clear is true we need to remove all the children from the parent element, this happens on default
    if (clear) {
        parentElement.replaceChildren();
    };

    // Now add the template data to the parentElement
    parentElement.innerHTML = template;

    // Now check if callback is not empty use it
    if (callback) {
        callback(data);
    };
}

// Function to create alert messages for the user
export function createAlertMessage(message, scroll = true) {
    // Create the div to be the alert
    const alert = document.createElement("div");
    alert.classList.add("alert");

    // Create a close icon for the alert
    const close = document.createElement("span");
    close.textContent = "X";

    // Add the message to the alert
    alert.innerHTML = `<p>${message}</p>`;
    alert.appendChild(close);

    // Add event listner to close icon
    close.addEventListener("click", () => {
        main.removeChild(alert);
    });

    const main = document.querySelector("main");
    main.prepend(alert);

    // If scroll is true put us back at the top
    if (scroll) {
        window.scrollTo(0,0);
    };
}

// Function to remove all alert messages
export function removeAllAlerts() {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach(alert => {
        document.querySelector("main").removeChild(alert);
    });
}

// Function to create the header, footer, nav, and lat lon form dynamically
export async function loadHeaderFooterNavLatLonForm() {
    // Render the templates
    const headerContent = await loadTemplate('../partials/header.html');
    const navContent = await loadTemplate('../partials/nav.html');
    const latLonContent = await loadTemplate('../partials/latlonform.html');
    const footerContent = await loadTemplate('../partials/footer.html');

    // Get the parent elements
    const header = document.getElementById("siteHeader");
    const nav = document.getElementById("siteNav");
    const latlonContainer = document.getElementById("latandlon-container");
    const footer = document.getElementById("siteFooter");

    // Render them all
    renderUsingTemplate(headerContent, header);
    renderUsingTemplate(navContent, nav);
    renderUsingTemplate(latLonContent, latlonContainer);
    renderUsingTemplate(footerContent, footer);

    // Set the ModAndYear after all this has ran
    setModAndYear();
    setEventHandlers();
}