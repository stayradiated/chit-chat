'use strict';

var Message = Backbone.Model.extend({

  defaults: {
    user: null,
    contents: '',
    time: null
  }

});

var Messages = Backbone.Model.extend({

  model: Message

});

module.exports = Messages;
