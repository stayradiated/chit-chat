'use strict';

var App = require('../app');

var MessageItemView = Marionette.ItemView.extend({

  className: 'message',
  template: '#template-message',

  initialize: function () {
    this.listenTo(this.model.get('user'), 'change', this.render);
  }

});

var MessageCompositeView = Marionette.CompositeView.extend({

  className: 'messages',
  template: '#template-message-container',

  itemView: MessageItemView,
  itemViewContainer: '.log',

  ui: {
    log: '.log',
    input: '.input'
  },

  events: {
    'keydown .input': 'handleEnter'
  },

  initialize: function () {
    this.listenTo(this, 'after:item:added', this.scrollDown);
  },

  scrollDown: function () {
    var height = this.ui.log.height();
    this.ui.log.scrollTop(height);
  },

  handleEnter: function (e) {
    if (e.keyCode !== 13) return true;
    this.postMessage();
    return false;
  },

  postMessage: function () {
    var message = this.ui.input.text().trim();
    if (! message.length) return;

    this.collection.add({
      user: App.user,
      contents: message
    });

    this.ui.input.empty();
  }

});

module.exports = MessageCompositeView;
