import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import sslRedirect from 'heroku-ssl-redirect';
import mongoose from 'mongoose';
import * as config from './config';
import persons from './routes/person.routes';
import events from './routes/event.routes';
//import auth from './routes/auth.routes';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';

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

// redirect to tls. Uses status 302 in production to redirect to https
app.use(sslRedirect());

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

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://familyplanner.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://familyplanner-api.herokuapp.com/',
  issuer: 'https://familyplanner.eu.auth0.com/',
  algorithms: ['RS256']
});

const checkScopes = jwtAuthz(['read:events', 'read:persons']);

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
//app.use('/', auth);
app.use('/', checkJwt, checkScopes, persons);
app.use('/', checkJwt, checkScopes, events);

// listen for requests
app.listen(config.port, () => {
  console.log(chalk.green(`Dev API running on port ${config.port}`));
});

export default app;
