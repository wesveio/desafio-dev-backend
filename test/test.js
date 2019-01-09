'use strict';

const app = require('../src/app')
const chai = require('chai');
const http = require('http');
const expect = chai.expect;
const request = require('supertest');
const mongoose = require('mongoose');
const config = require('./config-test');
const debug = require('debug')('goomer:server');

const port = '3002';
app.set('port', port);
const server = http.createServer(app);


mongoose.set('useCreateIndex', true);
// Connecting to database
mongoose.connect(config.connectionString, { useNewUrlParser: true });

describe("API test", function () {

  it('Has an app defined', function () {
    expect(app).to.not.be.undefined;
  });

  before(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  });

  after(done => {
    mongoose.connection.close();
    server.close(done);
  });

  const user = {
    name: 'User',
    email: 'user@gmail.com',
    password: '987654'
  }

  const userUpdate = {
    name: 'User Update',
    email: 'userUpdate@gmail.com',
    password: '654321'
  }

  let userGet;
  let groupGet;

  describe('Creating users', () => {
    it('#POST - Can create first user', async function () {
      this.timeout(5000);
      await request(server)
        .post('/users')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('#POST - Can create a second user', async function () {
      this.timeout(5000);
      await request(server)
        .post('/users')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('#GET - Can list all users', async function () {
      userGet = await request(server)
        .get('/users')
        .expect(200);
    });

    it('#GET - Can get user by ID', async function () {
      await request(server)
        .get('/users')
        .expect(200)
        .then(response => {
          request(server).get('/users/id/' + response.body[0]._id).expect(200);
        });
    });

    it('#PUT - Can update first user', async function () {
      this.timeout(3000);
      await request(server)
        .put('/users/' + userGet.body[0]._id)
        .send(userUpdate)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });

  });

  describe('Group routes test', function () {

    it('#POST - Can create a group', async function () {
      this.timeout(5000);
      const group = {
        "group": "Dummy Group",
        "slug": "dummy-group",
        "users": [userGet.body[0]._id, userGet.body[1]._id]
      }
      await request(server)
        .post('/groups')
        .send(group)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('#GET - Can list all groups', async function () {
      groupGet = await request(server).get('/groups').expect(200);
    });

    it('#GET - Can get group by ID', async function () {
      await request(server).get('/groups/id/' + groupGet.body[0]._id).expect(200);
    });

    it('#PUT - Can update a group', async function () {
      this.timeout(5000);
      const groupUpdate = {
        "group": "Dummy Group",
        "slug": "dummy-group",
        "users": [userGet.body[0]._id, userGet.body[1]._id]
      }
      await request(server)
        .put('/users/' + groupGet.body[0]._id)
        .send(groupUpdate)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });

  });

  describe('Removing Group and Users', function () {

    it('#DELETE - Can remove group from user(s)', async function () {
      let groupUser = {
        group_id: groupGet.body[0]._id,
        users_id: [userGet.body[0]._id]
      }
      await request(server)
        .put('/groups/remove/user')
        .send(groupUser)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('#DELETE - Can delete a group', async function () {
      let groupID = {
        id: groupGet.body[0]._id
      }
      await request(server)
        .delete('/groups')
        .send(groupID)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('#DELETE - Can delete first user', async function () {
      let userID = {
        id: userGet.body[0]._id
      }
      await request(server)
        .delete('/users')
        .send(userID)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('#DELETE - Can delete second user', async function () {
      let userID = {
        id: userGet.body[1]._id
      }
      await request(server)
        .delete('/users')
        .send(userID)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  })

});

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}