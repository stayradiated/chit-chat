var Message = require('./message');

var Messages = Backbone.Collection.extend({

  url: 'message',
  model: Message

});

module.exports = Messages;
