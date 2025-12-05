// Import needed things into file
import { loadHeaderFooterNavLatLonForm, isDarkModeActive } from "./utils.mjs";

// Create the header, nav, form, and footer
loadHeaderFooterNavLatLonForm().then(() => {
    // After the first task is completed, move on to the next one
    isDarkModeActive();
});

// Get the image elements
const images = document.querySelector(".image-slider").querySelectorAll("img");
let currentIndex = 0;

// Create a click event for the images
document.querySelector(".image-slider").addEventListener("click", () => {
    // Get the current image
    const currentImg = images[currentIndex];

    let nextIndex = currentIndex + 1;

    if (currentIndex === images.length - 1) {
        nextIndex = 0;
    }

    const nextImg = images[nextIndex];

    // Remove the class from the currentImg
    currentImg.classList.remove("activeImage");

    // Force the browser to paint before fading away
    requestAnimationFrame(() => {
        currentImg.classList.add("slide-away");
    });

    // Get the next image to load in
    nextImg.classList.add("activeImage");

    // When the animation ends clean it up
    currentImg.addEventListener("animationend", () => {
        currentImg.classList.remove("slide-away");
    }, { once: true });

    // Update Current Index for the next click
    currentIndex = nextIndex;
});