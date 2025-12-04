// Imports needed
import CONFIG from "./config.mjs";

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
            // Set different for dev and prod
            if (CONFIG.baseUrl === "PROD") {
                img.setAttribute("src", "images/moon-fill.svg");
            } else {
                img.setAttribute("src", "../images/moon-fill.svg");
            };
            img.setAttribute("alt", "Dark Mode Icon");
            darkmode.setAttribute("aria-label", "Toggle Darkmode Off");
            // Set the darkmode setting
            const userData = getLocalStorage("userSettings");
            userData.darkmode = true;
            setLocalStorage("userSettings", userData);
        } else {
            // Set different for dev and prod
            if (CONFIG.baseUrl === "PROD") {
                img.setAttribute("src", "images/moon.svg");
            } else {
                img.setAttribute("src", "../images/moon.svg");
            };
            img.setAttribute("alt", "Light Mode Icon");
            darkmode.setAttribute("aria-label", "Toggle Darkmode On");
            // Set the darkmode setting
            const userData = getLocalStorage("userSettings");
            userData.darkmode = false;
            setLocalStorage("userSettings", userData);
        };
    });
    // Hamburger Handler -- Add Later
    // LatAndLon Form Handler
    if (window.location.pathname.includes("weather.html") || window.location.pathname.includes("night-sky.html")) {
        const latAndLonForm = document.getElementById("latandlon-form");
        latAndLonForm.addEventListener("submit", async (event) => {
            // Prevent the default action because we want to stay on this page
            event.preventDefault();

            // Get the values from the form
            const latitude = document.getElementById("latitude").value;
            const longitude = document.getElementById("longitude").value;

            if (isNumber(latitude) && isNumber(longitude)) {
                // Check to see if the user wants to save the lat and lon data before it is used
                // NOTE: Maybe as an extra thing create a dialog modle to style and use instead
                const userConfirm = confirm("Would you like to save these values to use again?");

                // If they agree it saves it in local storage
                if (userConfirm) {
                    // Add to local storage if this checks out
                    const latLonData = {
                        lat: latitude,
                        lon: longitude
                    };
                    setLocalStorage("locationData", latLonData);
                };
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
}

// Function built to obtain the page name and use it to add things to prod pages to help site work
function setBaseURLOnProd() {
    const path = window.location.pathname;
    
    // Check to see if the path contains weather.html or night-sky.html
    if (path.includes("weather.html") || path.includes("night-sky.html")) {
        // Now add the base element to the head of these pages
        const head = document.querySelector("head");
        const baseEle = document.createElement("base");
        baseEle.setAttribute("href", "/wdd330-final-project-solar-weather/");
        head.appendChild(baseEle);
    };
}

// Function used to create user data if local storage returns null
function createNewUserData() {
    // On default the site will make darkmode false, add more later as seen fit
    const userData = {
        darkmode: false
    };
    // Return the default object
    return userData;
}

// Check to see if they are valid float values
export function isNumber(value) {
    if (value.trim() === "") {
        return false;
    } else {
        const num = Number(value);
        return !isNaN(num);
    };
}

// Function to save to local storage
export function setLocalStorage(key, value) {
    // Save the value to the key in local storage
    // NOTE: Only objects are saved to local storage at those keys
    localStorage.setItem(key, JSON.stringify(value));
}

// Function to load in from local storage
export function getLocalStorage(key, defaultReturn = null) {
    // Place this in a try catch to keep it safe
    try {
        const dataStr = localStorage.getItem(key);
        if (dataStr === null) { return defaultReturn };
        const data = JSON.parse(dataStr);
        return data;
    } catch (error) {
        console.log(`Error parsing value from local storage at key, ${key}: ${error.message}`);
        return defaultReturn;
    };
}

// Create a function that runs when a page is loaded. When it is loaded check to see in local storage if
// darkmode is set to true
export function isDarkModeActive() {
    // Call local storage to obtain the user data
    const userData = getLocalStorage("userSettings");

    if (userData != null) {
        const darkmodeValue = userData.darkmode;

        // If darkmode value is true do this and set the site to darkmode automatically
        if (darkmodeValue) {
            // Set the body to dark mode and update the header image
            const darkmode = document.getElementById("darkmode-toggle");
            // Add darkmode to body to provide CSS with a guide
            document.body.classList.toggle("darkmode");

            // Get the img inside the button
            const img = darkmode.getElementsByTagName("img")[0];
            if (CONFIG.baseUrl === "PROD") {
                img.setAttribute("src", "images/moon-fill.svg");
            } else {
                img.setAttribute("src", "../images/moon-fill.svg");
            };
            img.setAttribute("alt", "Dark Mode Icon");
            darkmode.setAttribute("aria-label", "Toggle Darkmode Off");
        };
    } else {
        // If this comes back as null create the default object and save it to local storage
        const newUserData = createNewUserData();
        setLocalStorage("userSettings", newUserData);
    };
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
    // Get the parent elements
    const header = document.getElementById("siteHeader");
    const nav = document.getElementById("siteNav");
    const latlonContainer = document.getElementById("latandlon-container");
    const footer = document.getElementById("siteFooter");

    // Render the templates based on if we are in prod or dev to make development easier
    if (CONFIG.baseUrl === "PROD") {
        // If we are in the weather.html or night-sky.html set this first before we go on
        setBaseURLOnProd();

        // This means we are in production
        const headerContent = await loadTemplate('partials/header.html');
        const navContent = await loadTemplate('partials/nav.html');
        if (window.location.pathname.includes("weather.html") || window.location.pathname.includes("night-sky.html")) {
            const latLonContent = await loadTemplate('partials/latlonform.html');
            renderUsingTemplate(latLonContent, latlonContainer);
        };
        const footerContent = await loadTemplate('partials/footer.html');

        // Render them all
        renderUsingTemplate(headerContent, header);
        renderUsingTemplate(navContent, nav);
        renderUsingTemplate(footerContent, footer);
    } else {
        // This means we are in dev
        const headerContent = await loadTemplate('../partials/header-dev.html');
        const navContent = await loadTemplate('../partials/nav-dev.html');
        if (window.location.pathname.includes("weather.html") || window.location.pathname.includes("night-sky.html")) {
            const latLonContent = await loadTemplate('../partials/latlonform.html');
            renderUsingTemplate(latLonContent, latlonContainer);
        };
        const footerContent = await loadTemplate('../partials/footer.html');

        // Render them all
        renderUsingTemplate(headerContent, header);
        renderUsingTemplate(navContent, nav);
        renderUsingTemplate(footerContent, footer);
    };

    // Set the ModAndYear after all this has ran
    setModAndYear();
    setEventHandlers();
}