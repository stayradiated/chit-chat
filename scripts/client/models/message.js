'use strict';

var Message = Backbone.Model.extend({

  defaults: {
    user: null,
    contents: '',
    time: null
  },

  initialize: function () {
    if (this.get('time') === null) {
      this.set('time', moment().format('MMM-D h:mm a'));
    }
  }

});

var Messages = Backbone.Collection.extend({

  model: Message

});

module.exports = Messages;
