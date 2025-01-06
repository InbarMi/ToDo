/* File: back-end/app.js
 * Description: This file initializes and configures the Express application server.
 * Author: Inbar Milstein
 * Date: Summer 2024
 */

// command to run from back-end folder: node app.js

// import required modules
const express = require("express"); // module that creates the server and handles routing, middleware and HTTP requests
const morgan = require("morgan"); // middleware for logging HTTP requests
const bodyParser = require('body-parser'); // middleware to parse incoming request bodies
const cors = require("cors"); // middleware to enable CORS to handle requests from different origins
const path = require('path'); // node.js module to work with file and directory paths
process.env.NODE_ENV = 'development';  // "test" or "development" environment

// create instance of an Express application
const app = express();

// custom middleware for logging every incoming request's HTTP method and url
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Shows HTTP requests in the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded formatted POST requests
// allows access to data from a POST request via req.body
app.use(bodyParser.urlencoded({ extended: true }))

// CORS allows requests from any origin (e.g., from the front-end)
app.use(cors());

// serve static files from specified directory
app.use(express.static(path.join(__dirname, '../front-end')));

// define route for handling GET requests at http://localhost:8080/ and serve index.html to client
app.get('/', function (req, res)
{
    res.sendFile(path.join(__dirname, '../front-end', 'index.html'));
    console.log('Hello world, the server is running correctly!');
});

// The routes defined in ./routes/tasks.js will be listened by the server
app.use('/', require('./routes/tasks'));

// Start the server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`TODO app is at http://localhost:${PORT}`);
});

module.exports = app;
