import Person from '../models/person.model';

const handleError = (res, err, errMessage) => {
  console.log(err);
  if(err.kind === 'ObjectId') {
    return res.status(404).send({ message: errMessage });                
  }
  return res.status(500).send({ message: errMessage });
};

export function create(req, res) {
  // Create and Save a new Note
  if(!req.body.name) {
    return res.status(400).send({ message: 'Person name cannot be empty.' });
  }

  new Person({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.body.image
  }).save()
    .then((saved) => {
      console.log('Person saved: ', saved);
      res.send({
        message: 'Person saved successfully!'
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: 'There was an error saving this person.'
      });
    });
}

export function findAll(req, res) {
  // Retrieve and return all persons from the database.
  Person.find()
    .then((persons) => {
      res.send(persons);
    })
    .catch((err) => {
      handleError(res, err, 'There was an error retrieving persons.');
    });
}

export function findOne(req, res) {
  // Find a single person with a personId
  Person.findById(req.params.personId) 
    .then((person) => {
      if(!person) {
        return res.status(404).send({message: 'Person not found with id ' + req.params.personId});            
      }
      res.send(person);
    })
    .catch((err) => {
      handleError(res, err, 'Error retrieving person with id ' + req.params.personId);
    });
}

export function update(req, res) {
  // Update a person identified by the personId in the request
  Person.findById(req.params.personId)
    .then(person => {
      if (!person) {
        return res.status(404).send({message: 'Person not found with id ' + req.params.personId});
      }
      person.name = req.body.name;
      person.email = req.body.email;
      person.phone = req.body.phone;
      person.image = req.body.image;      

      person.save()
        .then((saved) => {
          console.log('Person saved: ', saved);
          res.send({
            message: 'Person saved successfully!'
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({
            message: 'There was an error saving this person.'
          });
        });
    })
    .catch(err => {
      handleError(err, 'Error retrieving person with id ' + req.params.personId);   
    });
}

export function deleteOne(req, res) {
  // Delete a person with the specified personId in the request
  Person.findByIdAndRemove(req.params.personId)
    .then(person => {
      if(!person) {
        return res.status(404).send({message: 'Person not found with id ' + req.params.personId});
      }
      res.send({message: 'Person deleted successfully!'});
    })
    .catch(err => {
      handleError(res, err, 'Could not delete person with id ' + req.params.personId);
    });
}