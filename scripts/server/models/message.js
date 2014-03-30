'use strict';

var _ = require('underscore');
var uuid = require('node-uuid');
var BackboneRelational = require('backbone-relational');

var User = require('./user');
var Users = require('./user');

var Message = BackboneRelational.RelationalModel.extend({

  relations: [{
    type: BackboneRelational.HasOne,
    key: 'user',
    relatedModel: User,
    includeInJSON: 'id'
  }],

  defaults: {
    user: null,
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

