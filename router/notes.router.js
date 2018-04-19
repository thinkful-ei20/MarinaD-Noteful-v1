'use strict';
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

const express = require('express');
const router = express.Router();

router.use(express.json());

//PUT
router.put('/:id', (req, res, next)=>{
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title','content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj)
    .then( item => {
      if(item) {
        res.json(item);
      }
      else {
        next();
      }
    }).catch( err => {
      next(err);
    });
});

//GET
router.get('/', (req, res, next)=>{
  const searchTerm = req.query.searchTerm;
  notes.filter(searchTerm)
    .then( list => {
      if (list) {
        res.json(list);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
 

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id)
    .then( item => {
      if(item) {
        res.json(item);
      }
      else {
        next();
      }
    }).catch( err => {
      next(err);
    });
});

router.post('/', (req, res, next)=> {
  const {title, content} = req.body;

  const newItem = {title, content};

  if (!newItem.title) {
    const err = new Error('Missing `Title` in request body');
    err.status= 400;
    return next(err);
  }

  notes.create(newItem)
    .then (item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
      else {
        next();
      }
    }).catch( err => {
      next(err);
    });
});

router.delete('/:id', (req, res, next)=> {
  notes.delete(req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch( err => {
      next(err);
    });
});

module.exports = router;