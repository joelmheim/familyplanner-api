import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index.js';

let expect = chai.expect;
chai.use(chaiHttp);

describe('Root Route', () => {
  it('Returns a 200 response', (done) => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        if (error) done(error);
        // Now let's check our response
        expect(response).to.have.status(200);
        done();
      });
  });

  it('Returns a "Welcome" message', (done) => {
    chai.request(app)
      .get('/')
      .then(response => {
        expect(response.body).to.be.deep.equal({
          message: 'Welcome to FamilyPlanner application. Plan and share events with your family group. Find the data at /api.'
        });
        done();
      })
      .catch(done);
  });
});

// describe('API route', () => {
//   it('Returns a 200 response', (done) => {
//     chai.request(app) 
//         .get('/api')
//         .end((error, response) => {
//           if (error) done(error);
//           expect(response).to.have.status(200);
//           done();
//         });
//   });

//   it('Returns a message', (done) => {
//     chai.request(app)
//         .get('/api')
//         .then(response => {
//           expect(response.body).to.be.deep.equal({
//             message: 'Hooray! Welcome to our api! Stay tuned...!'
//           });
//           done();
//         })
//         .catch(done);
//   });
// });