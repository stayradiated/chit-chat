'use strict';

var App = require('../app');
var MessageCollection = require('../models/message');
var MessageCollectionView = require('../views/message');
var MessageInputView = require('../views/input');

var MessageController = function () {

};

_.extend(MessageController.prototype, {

  start: function () {
    var self = this;

    App.vent.on('room:open', function (room) {
      var messages = room.get('messages');
      messages.fetch();
      self.showMessages(messages);
    });

    App.socketListen('message.create', function (message) {
      var room = App.user.get('room');
      room.get('messages').add(message);
    });

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
  }

});

App.addInitializer(function () {
  var messageController = new MessageController();
  messageController.start();
});

module.exports = MessageController;
