'use strict';

var App = require('../app');

var MessageItemView = Marionette.ItemView.extend({

  className: 'message',
  template: '#template-message'

});

var MessageCollectionView = Marionette.CollectionView.extend({

  className: 'messages',
  itemView: MessageItemView,

  initialize: function () {
    this.listenTo(this, 'after:item:added', this.scrollDown);
  },

  onShow: function () {
    this.scrollDown();
  },

  scrollDown: function () {
    this.$el.scrollTop(this.el.scrollHeight);
  }

});

module.exports = MessageCollectionView;
