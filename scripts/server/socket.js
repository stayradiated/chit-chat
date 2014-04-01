'use strict';

var _ = require('underscore');

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
  this.socket.broadcast('user.create', this.user.toJSON());
  this.bind();
};

Socket.rooms = new Rooms();
Socket.users = new Users();

_.extend(Socket.prototype, {

  events: {

    'socket.close':    'removeUser',

    'user.create':     'createUser',
    'user.read':       'readUsers',
    'user.update':     'updateUser',

    'room.create':     'createRoom',
    'room.read':       'readAllRooms',
    'room.update':     'updateRoom',
    'room.delete':     'deleteRoom',

    'message.create':  'createMessage',
    'message.read':    'readMessages'

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
    this.socket.broadcast('user.delete', { id: this.user.id });
    this.user.destroy();
  },

  updateUser: function (obj, cb) {
    this.user.set(obj);
    if (cb) cb(this.user.toJSON());
  },




  createUser: function (obj, cb) {
    if (typeof obj === 'function') {
      cb = obj;
      obj = {};
    }
    this.user.set(obj);
    cb(this.user.toJSON());
  },

  readUsers: function (obj, cb) {
    if (typeof obj === 'function') return obj(Socket.users.toJSON());
    var users = Socket.users.filter(function (user) {
      if (obj.id && user.id !== obj.id) return false;
      if (obj.name && user.get('name') !== obj.name) return false;
      if (obj.room && user.get('room').id !== obj.room) return false;
      return true;
    }).map(toJSON);
    if (cb) cb(users);
  },

  broadcastUserUpdate: function () {
    if (! this.user.has('room')) return;
    var room = this.user.get('room').id;
    this.socket.broadcast('user.update', this.user.toJSON());
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
    this.socket.broadcast('room.create', room.toJSON());
  },

  updateRoom: function (obj, cb) {
    var room = Socket.rooms.get(obj.id);
    room.set('name', obj.name);
    room = room.toJSON();
    if (cb) cb(room);
    this.socket.broadcast('room.update', room);
  },

  deleteRoom: function (obj, cb) {
    var room = Socket.rooms.get(obj.id);
    if (! room) return;

    room.get('users').each(function (user) {
      user.set('room', null, { silent: true });
    });

    this.socket.room(room.id).empty();
    Socket.rooms.remove(room);

    if (cb) cb();
    this.socket.broadcast('room.delete', {id: room.id});
  },

  joinRoom: function (room) {
    if (! Socket.rooms.contains(room)) return;
    this.socket.join(room.id);
    this.updateSocketRooms();
  },

  leaveRoom: function () {
    this.set('room', null);
    this.updateSocketRooms();
  },

  updateSocketRooms: function () {
    var currentRoom = this.user.get('room').id;
    _.map(this.socket.rooms, function (room) {
      if (room == 'all' || room === currentRoom) return;
      this.socket.leave(room);
    }, this);
  },


  readMessages: function (cb) {
    var room = this.user.get('room');
    if (! room) return;
    if (cb) cb(room.get('messages').toJSON());
  },

  createMessage: function (message, cb) {
    message.room = this.user.get('room');
    if (! message.room) return;
    message.user = this.user.get('name');
    message = new Message(message).toJSON();
    if (cb) cb(message);
    this.socket.broadcast.to(message.room).emit('message.create', message);
  }

});

module.exports = Socket;
