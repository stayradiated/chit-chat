'use strict';

var Jandal = require('jandal');
var Backbone = require('backbone');
var Message = require('./message');

var Messages = Backbone.Collection.extend({

  model: Message,

  initialize: function () {

    this.on('add', function (message) {
      var room = message.get('room').get('id');
      Jandal.in(room).emit('message.create', message.toJSON());
    });

  }

});

module.exports = Messages;
