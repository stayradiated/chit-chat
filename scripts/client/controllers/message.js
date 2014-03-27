'use strict';

var App = require('../app');
var MessageCollection = require('../models/message');
var MessageCollectionView = require('../views/message');
var MessageInputView = require('../views/messageInput');

var MessageController = function () {

};

_.extend(MessageController.prototype, {

  start: function () {

    // this.messageCollection.fetch();

    App.vent.on('room:open', function (room) {
      this.showMessages(room.get('messages'));
    }, this);

    this.showInput();

  },

  showMessages: function (messageCollection) {
    var messages = new MessageCollectionView({
      collection: messageCollection
    });
    App.message.show(messages);
  },

  showInput: function () {
    var input = new MessageInputView();
    App.input.show(input);
  },

  openMessage: function (messageId) {
    App.vent.trigger('message:open', (messageId && messageId.trim()) || '');
  }

});

App.addInitializer(function () {
  var messageController = new MessageController();
  messageController.start();
});

module.exports = MessageController;
