const uAPI = require('./entry');
const config = require('./config');
const express = require('express');
const cors = require("cors")
const book = require("./book");
const bodyParser = require('body-parser');

const app = express()

// MiddleWares 
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Starting the Game of Travelport 
let AirService = uAPI.createAirService(
    {
        auth: config,
        debug: 2,
        production: true,
    }
)


// -----------------   ONE WAY REQUEST  -----------------------
//1.  Create a route to handle SOAP requests, to fetch the available flights and fares.
app.post('/shop-oneway', async (req, response) => {
    try {
        console.log("I am body", req.body);
        let { from, to, departureDate } = req.body;

        if (!from || !to || !departureDate) {
            return response.status(400).json({ error: 'Missing required parameters' });
        }
        const params = {
            legs: [
                {
                    from,
                    to,
                    departureDate,
                },
            ],
            passengers: {
                ADT: 1,
            },
            cabins: ['Economy'],
            pricing: {
                currency: 'PKR',
            },
        };

        const data = await AirService.shop(params);
        return response.json(data);
    } catch (err) {
        console.error('Error:', err);
        return response.status(500).json({ error: `${err.name}` });
    }
});

// -----------------   ROUND TRIP REQUEST  -----------------------
app.post('/shop-rounded', async (req, response) => {
    try {
        const { from, to, departureDate, returnDate } = req.body;

        if (!from || !to || !departureDate || !returnDate) {
            return response.status(400).json({ error: 'Missing required parameters' });
        }

        const params = {
            legs: [
                {
                    from,
                    to,
                    departureDate,
                },
                {
                    from: to, // Swap 'from' and 'to' for the return leg
                    to: from,
                    departureDate: returnDate, // Use the provided returnDate
                },
            ],
            passengers: {
                ADT: 1,
            },
            cabins: ['Economy'],
            pricing: {
                currency: 'PKR',
                // eTicketability: true,
            },
        };

        const data = await AirService.shop(params);
        return response.json(data);
    } catch (err) {
        console.error('Error:', err);
        return response.status(500).json({ error: 'An error occurred' });
    }
});



// -----------------   Multi City Request  -----------------------
app.post('/shop-multi', async (req, response) => {
    try {
        const { from, to, departureDate, returnDate } = req.body;

        if (!from || !to || !departureDate || !returnDate) {
            return response.status(400).json({ error: 'Missing required parameters' });
        }

        const params = {
            legs: [
                {
                    from,
                    to,
                    departureDate,
                },
                {
                    from: to, // Swap 'from' and 'to' for the return leg
                    to: from,
                    departureDate: returnDate, // Use the provided returnDate
                },
            ],
            passengers: {
                ADT: 1,
            },
            cabins: ['Economy'],
            pricing: {
                currency: 'PKR',
                eTicketability: true,
            },
        };

        const data = await AirService.shop(params);
        return response.json(data);
    } catch (err) {
        console.error('Error:', err);
        return response.status(500).json({ error: 'An error occurred' });
    }
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
            fareRules => response.json({ fareRules: fareRules }),
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