// URLs to APIs
const solarURL = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';
const weatherURL = 'https://api.weather.gov/points/';

// Function to convert the data to JSON data
async function convertToJson(res) {
    const jsonRes = await res.json();
    if (res.ok) {
        return jsonRes;
    } else {
        throw { name: "servicesError", message: jsonRes};
    };
}

// Export the class to be used by the rest of the program
export default class ExternalServices {

    constructor() {
        // There is nothing in here. We just have it in case.
    }

    async getSolarData() {
        const response = await fetch(solarURL);
        const data = await convertToJson(response);
        return data;
    }

    // Obtain the weather data with the latitude and longitude
    async getWeatherDataWithLatLon(latitude, longitude) {
        const response = await fetch(`${weatherURL}${latitude},${longitude}`);
        const data = await convertToJson(response);
        return data;
    }

    // Obtain the weather forecast
    async getWeatherForecast(forecastURL) {
        const response = await fetch(forecastURL);
        const data = await convertToJson(response);
        return data;
    }
}