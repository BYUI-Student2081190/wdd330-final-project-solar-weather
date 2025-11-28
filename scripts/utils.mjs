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
}

// Function used to add the current year and last modified date to the footer of the page
export function setModAndYear() {
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