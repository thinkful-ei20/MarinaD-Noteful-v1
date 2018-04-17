'use strict';

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const {PORT} = require('./config');
const {logger} = require('./middleware/logger');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const app = express();


app.use(express.static('public'));
app.use(express.json());

app.use(logger);

app.put('/api/notes/:id', (req, res, next)=>{
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title','content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.get('/api/notes', (req, res, next)=>{
  const searchTerm = req.query.searchTerm;
  notes.filter(searchTerm, (err, list)=> {
    
    if (!err && list) {
      res.json(list);
    }
    next(err);
  });
});  
  

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id, (err, note) => {

    if (!err && note) {
      res.json(note);
    }    
    next(err);
    
  });
  // const returnData = data.find(item=> item.id === Number(id));
  // if (!returnData) next();
  // res.json(returnData);
});

//to be deleted
app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

//error handling

app.use(function (req, res, next) {
  const err = new Error ('Not Found');
  err.status = 404;
  next(err); 
});

app.use (function (err, req, res, next) {
  if (err.status === 404) {
    res.status(404).json({message: 'Not Found'});
  }
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err=> {console.error(err);});