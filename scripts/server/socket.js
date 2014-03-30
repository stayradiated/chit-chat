'use strict';

var _ = require('underscore');
var Jandal = require('jandal');

var Room  = require('./models/room');
var Rooms = require('./models/rooms');
var Users = require('./models/users');
var User  = require('./models/user');
var Message = require('./models/message');

var Backbone = require('backbone');
var BackboneRelational = require('backbone-relational');

var toJSON = function (obj) { return obj.toJSON(); };

Backbone.sync = function () {};

var Socket = function (socket) {
  this.socket = socket;

  this.user = new User();
  Socket.users.add(this.user);

  this.bind();
};

Socket.rooms = new Rooms();
Socket.users = new Users();

_.extend(Socket.prototype, {

  events: {

    'socket.close':    'removeUser',

    'user.me':         'readThisUser',
    'user.read':       'readUsers',
    'user.update':     'updateUser',

    'room.create':     'createRoom',
    'room.read':       'readAllRooms',
    'room.update':     'updateRoom',
    'room.destroy':    'destroyRoom',

    'message.create':  'createMessage',
    'message.read':    'readAllMessagesInRoom'

  },

  bind: function () {

    _.each(this.events, function (method, key) {
      if (! this[method]) return;
      this.socket.on(key, this[method].bind(this));
    }, this);

    this.user.on('change:name', this.broadcastUserUpdate, this);
    this.user.on('change:room', this.updateUserRoom, this);
  },

  removeUser: function () {
    this.user.destroy();
  },

  updateUser: function (obj, cb) {
    this.user.set(obj);
    if (cb) cb(this.user.toJSON());
  },

  readThisUser: function (cb) {
    cb(this.user.toJSON());
  },

  readUsers: function (obj, cb) {
    if (typeof obj === 'function') return obj(Socket.users.toJSON());
    var users = Socket.users.filter(function (user) {
      if (obj.id && user.get('id') !== obj.id) return false;
      if (obj.name && user.get('name') !== obj.name) return false;
      if (obj.room && user.get('room').get('id') !== obj.room) return false;
      return true;
    }).map(toJSON);
    if (cb) cb(users);
  },

  broadcastUserUpdate: function () {
    if (! this.user.has('room')) return;
    var room = this.user.get('room').get('id');
    this.socket.broadcast.to(room).emit('user.update', this.user.toJSON());
  },

  updateUserRoom: function (user, room) {
    if (room) {
      this.joinRoom(room);
    }
  },



  readAllRooms: function (cb) {
    cb(Socket.rooms.toJSON());
  },

  createRoom: function (room, cb) {
    room = new Room(room, { silent: true });
    Socket.rooms.add(room);
    if (cb) cb(room);
  },

  updateRoom: function (obj, cb) {
    var room = Socket.rooms.get(obj.id);
    room.set('name', obj.name);
    if (cb) cb(room.toJSON());
  },

  destroyRoom: function (obj) {
    var room = Socket.rooms.get(obj.id);
    if (! room) return;

    room.get('users').each(function (user) {
      user.set('room', null, { silent: true });
    });

    this.socket.room(room.get('id')).empty();
    Socket.rooms.remove(room);
  },

  joinRoom: function (room) {
    if (! Socket.rooms.contains(room)) return;
    this.socket.join(room.get('id'));
    this.updateSocketRooms();
  },

  leaveRoom: function () {
    this.set('room', null);
    this.updateSocketRooms();
  },

  updateSocketRooms: function () {
    var currentRoom = this.user.get('room').get('id');
    _.map(this.socket.rooms, function (room) {
      if (room == 'all' || room === currentRoom) return;
      this.socket.leave(room);
    }, this);
  },


  readAllMessagesInRoom: function (obj, cb) {
    var room = Socket.rooms.get(obj.room);
    if (! room) return;
    if (cb) cb(room.get('messages').toJSON());
  },

  createMessage: function (message, cb) {
    message.user = this.user;
    message.room = this.user.get('room');
    if (! message.room) return;
    message = new Message(message);
    if (cb) cb(message.toJSON());
  }

});

module.exports = Socket;
