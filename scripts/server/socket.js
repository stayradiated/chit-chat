'use strict';

var _ = require('underscore');
var Jandal = require('jandal');

var Rooms = require('./models/rooms');
// var Room = require('./models/room');
var User = require('./models/user');

var Socket = function (socket) {
  this.socket = socket;
  this.user = new User();
  this.bind();
};

Socket.rooms = new Rooms();

Socket.rooms.on('add', function (room) {
  Jandal.all.emit('room.create', room.toJSON());
});

Socket.rooms.on('remove', function (room) {
  console.log(room);
  // Jandal.all.emit('room.destroy', room.toJSON());
});

Socket.rooms.on('add:users remove:users', function (user) {
  var room = Socket.rooms.get(user.get('room'));
  Jandal.all.emit('room.update', room.toJSON());
});

_.extend(Socket.prototype, {

  events: {

    'user.update': 'updateUser',
    'user.fetch': 'fetchUser',

    'room.create': 'createRoom',
    'room.destroy': 'destroyRoom',
    'room.fetch': 'fetchRooms',
    'room.join': 'joinRoom',
    'room.leave': 'leaveRoom'

  },

  bind: function () {

    _.each(this.events, function (method, key) {
      this.socket.on(key, this[method].bind(this));
    }, this);

    this.user.on('change', this.broadcastUserUpdate, this);
    this.user.on('change:room', this.updateUserRoom, this);
  },



  updateUser: function (obj) {
    this.user.set(obj);
  },

  fetchUser: function (cb) {
    return cb(this.user.toJSON());
  },

  broadcastUserUpdate: function () {
    var room = this.user.get('room');
    if (! room) return;
    room = room.get('name');
    this.socket.broadcast.to(room).emit('user.update', this.user.toJSON());
  },

  updateUserRoom: function (user, room) {
    if (room) {
      this.joinRoom(room);
    }
  },


  fetchRooms: function (cb) {
    cb(Socket.rooms.toJSON());
  },

  createRoom: function (room, cb) {
    room = Socket.rooms.add(room).models[0];
    if (cb) cb(room);
  },

  destroyRoom: function (obj) {
    var room = Socket.rooms.findWhere(obj);
    Socket.rooms.remove(room);
  },

  joinRoom: function (room) {
    var name = room.get('name');

    if (! Socket.rooms.findWhere({
      name: name
    })) return;

    this.socket.join(name);
    this.updateSocketRooms();
  },

  leaveRoom: function () {
    this.set('room', null);
    this.updateSocketRooms();
  },

  updateSocketRooms: function () {
    var currentRoom = this.user.get('room').get('name');
    _.map(this.socket.rooms, function (room) {
      if (room == 'all' || room === currentRoom) return;
      this.socket.leave(room);
    }, this);
  }

});

module.exports = Socket;
