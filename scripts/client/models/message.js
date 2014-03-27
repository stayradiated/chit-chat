'use strict';

var UserCollection = require('../models/user');

var Message = Backbone.RelationalModel.extend({

  relations: [{
    type: Backbone.HasOne,
    key: 'user',
    relatedModel: UserCollection.prototype.model
  }],

  defaults: {
    user: null,
    contents: '',
    time: null
  },

  initialize: function () {
    if (this.get('time') === null) {
      this.set('time', moment().format('h:mma, D MMM'));
    }
  }

});

var Messages = Backbone.Collection.extend({

  model: Message

});

module.exports = Messages;
