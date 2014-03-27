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
    this.showRooms(this.roomCollection);

    // this.roomCollection.fetch();

    this.roomCollection.add({
      id: 10,
      name: 'Lobby'
    });

    var lobby = this.roomCollection.at(0);

    lobby.get('users').add({
      name: 'Jimmy'
    });

    lobby.get('users').add({
      name: 'Sammy'
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
