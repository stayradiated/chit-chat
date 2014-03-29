'use strict';

var expect = require('chai').expect;
var Jandal = require('jandal');
var Socket = require('./socket.js');
var _ = require('underscore');
var Sandal = require('jandal-log');


describe('Socket', function () {

  var client;
  var allClients = [];

  beforeEach(function () {
    client = createClient();
  });

  afterEach(function () {
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

      client.emit('user.fetch', function (user) {
        expect(user.name).to.equal('');
        done();
      });

    });

    it('should set the name', function (done) {

      client.emit('user.update', {
        name: 'John'
      });

      client.emit('user.fetch', function (user) {
        expect(user.name).to.equal('John');
        done();
      });

    });


    it('should broadcast when the name is changed', function (done) {

      var otherClient = createClient();

      client.emit('room.create', { name: 'grape' }, function (room) {

        client.emit('user.update', { room: room.id });
        otherClient.emit('user.update', { room: room.id });

        otherClient.once('user.update', function (user) {
          expect(user.name).to.equal('George');
          expect(user.room).to.equal(room.id);

          client.emit('room.destroy', {
            id: room.id
          });
          done();
        });

      });

      client.emit('user.update', {
        name: 'George'
      });

    });

  });

  describe('room', function () {

    it('should fetch rooms (empty)', function (done) {

      client.emit('room.fetch', function (rooms) {
        expect(rooms).to.eql([]);
        done();
      });

    });

    it('should fetch rooms (not empty)', function (done) {

      client.emit('room.create', {
        name: 'pumpkin'
      });

      client.emit('room.fetch', function (rooms) {
        expect(rooms).to.have.length(1);
        expect(rooms[0].name).to.equal('pumpkin');
        expect(rooms[0].users).to.eql([]);
        client.emit('room.destroy', {
          name: 'pumpkin'
        });
        done();
      });

    });

    it('should emit events when a room is created', function (done) {

      client.once('room.create', function (room) {
        expect(room.name).to.equal('orange');
        expect(room.users).to.eql([]);
        client.emit('room.destroy', { id: room.id });
        done();
      });

      client.emit('room.create', {
        name: 'orange'
      });

    });

    it('should emit event when users join rooms', function (done) {

      client.emit('room.create', { name: 'blueberry' }, function (room) {

        client.once('room.update', function (room) {
          expect(room.name).to.equal('blueberry');
          expect(room.users).to.have.length(1);
          done();
        });

        client.emit('room.join', room.id);

      });

    });

    it('should emit event when users leave rooms', function (done) {

      client.emit('room.create', 'raspberry');
      client.emit('room.join', 'raspberry');

      client.once('room.update', function (room) {
        expect(room).to.eql({
          name: 'raspberry',
          users: 0
        });
        client.emit('room.destroy', 'raspberry');
        done();
      });

      client.emit('room.leave', 'raspberry');

    });

  });

  describe('message', function () {

    it('should publish a message');

    it('should fetch messages');

    it('should broadcast messages to others in the same room');

  });

});

