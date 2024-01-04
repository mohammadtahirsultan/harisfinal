const uAPI = require('./entry');
const config = require('./config');
const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const { connectDB } = require('./src/database/db');
const walletRoutes = require('./src/routes/wallet');

const app = express()

// MiddleWares 
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
connectDB()
app.use("/wallet", walletRoutes)

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
        let { from, to, departureDate, cabin } = req.body;

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
            cabins: [cabin],
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
        return response.status(500).json({ error: 'An error occurred', err });
    }
});

// -----------------   Multi City Request  -----------------------
app.post('/shop-multi', async (req, response) => {
    try {
        const { routes } = req.body;

        console.log(req.body);
        if (!Array.isArray(routes) || routes.length === 0) {
            return response.status(400).json({ error: 'Invalid or empty routes array' });
        }

        const legs = routes.map(route => ({
            from: route.from,
            to: route.to,
            departureDate: route.depart,
        }));
        const params = {
            // legs: [

            //     {
            //         from: 'MUX',
            //         to: 'DXB',
            //         departureDate: '2024-02-10'
            //     },
            //     {
            //         from: 'DXB',
            //         to: 'MUX',
            //         departureDate: '2024-02-20'
            //     },
            //     {
            //         from: 'MUX',
            //         to: 'JFK',
            //         departureDate: '2024-02-24'
            //     },
            // ],
            legs,
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
        return response.status(500).json({ error: 'An error occurred', err });
    }
});

// -----------------   BOOKING REQUEST  -----------------------
app.get('/book', async (req, response) => {
    try {
        const params = {
            legs: [
                {
                    from: 'JFK',
                    to: 'LHR',
                    departureDate: '2024-02-22',
                },
                // {
                //     from: 'LHR',
                //     to: 'JFK',
                //     departureDate: '2024-02-10',
                // },
            ],
            passengers: {
                ADT: 1,
            },
            requestId: 'test-request',
            platingCarier: 'VS'
        };

        const results = await AirService.shop(params);

        if (!results) {
            return response.status(400).json('No flights found for given parameters');
        }

        // Check if the results contain an error
        if (results.error) {
            return response.status(500).json({ error: 'An error occurred', details: results.error });
        }

        const fromSegments = results?.[0]?.directions?.[0]?.[0]?.segments || [];
        const toSegments = results?.[0]?.directions?.[1]?.[0]?.segments || [];

        // return response.json({ fromSegments, toSegments, results })
        let book = {
            segments: fromSegments.concat(toSegments),
            // segments: [
            //     {
            //         departure: '2024-02-25T00:20:00.000-05:00',
            //         arrival: '2024-02-25T12:00:00.000+00:00',
            //         airline: 'TP',
            //         from: 'EWR',
            //         to: 'OPO',
            //         flightNumber: '212',
            //         plane: 'K',
            //         serviceClass: 'Economy',
            //         fareBasisCode: 'KL0BSI03',
            //         group: '0',
            //         bookingClass: 'K',
            //     },
            //     {
            //         departure: '2024-02-26T07:45:00.000+00:00',
            //         arrival: '2024-02-26T10:00:00.000+00:00',
            //         airline: 'TP',
            //         from: 'OPO',
            //         to: 'LGW',
            //         flightNumber: '1328',
            //         plane: 'K',
            //         serviceClass: 'Economy',
            //         fareBasisCode: 'KL0BSI03',
            //         group: '0',
            //         bookingClass: 'K',
            //     },
            // ],
            rule: 'SIP',
            passengers: [
                {
                    lastName: 'Smith',
                    firstName: 'John',
                    passCountry: 'US',
                    passNumber: 'S12345678',
                    birthDate: '1984-01-01',
                    gender: 'M',
                    ageCategory: 'ADT',
                },
            ],
            phone: {
                countryCode: '1',
                location: 'DEN',
                number: '123456789',
            },
            allowWaitlist: true,
        };

        const res = await AirService.book(book);
        return response.json(res);
    } catch (err) {
        console.log('Error:', err);
        return response.status(500).json({ error: 'An error occurred', err });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})