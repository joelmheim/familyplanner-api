module.exports = (app) => {

    var events = require('../controllers/event.controller.js');

    // Create a new Event
    app.post('/api/events', events.create);

    // Retrieve all Events
    app.get('/api/events', events.findAll);

    // Retrieve a single Event with eventId
    app.get('/api/events/:eventId', events.findOne);

    // Update a Event with eventId
    app.put('/api/events/:eventId', events.update);

    // Delete a Event with eventId
    app.delete('/api/events/:eventId', events.delete);
}