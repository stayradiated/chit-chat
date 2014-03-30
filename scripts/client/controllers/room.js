'use strict';

var App = require('../app');
var RoomCollection = require('../models/room');
var RoomCollectionView = require('../views/room');

var Router = Marionette.AppRouter.extend({

  appRoutes: {
    '*room': 'openRoom'
  }

});

var RoomController = function () {
  this.roomCollection = new RoomCollection();
};

_.extend(RoomController.prototype, {

  start: function () {
    var self = this;
    this.showRooms(this.roomCollection);

    this.roomCollection.once('reset', function () {
      console.log('starting history');
      Backbone.history.start();
    });

    this.roomCollection.fetch({ reset: true });

    App.socketListen('room.create', function (room) {
      self.roomCollection.add(room);
    });

    App.socketListen('room.update', function (room) {
      console.log('room.update');
      self.roomCollection.get(room.id).set(room);
    });

    App.socketListen('room.delete', function (room) {
      console.log('room.delete');
      self.roomCollection.get(room.id).destroy();
    });

  },

  showRooms: function (roomCollection) {

    var roomCollectionView = new RoomCollectionView({
      collection: roomCollection
    });

    App.sidebarLeft.show(roomCollectionView);
  },

  openRoom: function (roomId) {
    var room = this.roomCollection.get(roomId && roomId.trim() || '');

    console.log(room);

    if (! room) return;
    room.trigger('select');
    App.vent.trigger('room:open', room);
  }

});

App.addInitializer(function () {
  var roomController = new RoomController();
  var router = new Router({
    controller: roomController
  });
  roomController.start();
});

module.exports = RoomController;
