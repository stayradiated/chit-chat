'use strict';

var expect = require('chai').expect;
var Jandal = require('jandal');
var Socket = require('./socket.js');
var _ = require('underscore');
var Sandal = require('jandal-log');
var randomWord = require('random-words');


describe('Socket', function () {

  var client = null;
  var allClients = [];
  var room = {};

  beforeEach(function (done) {
    client = createClient();
    client.group(this.currentTest.title);
    client.emit('room.create', { name: randomWord() }, function (obj) {
      room = obj;
      done();
    });
  });

  afterEach(function () {
    client.emit('room.destroy', { id: room.id });
    _.each(allClients, function (client) {
      client.end();
    });
    allClients = [];
  });

  var createClient = function () {
    var client = new Sandal();
    var server = new Jandal(client.serverSocket, Sandal.handler);
    var socket = new Socket(server);
    allClients.push(client);
    return client;
  };

  describe('user', function () {

    it('should get the name', function (done) {

      client.emit('user.me', function (user) {
        expect(user.name).to.equal('');
        done();
      });

    });

    it('should set the name', function (done) {

      client.emit('user.update', {
        name: 'John'
      });

      client.emit('user.me', function (user) {
        expect(user.name).to.equal('John');
        done();
      });

    });

    it('should broadcast when the name is changed', function (done) {

     var otherClient = createClient();

      client.emit('user.update', { room: room.id });
      otherClient.emit('user.update', { room: room.id });

      otherClient.once('user.update', function (user) {
        expect(user.name).to.equal('George');
        expect(user.room).to.equal(room.id);
        done();
      });

      client.emit('user.update', {
        name: 'George'
      });

    });

    it('should read all users', function (done) {

      var otherClient = createClient();

      client.emit('user.read', function (users) {
        expect(users).to.have.length(2);
        done();
      });

    });

    it('should read user with an id', function (done) {

      var otherClient = createClient();

      otherClient.emit('user.me', function (otherUser) {

        client.emit('user.read', { id: otherUser.id }, function (users) {
          expect(users).to.have.length(1);
          expect(users[0].id).to.equal(otherUser.id);
          done();
        });

      });

    });

    it('should read users in a room', function (done) {

      client.emit('user.update', { room: room.id });

      client.emit('user.read', { room: room.id }, function (users) {
        expect(users).to.have.length(1);
        expect(users[0].room).to.equal(room.id);
        done();
      });

    });

  });

  describe('room', function () {

    it('should fetch rooms', function (done) {

      client.emit('room.read', function (rooms) {
        expect(rooms).to.eql([room]);
        done();
      });

    });

    it('should emit events when a room is created', function (done) {

      client.once('room.create', function (room) {
        expect(room.name).to.equal(room.name);
        expect(room.users).to.eql([]);
        done();
      });

      client.emit('room.create', {
        name: room.name
      });

    });

    it('should emit event when users join rooms', function (done) {

      client.once('room.update', function (room) {
        expect(room.name).to.equal(room.name);
        expect(room.users).to.have.length(1);
        done();
      });

      client.emit('user.update', {
        room: room.id
      });

    });

    it('should emit event when users leave rooms', function (done) {

      client.emit('user.update', { room: room.id });

      client.once('room.update', function (room) {
        expect(room.name).to.equal(room.name);
        expect(room.users).to.have.length(0);
        done();
      });

      client.emit('user.update', {
        room: null
      });

    });

    it('should update a room name', function (done) {

      client.once('room.update', function (room) {
        expect(room.name).to.equal('my room name');
        done();
      });

      client.emit('room.update', {
        id: room.id,
        name: 'my room name'
      });

    });

    it('should emit an event when a room is destroyed', function (done) {

      client.emit('user.update', { room: room.id });

      client.emit('room.destroy', { id: room.id });

      client.emit('user.me', function (user) {
        expect(user.room).to.equal(null);
        done();
      });

    });

  });

  describe('message', function () {

    it('should publish a message', function (done) {

      var time = Date.now();

      client.emit('user.update', { room: room.id });

      client.emit('message.create', {
        contents: 'contents',
        time: time
      }, function (message) {
        expect(message.contents).to.equal('contents');
        expect(message.time).to.equal(time);
        expect(message.room).to.equal(room.id);
        done();
      });

    });

    it('should broadcast messages to others in the same room', function (done) {

      var otherClient = createClient();

      client.emit('user.update', { room: room.id });
      otherClient.emit('user.update', { room: room.id });

      otherClient.once('message.create', function(message) {
        expect(message.contents).to.equal('contents');
        done();
      });

      client.emit('message.create', {
        contents: 'contents'
      });

    });

    it('should fetch messages', function (done) {
      
      client.emit('user.update', { room: room.id });
      client.emit('message.create', { contents: 'hello' });
      client.emit('message.create', { contents: 'world' });

      client.emit('message.read', { room: room.id }, function (messages) {
        expect(messages).to.have.length(2);
        expect(messages[0].contents).to.equal('hello');
        expect(messages[1].contents).to.equal('world');
        done();
      });

    });

  });

});

