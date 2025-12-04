// Get imports for this file
import { getLocalStorage, isNumber, createAlertMessage, renderUsingTemplate, removeAllAlerts } from "./utils.mjs";

// Create the class to obtain Solar Data
export default class SolarWeather {
    
    constructor(lat, parentElement, dataSource) {
        // We only really need Latitude to keep it simple
        // The closer to the pole the easier it is to see a aurora
        this.lat = lat;
        this.parentElement = parentElement;
        this.dataSource = dataSource;
        this.visibility = ""; // Use this to save the overall visibility
    }

    // Function to init the class and object
    async init() {
        try {
            // Obtain the solar data
            const solarData = await this.dataSource.getSolarData();
            // If everything worked out send it to the new function
            this.generateDisplayAndVisibilityCheck(solarData);
        } catch (error) {
            console.log(`There was a problem with the Solar Weather API: ${error.message}`);
            removeAllAlerts(); // This is okay here because we will not run this until the weather API is done
            createAlertMessage("There was a problem with getting the Solar Weather, please be patient while we fix it.");
        }
    }

    // Function to obtain the data and check to see if area is able to see aurora
    generateDisplayAndVisibilityCheck(data) {
        // Check the lat and see if the aurora is visible
        if (isNumber(this.lat)) {
            // If the lat entered in the form is okay then use it
            this.setVisibility(data[0].kp_index, Number(this.lat));
        } else {
            // If they are not use the lat in local storage
            const localData = getLocalStorage("locationData");

            if (localData != null) {
                // If it does not come back null and actually has information in it
                // then use it
                this.setVisibility(data[0].kp_index, Number(localData.lat));
            } else {
                // Handle the alerts to the user
                // Clear all past alerts to make way for the new ones
                removeAllAlerts();
                createAlertMessage("You have no Latitude or Longitude data saved, please save some data with the set button.");
                if (!isNumber(this.lat)) {
                    createAlertMessage("Your entered Latitude is not a proper number or decimal.");
                };
            };
        };
        // Generate the data
        renderUsingTemplate(this.solarWeatherCardTemplate(data, this.visibility), this.parentElement);
    }

    // Function to set the visibility
    setVisibility(kp_index, lat) {
        // Create an array to hold messages based on what the data shows
        const messages = [
            "It is highly likely you can see it tonight.",
            "You may see faint traces of it tonight.",
            "It is unlikely you will see it tonight."
        ];
        // Create a switch case that handles the kp_index and the lat values to generate a message
        // to let the user know how likely an aurora is in their area
        switch (kp_index) {
            case 9: 
                if (lat >= 33) {
                    this.visibility = messages[0];
                } else if (lat < 33 && lat >= 20) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            case 8:
                if (lat >= 37) {
                    this.visibility = messages[0];
                } else if (lat >= 33 && lat < 37) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            case 7:
                if (lat >= 40) {
                    this.visibility = messages[0];
                } else if (lat >= 37 && lat < 40) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            case 6:
                if (lat >= 43) {
                    this.visibility = messages[0];
                } else if (lat >= 40 && lat < 43) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            case 5:
                if (lat >= 45) {
                    this.visibility = messages[0];
                } else if (lat >= 43 && lat < 45) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            case 4:
                if (lat >= 48) {
                    this.visibility = messages[0];
                } else if (lat >= 45 && lat < 48) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            case 3:
                if (lat >= 50) {
                    this.visibility = messages[0];
                } else if (lat >= 48 && lat < 50) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
                break;
            default:
                // This triggers for 2 and 1
                if (lat >= 54) {
                    this.visibility = messages[0];
                } else if (lat >= 50 && lat < 54) {
                    this.visibility = messages[1];
                } else {
                    this.visibility = messages[2];
                }
        }
    }

    // Function to create the card template
    solarWeatherCardTemplate(data, visibility) {
        return `
            <div class="solarWeatherCard">
                <h2>Current Solar Weather:</h2>
                <p>KP Index: ${data[0].kp_index}</p>
                <p>Estimated KP Index: ${data[0].estimated_kp}</p>
                <p>Date: ${data[0].time_tag.split("T")[0]}</p>
                <p>Time: ${data[0].time_tag.split("T")[1]} UTC</p>
                <p>Aurora Visibility: ${visibility}</p>
                <p class="notice">Note: Visibility also depends on how clear your skies are, check the weather below.</p>
            </div>
        `;
    }

}