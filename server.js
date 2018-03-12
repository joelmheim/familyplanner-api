const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Routes
//const person = require('routes/person');

// create express app
const app = express();
const port = process.env.PORT || 3333;
const mongoHost = process.env.MONGODB_URI || 'mongodb://localhost:27017/fp-dev';

// This connects to our MongoDB instance
mongoose.connect(mongoHost);

const db = mongoose.connection;
db.on('error', () =>  {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

db.once('open', function() {
    console.log("Successfully connected to the database");
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// define a simple route
app.get('/', (req, res) => {
  res.json({"message": "Welcome to FamilyPlanner application. Plan and share events with your family group. Find the data at /api."});
});

// Require routes
require('./app/routes/person.routes.js')(app);
require('./app/routes/event.routes.js')(app);

// listen for requests
app.listen(port, () => {
  console.log(chalk.green(`Dev API running on port ${port}`));
});

module.exports = app;