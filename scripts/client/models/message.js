var User = require('./user');

var Message = Backbone.RelationalModel.extend({

  url: 'message',

  defaults: {
    user: '',
    contents: '',
    time: null
  },

  initialize: function () {
    if (this.get('time') === null) {
      this.set('time', _.now());
    }
  }

});

module.exports = Message;
