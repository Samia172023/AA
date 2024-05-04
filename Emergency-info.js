const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the URL
const url = 'https://infopoint.ma/pharmacies-de-garde';

// Function to extract the name without Arabic characters
function extractName(name) {
    const regex = /^[^\u0600-\u06FF]*/;
    const matches = name.match(regex);
    if (matches) {
        return matches[0].trim();
    } else {
        return name;
    }
}

// Function to scrape data and update file
async function scrapeAndUpdate() {
    try {
        console.log('Scraping data...');

        // Fetch webpage content
        const response = await axios.get(url);
        const html = response.data;

        console.log('Webpage content fetched:', html);

        // Load HTML content into Cheerio
        const $ = cheerio.load(html);
        
        const data = [];

        // Extract data using Cheerio
        $('.col-xs-12.col-sm-6.col-md-4.col-lg-4.map-block.hidden-xs.hidden-sm.img-map').each((index, element) => {
            console.log('Processing element:', element);

            const anchor = $(element).find('a');
            const googleMapsLink = anchor.attr('href');

            // Extract coordinates from the Google Maps link
            const coordinates = extractCoordinatesFromLink(googleMapsLink);
            
            if (coordinates) {
                const { latitude, longitude } = coordinates;

                // Extract name
                let nameElement = $(element).next('.info-box').find('h4.card-title b');
                let name = nameElement.text().trim();

                // Check if name starts with "Pharmacie"
                if (name.startsWith('Pharmacie')) {
                    name = name.replace('Pharmacie', 'Pharmacy');
                } else if (!name.startsWith('Pharmacy')) {
                    name = `Pharmacy ${name}`;
                }

                // Extract address and phone number
                const addressElement = $(element).next('.info-box').find('.info-con');
                const address = addressElement && addressElement.attr('title') ? addressElement.attr('title').trim() : '';
                const phoneNumberElement = $(element).next('.info-box').find('.phone a');
                let phoneNumber = phoneNumberElement ? phoneNumberElement.text().trim() : '';
                phoneNumber = formatPhoneNumber(phoneNumber); // Format phone number

                // Extracted name without Arabic characters
                const extractedName = extractName(name);

                data.push({ name: extractedName, address, phoneNumber, latitude, longitude });
            }
        });

        console.log('Data extracted:', data);

        // Write data to a file
        fs.writeFileSync('outputEmergency.json', JSON.stringify(data, null, 2), 'utf-8');

        console.log('Data updated successfully.');
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

// Function to extract coordinates from Google Maps link
function extractCoordinatesFromLink(link) {
    const regex = /https:\/\/www\.google\.com\/maps\/place\/\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*/;
    const matches = link.match(regex);
    if (matches && matches.length === 3) {
        const latitude = parseFloat(matches[1]);
        const longitude = parseFloat(matches[2]);
        return { latitude, longitude };
    } else {
        return null;
    }
}

// Function to format phone number
function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace('+212 05', '+212 5');
}

// Schedule scraping and updating every 8 hours
setInterval(scrapeAndUpdate, 8 * 60 * 60 * 1000);

// Call scrapeAndUpdate when the server starts
scrapeAndUpdate();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//node Emergency-info.js 