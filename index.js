const uAPI = require('./entry');
const config = require('./config');
const express = require('express');
const cors = require("cors")

const app = express()
app.use(cors({
    origin:"http://localhost:5173"
}))
const AirService = uAPI.createAirService(
    {
        auth: config,
        debug: 2,
        production: true,
    }
);
app.use(express.json());


const params = {
    legs: [
        {
            from: 'WAW',
            to: 'AMS',
            departureDate: '2023-12-29',
        },
    ],
    passengers: {
        ADT: 1,
        /*
         CNN:1,
         INF: 1,
         INS: 1, //infant with a seat
         */
    },
    permittedCarriers: ['LO'],
    cabins: ['Economy'], // ['Business'],
    bookingCodes: ['Q', 'G'],
    requestId: '4e2fd1f8-2221-4b6c-bb6e-cf05c367cf60',
    // permittedConnectionPoints: ['AMS'],
    // preferredConnectionPoints: ['KBP'],
    // prohibitedConnectionPoints: ['DME', 'SVO', 'PAR'],
    // maxJourneyTime: 300,
    // pricing: {
    // currency: 'USD',
    // eTicketability: true,
    // },
};


// Create a route to handle SOAP requests
app.post('/availability', async (req, response) => {
    try {
        AirService.availability(params)
            .then(
                res => { return response.json(res) },
                err => { return response.json(err) }
            );
    } catch (error) {
        response.status(500).send('Internal Server Error', error.message);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 3000');
})