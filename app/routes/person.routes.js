module.exports = (app) => {

    var persons = require('../controllers/person.controller.js');

    // Create a new Person
    app.post('/api/persons', persons.create);

    // Retrieve all Persons
    app.get('/api/persons', persons.findAll);

    // Retrieve a single Person with personId
    app.get('/api/persons/:personId', persons.findOne);

    // Update a Person with personId
    app.put('/api/persons/:personId', persons.update);

    // Delete a Person with personId
    app.delete('/api/persons/:personId', persons.delete);
}