const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
chai.use(chaiHttp);

const app = require('../server.js');
const Person = require('../app/models/person.model');

before(function (done) {
  mongoose.connect('mongodb://localhost:27017/test');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', function() {
    console.log('We are connected to test database!');
    done();
  });
});
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function() {
  // we're connected!

  describe('Person module', () => {
  //  beforeEach((done) => {
  //    mongoose.connection.db.dropDatabase(done)
  //  });

    describe('Create Person', () => {
      it('Returns a 200 response', (done) => {
        chai.request(app)
            .post('/api/persons')
            .send({
              name: 'John Doe',
              email: 'johndoe@example.com',
              phone: '1-800 999',
              image: 'images/test.jpg'
            })
            .then(response => {
              // Now let's check our response
              expect(response).to.have.status(200);
              done();
            })
            .catch(done);
      });

      it('Creates a person document in our DB', (done) => {
        chai.request(app)
            .post('/api/persons')
            .send({
              name: 'John Doe',
              email: 'johndoe@example.com',
              phone: '1-800 999',
              image: 'images/test.jpg'
            })
            .then(() => {
              return Person.find({
                       email: 'johndoe@example.com'
                     });
              })
              .then(result => {
                expect(result).to.have.lengthOf(1);

                const person = result[0];
                expect(person.name).to.be.equal('John Doe');
                done();
              })
              .catch(done);
      });
    });
  //});
});