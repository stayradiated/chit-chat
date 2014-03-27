'use strict';

var App = require('../app');

var MessageInputView = Marionette.ItemView.extend({

  className: 'message-input',
  template: '#template-message-input',

  ui: {
    input: '.input'
  },

  events: {
    'keydown .input': 'onKeyDown'
  },

  onKeyDown: function (e) {
    if (e.keyCode !== 13) return true;
    this.postMessage();
    return false;
  },

  postMessage: function () {
    var message = this.ui.input.text().trim();
    if (! message.length) return;

    var room = App.user.get('room');
    if (! room) return;

    room.get('messages').add({
      user: App.user,
      contents: message
    });

    this.ui.input.empty();
  }

});

module.exports = MessageInputView;
