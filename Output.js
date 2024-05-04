const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the base URL
const baseUrl = 'https://infopoint.ma/sante/pharmacie/pharmacie?page=';

// Define the total number of pages
const totalPages = 35;

// Generate the URLs dynamically
const urls = Array.from({ length: totalPages }, (_, i) => `${baseUrl}${i + 1}`);

(async () => {
    try {
        const data = [];

        // Map URLs to an array of promises
        const promises = urls.map(async (url) => {
            try {
                // Fetch webpage content
                const response = await axios.get(url);
                const html = response.data;

                // Load HTML content into Cheerio
                const $ = cheerio.load(html);

                // Extract data using Cheerio
                $('.info-box').each((index, element) => {
                    const name = $(element).find('.card-title b').text().trim();
                    const address = $(element).find('.info-adress').text().trim();
                    let telephone = $(element).find('.phone a').text().trim();
                    const mapLink = $(element).prev().find('a').attr('href');

                    if (!telephone) {
                        telephone = 'N/A';
                    }

                    data.push({ name, address, telephone, mapLink });
                });
            } catch (error) {
                console.error(`Error scraping ${url}: ${error.message}`);
            }
        });

        // Execute promises concurrently
        await Promise.all(promises);

        // Write data to a file
        fs.writeFileSync('output.json', JSON.stringify(data, null, 2), 'utf-8');

        console.log('Scraping completed successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
})();
//node Output.js