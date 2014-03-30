'use strict';

var Jandal = require('jandal');
var Backbone = require('backbone');
var Room = require('./room');

var Rooms = Backbone.Collection.extend({

  model: Room,
  
  initialize: function () {

    this.on('add', function (room) {
      Jandal.all.emit('room.create', room.toJSON());
    });

    this.on('remove', function (room) {
      Jandal.all.emit('room.destroy', { id: room.get('id') });
    });

  }

});

module.exports = Rooms;
