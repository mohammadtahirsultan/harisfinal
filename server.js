const express = require('express');
const soap = require('soap');
const fs = require('fs');
const path = require('path');
// const { http } = require('strong-soap');
const http = require("http")
const app = express();
const bodyParser = require("body-parser")

var url = 'https://emea.universal-api.travelport.com/B2BGateway/connect/uAPI/AirService';
var args = { name: 'value' };

const username = 'Universal API/uAPI6290180356-f61fbf5c';
const password = '9o?CL_6gjS';

// Create the SOAP client with credentials
soap.createClientAsync(url, { wsdl_headers: { Authorization: 'Basic ' + Buffer.from('Universal API/uAPI6290180356-f61fbf5c:9o?CL_6gjS').toString('base64') } })
    .then((client) => {
        return client.MyFunctionAsync(args);
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error('SOAP Error:', error.message);
    });
// async/await
// var client = await soap.createClientAsync(url);
// var result = await client.MyFunctionAsync(args);
// console.log(result[0]);

var myService = {
    MyService: {
        MyPort: {
            MyFunction: function (args) {
                return {
                    name: args.name
                };
            },

            // This is how to define an asynchronous function with a callback.
            MyAsyncFunction: function (args, callback) {
                // do some work
                callback({
                    name: args.name
                });
            },

            // This is how to define an asynchronous function with a Promise.
            MyPromiseFunction: function (args) {
                return new Promise((resolve) => {
                    // do some work
                    resolve({
                        name: args.name
                    });
                });
            },

            // This is how to receive incoming headers
            HeadersAwareFunction: function (args, cb, headers) {
                return {
                    name: headers.Token
                };
            },

            // You can also inspect the original `req`
            reallyDetailedFunction: function (args, cb, headers, req) {
                console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
                return {
                    name: headers.Token
                };
            }
        }
    }
};

var xml = require('fs').readFileSync('Air.wsdl', 'utf8');

//http server example
var server = http.createServer(function (request, response) {
    response.end('404: Not Found: ' + request.url);
});

server.listen(8000);
soap.listen(server, '/wsdl', myService, xml, function () {
    console.log('server initialized');
});


//body parser middleware are supported (optional)
app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));
app.listen(8001, function () {
    //Note: /wsdl route will be handled by soap module
    //and all other routes & middleware will continue to work
    soap.listen(app, '/wsdl', myService, xml, function () {
        console.log('server initialized');
    });
});