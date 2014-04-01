'use strict';

var App = require('../app');

var Rooms = require('../models/rooms');
var Users = require('../models/users');

var HeaderView = require('../views/header');
var MessagesView = require('../views/message');
var InputView = require('../views/input');
var RoomsView = require('../views/room');
var UsersView = require('../views/user');
var CreateRoomView = require('../views/modals/createRoom');
var DestroyRoomView = require('../views/modals/destroyRoom');

var Router = Marionette.AppRouter.extend({
  appRoutes: {
    '*room': 'openRoomFromRouter'
  }
});

var ViewController = function () {
  App.rooms = new Rooms();
  App.users = new Users();
  App.rooms.once('reset', Backbone.history.start, Backbone.history);
  App.vent.on('room.open', this.openRoom, this);
  App.vent.on('modal:room:create', this.showCreateRoom, this);
  App.vent.on('modal:room:destroy', this.showDestroyRoom, this);
};

_.extend(ViewController.prototype, {

  start: function () {
    App.users.fetch({ reset: true });
    App.rooms.fetch({ reset: true });

    this.showHeader(App.user);
    this.showRooms(App.rooms);
    this.showInput();
  },

  openRoom: function (room) {
    var messages = room.get('messages');
    messages.fetch();
    this.showMessages(messages);
    this.showUsers(room.get('users'));
  },

  openRoomFromRouter: function (roomId) {
    var room = App.rooms.get(roomId);
    if (! room) return this.goTo('', { trigger: false });
    App.user.save({room: room}, {patch: true});
    room.set('selected', true);
    App.vent.trigger('room.open', room);
  },

  showHeader: function (user) {
    var headerView = new HeaderView({ model: user });
    App.header.show(headerView);
  },

  showMessages: function (messages) {
    var messagesView = new MessagesView({ collection: messages });
    App.message.show(messagesView);
  },

  showInput: function () {
    var inputView = new InputView();
    App.input.show(inputView);
  },

  showRooms: function (rooms) {
    var roomsView = new RoomsView({ collection: rooms });
    App.sidebarLeft.show(roomsView);
  },

  showUsers: function (users) {
    var usersView = new UsersView({ collection: users });
    App.sidebarRight.show(usersView);
  },

  showCreateRoom: function (rooms) {
    var createRoomView = new CreateRoomView({ collection: rooms });
    App.modal.show(createRoomView);
  },

  showDestroyRoom: function (room) {
    var destroyRoomView = new DestroyRoomView({ model: room });
    App.modal.show(destroyRoomView);
  }

});

App.addInitializer(function () {
  var viewController = new ViewController();
  var router = new Router({ controller: viewController });
  viewController.goTo = function (loc, opts) {
    router.navigate(loc, opts || { trigger: true });
  };
  viewController.start();
});

module.exports = ViewController;
