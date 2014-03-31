'use strict';

var App = require('../app');
var Sync = require('./sync');
var log = require('log_/browser');

var SocketController = function () {
};

_.extend(SocketController.prototype, {

  events: {
    'message.create': 'createMessage',
    'room.create': 'createRoom',
    'room.update': 'updateRoom',
    'room.delete': 'deleteRoom',
    'user.create': 'createUser',
    'user.update': 'updateUser',
    'user.delete': 'deleteUser'
  },

  start: function () {
    var self = this;
    _.each(this.events, function (method, event) {
      var logEvent = log(event, 'blue');
      Sync.on(event, function () {
        logEvent.apply(null, arguments);
        self[method].apply(self, arguments);
      });
    });
  },

  createMessage: function (message) {
    var room = App.user.get('room');
    room.get('messages').add(message);
  },

  createRoom: function (room) {
    App.rooms.add(room);
  },

  updateRoom: function (room) {
    App.rooms.get(room.id).set(room);
  },

  deleteRoom: function (room) {
    App.rooms.get(room.id).destroy();
  },

  createUser: function (user) {
    App.users.add(user);
  },

  updateUser: function (user) {
    App.users.get(user.id).set(user);
  },

  deleteUser: function (user) {
    App.users.get(user.id).destroy();
  }

});

App.addInitializer(function () {
  var socketController = new SocketController();
  socketController.start();
});

module.exports = SocketController;
