'use strict';

var User = require('./user');
var Users = require('./users');
var BackboneRelational = require('backbone-relational');
var uuid = require('node-uuid');

var Room = BackboneRelational.RelationalModel.extend({

  relations: [{
    type: BackboneRelational.HasMany,
    key: 'users',
    relatedModel: User,
    collectionType: Users,
    reverseRelation: {
      key: 'room',
      includeInJSON: 'id'
    }
  }],

  defaults: {
    name: ''
  },

  initialize: function () {
    this.set('id', uuid.v4());
  }

});

module.exports = Room;
