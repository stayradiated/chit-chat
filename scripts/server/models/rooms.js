'use strict';

var Backbone = require('backbone');
var Room = require('./room');

var Rooms = Backbone.Collection.extend({

  model: Room

});

module.exports = Rooms;
