'use strict';

var Jandal = require('jandal');
var Backbone = require('backbone');
var Room = require('./room');

var Rooms = Backbone.Collection.extend({

  model: Room,
  
  initialize: function () {

    this.on('remove', function (room) {
      Jandal.all.emit('room.delete', { id: room.get('id') });
    });

  }

});

module.exports = Rooms;
