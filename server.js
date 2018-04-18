'use strict';

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


const {PORT} = require('./config');

console.log('Hello Noteful!');

const express = require('express');
const app = express();

const morgan = require('morgan');
const notesRouter = require('./router/notes.router');

app.use(express.static('public'));

app.use(morgan('dev'));

app.use('/api/notes', notesRouter);

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