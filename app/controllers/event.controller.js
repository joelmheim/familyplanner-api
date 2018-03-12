const mongoose = require('mongoose');
const Event = require('../models/event.model.js');
const Person = require('../models/person.model.js');

const handleError = (err, errMessage) => {
  console.log(err);
  if(err.kind === 'ObjectId') {
    return res.status(404).send({ message: "Event not found with id " + req.params.eventId });                
  }
  return res.status(500).send({ message: errMessage });
};

const save = (res, event) => {
  event.save()
  .then((saved) => {
    console.log('Event saved: ', saved);
    res.send({
      message: 'Event saved successfully!'
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send({
      message: 'There was an error saving this event.'
    });
  });
};

module.exports.create = (req, res) => {
  // Create and Save a new Event
  if(!req.body.start) {
    return res.status(400).send({ message: "Event start cannot be empty." });
  }

  const event = new Event({
    start: Date.parse(req.body.start),
    end: Date.parse(req.body.end),
    activity: req.body.activity
  });

  Person.findById(req.body.actor)
        .then(person => {
          event.actor = person._id;
          event.save()
          .then((saved) => {
            console.log('Event saved: ', saved);
            res.send({
              message: 'Event saved successfully!'
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({
              message: 'There was an error saving this event.'
            });
          });
        })
        .catch(err => { 
          console.log("No person found with id: " + req.body.actor);
          res.status(500).send({ message: 'Cannot save event without actor.'} );
        });
  

};

module.exports.findAll = (req, res) => {
  // Retrieve and return all events from the database.
  Event.find()
    .populate('actor')
    .then(events => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'There was an error retrieving events.'
      });
    });
};

module.exports.findOne = (req, res) => {
  // Find a single events with a eventId
  Event.findById(req.params.eventId)
    .populate('actor') 
    .then(event => {
      if(!event) {
        return res.status(404).send({message: "Event not found with id " + req.params.eventId});            
      }
      res.send(event);
    })
    .catch((err) => {
      handleError(err, "Error retrieving event with id " + req.params.eventId);
    });
};

module.exports.update = (req, res) => {
  // Update an event identified by the eventId in the request
  Event.findById(req.params.eventId)
    .then(event => {
      if (!event) {
        return res.status(404).send({message: "Event not found with id " + req.params.eventId});
      }
      event.actor = populatePerson(req.body.actorId);
      if (req.body.helperId) {
        event.helper = populatePerson(req.body.helperId);
      }
      event.start = Date.parse(req.body.start);
      event.end = Date.parse(req.body.end);
      event.activity = req.body.activity;      
      event.save()
      .then((saved) => {
        console.log('Event saved: ', saved);
        res.send({
          message: 'Event saved successfully!'
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({
          message: 'There was an error saving this event.'
        });
      });
    })
    .catch(err => {
      handleError(err, "Error retrieving event with id " + req.params.eventId);   
    });
};

module.exports.delete = (req, res) => {
  // Delete an event with the specified eventId in the request
  Event.findByIdAndRemove(req.params.eventId)
    .then(event => {
      if(!event) {
        return res.status(404).send({message: "Event not found with id " + req.params.eventId});
      }
      res.send({message: "Event deleted successfully!"});
    })
    .catch(err => {
      handleError(err, "Could not delete event with id " + req.params.eventId);
    });
};