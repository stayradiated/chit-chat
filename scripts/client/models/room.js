'use strict';

var UserCollection = require('../models/user');
var MessageCollection = require('../models/message');

var Room = Backbone.RelationalModel.extend({

  relations: [{
    type: Backbone.HasMany,
    key: 'users',
    relatedModel: UserCollection.prototype.model,
    collectionType: UserCollection,
    reverseRelation: {
      key: 'room',
      includeInJSON: 'id'
    }
  }, {
    type: Backbone.HasMany,
    key: 'messages',
    relatedModel: MessageCollection.prototype.model,
    collectionType: MessageCollection,
    includeInJSON: false,
    reverseRelation: {
      key: 'room',
      includeInJSON: 'id'
    }
  }],

  defaults: {
    name: '',
    messages: null,
    users: null
  }

});

var Rooms = Backbone.Collection.extend({

  url: 'room',
  model: Room

});

module.exports = Rooms;

