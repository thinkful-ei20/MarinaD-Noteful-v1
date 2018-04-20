'use strict';

//import chai and create expect object
const chai = require('chai');
const expect = chai.expect;
//import app
const app  = require('../server');
//require chai-http for api testing
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

//confirm tests working normally
describe('Reality Check', function(){
  it('true should be true', function(){
    expect(true).to.be.true;
  });

  it('2 plus 2 is 4', function() {
    expect(2+2).to.equal(4);
  });
});

//test static server
describe('Express Static', function(){
  it('GET request "/" should return the index page', function(){
    return chai.request(app)
      .get('/')
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

//Test 404 Handling
describe('404 handler', function(){
  it('should respond with 404 when given bad path', function(){
    return chai.request(app)
      .get('/DOESNOTEXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('GET /api/notes', function(){
  it('should get a list of notes',function(){
    return chai.request(app)
      .get('/api/notes')
      .then( res => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.equal(10);
        expect(res.body).to.be.a('array');
        res.body.forEach(item =>
          expect(item).to.have.keys([
            'id','title','content'
          ]));
      });
  });

  it('should get a list of notes by search query',function(){
    const searchQuery = 'cats';
    return chai.request(app)
      .get(`/api/notes?searchTerm=${searchQuery}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);
        res.body.forEach(item =>
          expect(item).to.have.keys([
            'id','title','content'
          ]));
      });

  });

  it('should return an empty array for an incorrect query',function(){
    const searchQuery = 'WILLNEVERBEATHINGEVER!!';
    return chai.request(app)
      .get(`/api/notes?searchTerm=${searchQuery}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.equal(0);
      });
  });
});

describe('GET api/notes/:id', function(){
  it('should return a correct note object with id,title and content for a given id', function(){
    return chai.request(app)
      .get('/api/notes/1000')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys([
          'id', 'title', 'content'
        ]);
      }); 
  });

  it('should respond 404 for invalid id', function() {
    return chai.request(app)
      .get('/api/notes/NonexistantID')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('POST /api/notes', function(){
  it('should create and return a new item with location header', function(){
    const updateObj = {
      id : '1000',
      title: 'TestUpdateTitle',
      content: 'New Content is cool'
    };
    return chai.request(app)
      .post('/api/notes/')
      .send(updateObj)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.keys([
          'id','title','content'
        ]);
        expect(res.header.location).to.exist;
      });
  });

  it('should return an object with message property when no title given', function(){
    const badObj ={
      id : 1000,
      content: 'some stuff that will not work'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(badObj)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.equal('Missing `Title` in request body');
      });
  });
});

describe('PUT /api/notes/:id', function(){
  it('should update and return a note object when given valid data', function(){
    const validUpdateObj = {
      id: 1000,
      title : 'an updated title',
      content : 'This is an updated body'
    };
    return chai.request(app)
      .put('/api/notes/1000')
      .send(validUpdateObj)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.be.equal(1000);
      });
  });

  it('should respon with 404 for invalid ID', function(){
    const invalidUpdateObj = {
      id: 989302432,
      title: 'invalid title',
      content: 'invalid content'
    };
    return chai.request(app)
      .get('/api/notes/989302432')
      .send(invalidUpdateObj)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

  it('should return an object with a message property when missing title field',function(){
    const invalidObj = {};
    return chai.request(app)
      .put('/api/notes/1000')
      .send(invalidObj)
      .then(res => {
        expect(res).to.have.status(200);
      });
  });
});

describe('DELTE /api/notes/:id', function(){
  it('should delete an item by id',function(){
    return chai.request(app)
      .delete('/api/notes/1000')
      .then( res => {
        expect(res).to.have.status(204);
      });
  }); 
});