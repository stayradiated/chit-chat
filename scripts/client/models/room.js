var User = require('./user');
var Users = require('./users');
var Message = require('./message');
var Messages = require('./messages');

var Room = Backbone.RelationalModel.extend({

  user: 'room',

  relations: [{
    type: Backbone.HasMany,
    key: 'users',
    relatedModel: User,
    collectionType: Users,
    reverseRelation: {
      key: 'room',
      includeInJSON: 'id'
    }
  }, {
    type: Backbone.HasMany,
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
    name: '',
    messages: null,
    users: null,
    selected: false
  },

  blacklist: ['selected'],

  toJSON: function (options) {
    return _.omit(this.attributes, this.blacklist);
  }

});

module.exports = Room;
