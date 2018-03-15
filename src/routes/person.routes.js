import express from 'express';
let router = express.Router();
import * as persons from '../controllers/person.controller';

// Create a new Person
router.post('/api/persons', persons.create);

// Retrieve all Persons
router.get('/api/persons', persons.findAll);

// Retrieve a single Person with personId
router.get('/api/persons/:personId', persons.findOne);

// Update a Person with personId
router.put('/api/persons/:personId', persons.update);

// Delete a Person with personId
router.delete('/api/persons/:personId', persons.deleteOne);

export default router;