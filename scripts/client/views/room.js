'use strict';

var App = require('../app');

var RoomItemView = Marionette.ItemView.extend({

  tagName: 'li',
  template: '#template-room',

  events: {
    'click': 'onclick'
  },

  onclick: function () {
    this.trigger('select');
    this.select();
    App.trigger('select:room', this.model);
  },

  select: function () {
    this.$el.addClass('active');
  }

});

var RoomCompositeView = Marionette.CompositeView.extend({

  className: 'rooms',
  template: '#template-room-container',

  itemView: RoomItemView,
  itemViewContainer: 'ul',

  events: {
    'click button': 'createRoom'
  },

  initialize: function () {
    this.listenTo(this, 'itemview:select', function (item) {
      this.$('.active').removeClass('active');
    });
  },

  createRoom: function () {
    var name = prompt('Room name');
    this.collection.add({
      name: name
    });
  }

});

module.exports = RoomCompositeView;
