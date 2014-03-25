'use strict';

var App = require('./app');
var RoomCollection = require('../models/room');
var RoomCollectionView = require('../views/room');

var Router = Marionette.AppRouter.extend({

  appRoutes: {
    '*room': 'openRoom'
  }

});

var Controller = function () {
  this.roomCollection = new RoomCollection();
};

_.extend(Controller.prototype, {

  start: function () {
    this.showRooms(this.roomCollection);

    // this.roomCollection.fetch();

    this.roomCollection.add({
      name: 'My room',
      users: 20
    });

    this.roomCollection.add({
      name: 'My other room',
      users: 42
    });

  },

  showRooms: function (roomCollection) {
    var rooms = new RoomCollectionView({
      collection: roomCollection
    });
    App.rooms.show(rooms);
  },

  openRoom: function (roomId) {
    App.vent.trigger('room:open', (roomId && roomId.trim()) || '');
  }

});

App.addInitializer(function () {

  console.log('starting room controller');

  var controller = new Controller();

  var router = new Router({
    controller: controller
  });

  controller.start();

});

module.exports = Router;
