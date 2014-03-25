'use strict';

var Room = Backbone.Model.extend({

  defaults: {
    name: '',
    users: 0
  }

});

var Rooms = Backbone.Collection.extend({

  model: Room

});

module.exports = Rooms;

