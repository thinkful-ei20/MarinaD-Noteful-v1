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

//GET
router.get('/', (req, res, next)=>{
  const searchTerm = req.query.searchTerm;
  notes.filter(searchTerm, (err, list)=> {
    
    if (!err && list) {
      res.json(list);
    }
    next(err);
  });
});  
  

router.get('/:id', (req, res, next) => {
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

router.post('/', (req, res, next)=> {
  const {title, content} = req.body;

  const newItem = {title, content};

  if (!newItem.title) {
    const err = new Error('Missing `Title` in request body');
    err.status= 400;
    return next(err);
  }

  notes.create(newItem, (err, item)=> {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    }
    else {
      next();
    }
  });
});

module.exports = router;