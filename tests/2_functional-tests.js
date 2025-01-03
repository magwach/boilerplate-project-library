/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

import * as chai from 'chai';
const assert = chai.assert;
import { suite, test } from 'mocha';
import chaiHttp from 'chai-http';
import server from '../server.js';

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let testId; // Will store a valid _id for testing

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id', 'Response should contain _id');
            assert.property(res.body, 'title', 'Response should contain title');
            assert.equal(res.body.title, 'Test Book');
            testId = res.body._id; // Save _id for further tests
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Response should be an array');
            if (res.body.length > 0) {
              assert.property(res.body[0], 'commentcount');
              assert.property(res.body[0], 'title');
              assert.property(res.body[0], '_id');
            }
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/invalidid123')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.equal(res.body._id, testId);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
          .post(`/api/books/${testId}`)
          .send({ comment: 'Great book!' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.include(res.body.comments, 'Great book!');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .post(`/api/books/${testId}`)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .post('/api/books/invalidid123')
          .send({ comment: 'Great book!' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .delete(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .delete('/api/books/invalidid123')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
