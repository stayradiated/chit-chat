'use strict';

var expect = require('chai').expect;
var Jandal = require('jandal');
var Socket = require('./socket.js');
var _ = require('underscore');
var Sandal = require('jandal/test/sandal');


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

      client.emit('user.getName', function (name) {
        expect(name).to.equal('');
        done();
      });

    });

    it('should set the name', function (done) {

      client.emit('user.setName', 'John');

      client.emit('user.getName', function (name) {
        expect(name).to.equal('John');
        done();
      });

    });


    it('should broadcast when the name is changed', function (done) {

      var otherClient = createClient();

      client.emit('room.create', 'grape');
      otherClient.emit('room.join', 'grape');

      otherClient.once('user.changeName', function (name) {
        expect(name).to.equal('George');
        client.emit('room.destroy', 'grape');
        done();
      });

      client.emit('user.setName', 'George');
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

      client.emit('room.create', 'pumpkin');

      client.emit('room.fetch', function (rooms) {
        expect(rooms).to.eql([{
          name: 'pumpkin',
          users: 1
        }]);
        done();
      });

    });

    it('should emit events when a room is created', function (done) {

      client.once('room.create', function (room) {
        expect(room).to.eql({
          name: 'orange',
          users: 1
        });
        done();
      });

      client.emit('room.create', 'orange');

    });

    it('should broadcast when users join rooms');
    it('should broadcast when users leave rooms');

  });

  describe('message', function () {

    it('should publish a message');

    it('should fetch messages');

    it('should broadcast messages to others in the same room');

  });

});

