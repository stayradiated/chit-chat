'use strict';

var _ = require('underscore');
var Jandal = require('jandal');

var rooms = {};

var Socket = function (socket) {
  this.room = null;
  this.name = '';
  this.socket = socket;
  this.bind();
};

_.extend(Socket.prototype, {

  events: {

    'user.setName': 'setName',
    'user.getName': 'getName',

    'room.create': 'createRoom',
    'room.destroy': 'destroyRoom',
    'room.fetch': 'fetchRooms',
    'room.join': 'joinRoom'

  },

  bind: function () {
    _.each(this.events, function (method, key) {
      this.socket.on(key, this[method].bind(this));
    }, this);
  },

  setName: function (name) {
    this.name = name;
    if (this.room) {
      this.socket.broadcast.to(this.room).emit('user.changeName', this.name);
    }
  },

  getName: function (cb) {
    cb(this.name);
  },

  fetchRooms: function (cb) {
    console.log(Jandal.rooms);
    var rooms = _.chain(rooms).map(function (room) {
      return {
        name: room.id,
        users: room.sockets.length
      };
    }).value();
    return cb(rooms);
  },

  createRoom: function (name) {

    // Create room
    var room = this.socket.room(name);
    rooms[name] = room;

    console.log('created room', name);

    // Move socket into room
    this.joinRoom(name);

    // Publish event
    Jandal.all.emit('room.create', {
      name: room.id,
      users: room.sockets.length
    });

  },

  destroyRoom: function (name) {
    var room = Jandal.in(name);
    if (! room || room === Jandal.all) return;
    delete rooms[name];
    return room.release();
  },

  joinRoom: function (name) {
    if (! rooms[name]) return;
    this.leaveRoom();
    this.room = name;
    this.socket.join(this.room);
  },

  leaveRoom: function () {
    if (! this.room) return;
    this.socket.leave(this.room);
    this.room = null;
  }

});

module.exports = Socket;
