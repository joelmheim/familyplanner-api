import Event from '../models/event.model';
import Person from '../models/person.model';

const handleError = (res, err, errMessage) => {
  console.log(err);
  if(err.kind === 'ObjectId') {
    return res.status(404).send({ message: errMessage + err });                
  }
  return res.status(500).send({ message: errMessage + err });
};

export function save(res, event) {
  event.save()
    .then((saved) => {
      console.log('Event saved: ', saved);
      res.send({
        message: 'Event saved successfully!'
      });
    })
    .catch((error) => {
      handleError(res, error, 'There was an error saving this event.');
    });
}

export function create(req, res) {
  // Create and Save a new Event
  if(!req.body.start) {
    return res.status(400).send({ message: 'Event start cannot be empty.' });
  }

  const event = new Event({
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    activity: req.body.activity
  });

  Person.findById(req.body.actor)
    .then(person => {
      console.log('Event create, found person: ', person);
      event.actor = person._id;

      if (req.body.helper && req.body.helper != {}) {
        Person.findById(req.body.helper)
          .then(person => {
            event.helper = person._id;
            save(res, event);
          })
          .catch(err => {
            console.log('Helper not found with id: ' + req.body.helper + err);
          });
      } else {
        save(res, event);
      }
    })
    .catch(err => { 
      console.log('Actor not found with id: ' + req.body.actor + err);
      res.status(500).send({ message: 'Cannot save event without actor.'} );
    }); 
}

export function findAll(req, res) {
  // Retrieve and return all events from the database.
  Event.find()
    .populate('actor')
    .populate('helper')
    .then(events => {
      res.send(events);
    })
    .catch((err) => {
      handleError(res, err, 'There was an error retrieving events.');
    });
}

export function findOne(req, res) {
  // Find a single events with a eventId
  Event.findById(req.params.eventId)
    .populate('actor')
    .populate('helper') 
    .then(event => {
      if(!event) {
        return res.status(404).send({message: 'Event not found with id ' + req.params.eventId});            
      }
      res.send(event);
    })
    .catch((err) => {
      handleError(res, err, 'Error retrieving event with id ' + req.params.eventId);
    });
}

export function update(req, res) {
  // Update an event identified by the eventId in the request
  Event.findById(req.params.eventId)
    .then(event => {
      if (!event) {
        return res.status(404).send({message: 'Event not found with id ' + req.params.eventId});
      }
      Person.findById(req.body.actor)
        .then(person => {
          event.actor = person._id;
          if (req.body.helper && req.body.helper != {}) {
            Person.findById(req.body.helper)
              .then(person => {
                event.helper = person._id;
                save(res, event);
              })
              .catch(err => {
                console.log('Helper not found with id: ' + req.body.helper + err);
              });
          } else {
            save(res, event);
          }
        })
        .catch(err => { 
          console.log('Actor not found with id: ' + req.body.actor + err);
          res.status(500).send({ message: 'Cannot save event without actor.'} );
        });
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
      handleError(res, err, 'Error retrieving event with id ' + req.params.eventId);   
    });
}

export function deleteOne(req, res) {
  // Delete an event with the specified eventId in the request
  Event.findByIdAndRemove(req.params.eventId)
    .then(event => {
      if(!event) {
        return res.status(404).send({message: 'Event not found with id ' + req.params.eventId});
      }
      res.send({message: 'Event deleted successfully!'});
    })
    .catch(err => {
      handleError(res, err, 'Could not delete event with id ' + req.params.eventId);
    });
}