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