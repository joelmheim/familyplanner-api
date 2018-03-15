import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import * as config from './config';
import persons from './routes/person.routes';
import events from './routes/event.routes';

mongoose.Promise = global.Promise;

// create express app
let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// This connects to our MongoDB instance
mongoose.connect(config.mongoHost);

const db = mongoose.connection;
db.on('error', () =>  {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});

db.once('open', function() {
  console.log('Successfully connected to the database');
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// define a simple route
app.get('/', (req, res) => {
  res.json({'message': 'Welcome to FamilyPlanner application. Plan and share events with your family group. Find the data at /api.'});
});

// Set up routes
app.use('/', persons);
app.use('/', events);

// listen for requests
app.listen(config.port, () => {
  console.log(chalk.green(`Dev API running on port ${config.port}`));
});

export default app;