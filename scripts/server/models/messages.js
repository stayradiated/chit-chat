'use strict';

var Backbone = require('backbone');
var Message = require('./message');

var Messages = Backbone.Collection.extend({

  model: Message

});

module.exports = Messages;
