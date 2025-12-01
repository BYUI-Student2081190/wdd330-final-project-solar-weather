// Toggle this to prod based on base URL
const ENV = window.location.hostname === "byui-student2081190.github.io";
const CONFIG = {
    baseUrl: ENV
    ? "PROD"
    : "DEV"
};

// Export CONFIG to be used in the code
export default CONFIG;