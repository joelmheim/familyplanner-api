import express from 'express';
let router = express.Router();
import * as events from '../controllers/event.controller';

// Create a new Event
router.post('/api/events', events.create);

// Retrieve all Events
router.get('/api/events', events.findAll);

// Retrieve a single Event with eventId
router.get('/api/events/:eventId', events.findOne);

// Update a Event with eventId
router.put('/api/events/:eventId', events.update);

// Delete a Event with eventId
router.delete('/api/events/:eventId', events.deleteOne);

export default router;