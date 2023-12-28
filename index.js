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




// // Create a route to handle SOAP requests
// app.get('/galileo-available', async (req, response) => {
//     let params = {
//         legs: [
//             {
//                 from: 'WAW',
//                 to: 'AMS',
//                 departureDate: '2023-12-29',
//             },
//         ],
//         passengers: {
//             ADT: 1,
//             /*
//              CNN:1,
//              INF: 1,
//              INS: 1, //infant with a seat
//              */
//         },
//         permittedCarriers: ['LO'],
//         cabins: ['Economy'], // ['Business'],
//         bookingCodes: ['Q', 'G'],
//         requestId: '4e2fd1f8-2221-4b6c-bb6e-cf05c367cf60',
//         // permittedConnectionPoints: ['AMS'],
//         // preferredConnectionPoints: ['KBP'],
//         // prohibitedConnectionPoints: ['DME', 'SVO', 'PAR'],
//         // maxJourneyTime: 300,
//         pricing: {
//             currency: 'USD',
//             eTicketability: true,
//         },
//         pricing: {
//             currency: 'USD', // Currency to convert results prices
//             eTicketability: true, // Detect if pricing solution will be ticketable as e-ticket
//         },
//         includeFare: true,
//     };

//     try {
//         AirService.availability(params)
//             .then(
//                 res => { return response.log(res); },
//                 err => { return response.json(err) }
//             );
//     } catch (error) {
//         response.status(500).send('Internal Server Error', error.message);
//     }
// });

//1.  Create a route to handle SOAP requests, to fetch the available flights and fares.
app.get('/shop', async (req, response) => {
    const params = {
        legs: [
            {
                from: 'KHI',
                to: 'DXB',
                departureDate: '2024-03-30'
            },
        ],
        passengers: {
            ADT: 1,
        },
        cabins: ['Economy'],
        pricing: {
            currency: 'PKR',
        },
        includeFare: true,
    };

    AirService.shop(params)
        .then(
            data => {
                response.json({ shopData: data });
            },
            err => response.json({ shopDataError: err })
        )
        .catch(err => {
            console.error(err);
            response.json({ error: 'An unexpected error occurred.' });
        });
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