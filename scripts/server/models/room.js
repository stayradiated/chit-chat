'use strict';

var Jandal = require('jandal');
var BackboneRelational = require('backbone-relational');
var uuid = require('node-uuid');

var User = require('./user');
var Users = require('./users');
var Message = require('./message');
var Messages = require('./messages');

var Room = BackboneRelational.RelationalModel.extend({

  relations: [{
    type: BackboneRelational.HasMany,
    key: 'users',
    relatedModel: User,
    collectionType: Users,
    includeInJSON: 'id',
    reverseRelation: {
      key: 'room',
      includeInJSON: 'id'
    }
  }, {
    type: BackboneRelational.HasMany,
    key: 'messages',
    relatedModel: Message,
    collectionType: Messages,
    includeInJSON: false,
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

    this.on('add:users remove:users change:name', function () {
      Jandal.all.emit('room.update', this.toJSON());
    });

  }

});

module.exports = Room;
