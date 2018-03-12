const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const db = mongoose.connection;
chai.use(chaiHttp);

const app = require('../server.js');
const Person = require('../app/models/event.model');
let testActor = {};

before(function (done) {
  mongoose.connect('mongodb://localhost:27017/test');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', function() {
    console.log('We are connected to test database!');
    testActor = new Person({
      _id: mongoose.Types.ObjectId(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1-800 999',
      image: 'images/test.jpg'
    }).save()
    .then((saved) => {
      done();
    })
    .catch((error) => {
      done(error);
    });
  });
  
});
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
  // we're connected!

  describe('Event module', () => {
    beforeEach((done) => {
      mongoose.connection.db.dropDatabase(done)
    });

    describe('Create Event', () => {
      it('Returns a 200 response', (done) => {
        chai.request(app)
            .post('/api/events')
            .send({
              actor: testActor._id,
              start: new Date(2018,2,20),
              end: new Date(2018,2,21),
              activity: { name: "Reise", description: "Jobbreise", location: "Stavanger, Bergen" }
            })
            .then(response => {
              // Now let's check our response
              expect(response).to.have.status(200);
              done();
            })
            .catch(done);
      });

      it('Creates an event document in our DB', (done) => {
        chai.request(app)
            .post('/api/events')
            .send({
              actor: testActor._id,
              start: new Date(2018,2,20),
              end: new Date(2018,2,21),
              activity: { name: "Reise", description: "Jobbreise", location: "Stavanger, Bergen" }
            })
            .then(() => {
              return Event.find();
            })
            .then(result => {
              expect(result).to.have.lengthOf(1);

              const event = result[0];
              expect(event.activity.name).to.be.equal('Reise');
              done();
            })
            .catch(done);
      });
    });
  //});
});