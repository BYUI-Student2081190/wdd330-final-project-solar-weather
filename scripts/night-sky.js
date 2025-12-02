// Import needed things into file
import { loadHeaderFooterNavLatLonForm, isDarkModeActive } from "./utils.mjs";

// Create the header, nav, form, and footer
loadHeaderFooterNavLatLonForm().then(() => {
    // After the first task is completed, move on to the next one
    isDarkModeActive();
});