'use strict';

var BackboneRelational = require('backbone-relational');
var uuid = require('node-uuid');

var User = BackboneRelational.RelationalModel.extend({

  defaults: {
    name: '',
    room: null
  },

  initialize: function () {
    this.set('id', uuid.v4());
  }

});

module.exports = User;
