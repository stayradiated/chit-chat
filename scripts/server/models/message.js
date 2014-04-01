'use strict';

var _ = require('underscore');
var uuid = require('node-uuid');
var BackboneRelational = require('backbone-relational');

var Message = BackboneRelational.RelationalModel.extend({

  defaults: {
    user: '',
    room: null,
    time: null,
    contents: ''
  },

  initialize: function () {
    this.set('id', uuid.v4());
    if (! this.has('time')) {
      this.set('time', _.now());
    }
  }

});

module.exports = Message;

