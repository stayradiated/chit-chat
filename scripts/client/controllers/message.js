'use strict';

var App = require('../app');
var MessageCollection = require('../models/message');
var MessageCollectionView = require('../views/message');

var Controller = function () {
  this.messageCollection = new MessageCollection();
};

_.extend(Controller.prototype, {

  start: function () {
    this.showMessages(this.messageCollection);
    // this.messageCollection.fetch();
  },

  showMessages: function (messageCollection) {
    var messages = new MessageCollectionView({
      collection: messageCollection
    });
    App.content.show(messages);
  },

  openMessage: function (messageId) {
    App.vent.trigger('message:open', (messageId && messageId.trim()) || '');
  }

});

App.addInitializer(function () {
  var controller = new Controller();
  controller.start();
});

module.exports = Controller;
