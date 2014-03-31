var UserCollection = require('./user');

var Message = Backbone.RelationalModel.extend({

  url: 'message',

  relations: [{
    type: Backbone.HasOne,
    key: 'user',
    relatedModel: UserCollection.prototype.model,
    includeInJSON: 'id'
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

module.exports = Message;
