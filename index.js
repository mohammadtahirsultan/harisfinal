const uAPI = require('./entry');
const config = require('./config');
const express = require('express');
const cors = require("cors")
const book = require("./book")

const app = express()
app.use(cors({
    origin: "http://localhost:5173"
}))
let AirService = uAPI.createAirService(
    {
        auth: config,
        debug: 2,
        production: true,
    }
);
app.use(express.json());


// -----------------   ONE WAY REQUEST  -----------------------
//1.  Create a route to handle SOAP requests, to fetch the available flights and fares.
app.get('/shop-oneway', async (req, response) => {
    const params = {
        legs: [
            {
                from: 'MUX',
                to: 'DXB',
                departureDate: '2024-03-30'
            },
            {
                from: 'MUX',
                to: 'LHR',
                departureDate: '2024-03-30',
            },
        ],
        passengers: {
            ADT: 1,
        },
        cabins: ['Economy'],
        pricing: {
            currency: 'USD',
            // eTicketability: true,
        },
    };


    AirService.shop(params).then(
        data => { return response.json(data) },
        err => { return response.json(err) }
    );

});


// -----------------   ROUND TRIP REQUEST  -----------------------
app.get('/shop-rounded', async (req, response) => {
    const params = {
        legs: [
            {
                from: 'MUX',
                to: 'DXB',
                departureDate: '2024-03-30'
            },
            {
                from: 'DXB',
                to: 'MUX', // Return leg
                departureDate: '2024-04-05', // Adjust the return date as needed
            },
        ],

        passengers: {
            ADT: 1,
        },
        cabins: ['Economy'],
        pricing: {
            currency: 'USD',
            // eTicketability: true,
        },
    };


    AirService.shop(params).then(
        data => { return response.json(data) },
        err => { return response.json(err) }
    );

});


// 2. now we have to book the flight
// before booking we need to fetch the fare rules, to check if the flight is refundable or not and other things too
app.get('/fare-rules', async (req, response) => {
    // Assume you have received the shop data or fetch it from the shop API
    const shopDataResponse = await fetch('http://localhost:5000/shop');
    const shopData = await shopDataResponse.json();
    
    // Extract necessary information
    const forwardSegments = shopData['0'].directions['0']['0'].segments;
    const backSegments = shopData['0'].directions['1']['0'].segments;

    const fareRulesParams = {
        segments: forwardSegments.concat(backSegments),
        passengers: { ADT: 1 }, // Update with actual passenger information
        long: true,
        requestId: 'test',
    };

    // Make the fare rules request
    AirService.fareRules(fareRulesParams)
        .then(
            fareRules => response.json({ fareRules : fareRules }),
            err => response.json({ fareRulesError: err })
        )
        .catch(err => {
            console.error(err);
            response.json({ error: 'An unexpected error occurred.' });
        });
});



// 3. now we have to book the flight

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})