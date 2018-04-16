'use strict';

const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res)=>{
  const searchTerm = req.query.searchTerm;
  let result = data;
  if (searchTerm) {
    result = data.filter((item)=>{
      for (let key in item) {
        if (item[key].toString().includes(searchTerm)) {
          return item;
        }
      }
    });} 
  res.json(result);
});  
  

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  res.json(data.find(item=> item.id === Number(id)));
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err=> {console.error(err);});