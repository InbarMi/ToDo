const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const path = require('path');

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Shows HTTP requests in the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
// this will allow us to access data from a POST request
app.use(bodyParser.urlencoded({ extended: true }))

// CORS allows requests from any origin (e.g., from the front-end)
app.use(cors());

app.use(express.static(path.join(__dirname, '../front-end')));

// Called for GET request at http://localhost:8080/
app.get('/', function (req, res)
{
    res.sendFile(path.join(__dirname, '../front-end', 'index.html'));
    console.log('Hello world, the server is running correctly!');
});


// The routes defined in ./routes/tasks.js will be listened by the server
app.use('/', require('./routes/tasks'));


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
