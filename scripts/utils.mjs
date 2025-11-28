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
}