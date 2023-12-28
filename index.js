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


let params = {
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
    pricing: {
    currency: 'USD',
    eTicketability: true,
    },
    pricing: {
        currency: 'USD', // Currency to convert results prices
        eTicketability: true, // Detect if pricing solution will be ticketable as e-ticket
    },
    includeFare: true,
};


// Create a route to handle SOAP requests
app.get('/galileo-available', async (req, response) => {
    try {
        AirService.availability(params)
            .then(
                res => { return console.log(res); },
                err => { return response.json(err) }
            );
    } catch (error) {
        response.status(500).send('Internal Server Error', error.message);
    }
});



app.get('/galileo-fares', async (req, response) => {
    try {
        // Create a new instance of the fare service
        const FareService = uAPI.createFareService({
            auth: config,
            debug: 2,
            production: true,
        });

        // Define parameters for the fare request
        const fareParams = {
            // Specify the fare-related parameters (e.g., fare basis code, passenger type, etc.)
            // ...
        };

        // Make a request to the fare service
        FareService.getFareInfo(fareParams)
            .then(
                res => { return response.json(res) },
                err => { return response.json(err) }
            );
    } catch (error) {
        response.status(500).send('Internal Server Error', error.message);
    }
});




params = {
    legs: [
        {
            from: 'WAW',
            to: 'AMS',
            departureDate: '2023-12-29',
        },
        // {
        //     from: 'PAR',
        //     to: 'IEV',
        //     departureDate: '2023-12-30',
        // },
    ],
    passengers: {
        ADT: 1,
    },
    // requestId: 'test-request',
    // platingCarier: 'PS'
};

app.get('/book', async (req, response) => {

    AirService.shop(params)
        .then(
            (results) => {
                const fromSegments = results['0'].directions['0']['0'].segments;
                const toSegments = results['0'].directions['1']['0'].segments;

                const book = {
                    segments: fromSegments.concat(toSegments),
                    rule: 'SIP',
                    passengers: [{
                        lastName: 'SKYWALKER',
                        firstName: 'ANAKIN',
                        passCountry: 'UA',
                        passNumber: 'ES221731',
                        birthDate: '1968-07-25',
                        gender: 'M',
                        ageCategory: 'ADT',
                    }],
                    phone: {
                        countryCode: '38',
                        location: 'IEV',
                        number: '0660419905',
                    },
                    deliveryInformation: {
                        name: 'Anakin Skywalker',
                        street: 'Sands street, 42',
                        zip: '42042',
                        country: 'Galactic Empire',
                        city: 'Mos Eisley',
                    },
                    allowWaitlist: true,
                };

                return AirService.book(book).then(
                    res => { return response.json(res) },
                    err => { return response.json(err) }
                );
            }
        )
        .catch(
            err => { return response.json(err) }
        )
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})