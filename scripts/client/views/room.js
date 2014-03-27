'use strict';

var App = require('../app');

var RoomItemView = Marionette.ItemView.extend({

  tagName: 'li',
  template: '#template-room',

  events: {
    'click .delete': 'delete'
  },

  initialize: function () {
    this.listenTo(this.model.get('users'), 'add remove', this.render);
    this.listenTo(this.model, 'select', this.select);
  },

  select: function () {
    this.trigger('select');
    this.$el.addClass('active');
    App.user.set('room', this.model);
  },

  delete: function () {
    App.vent.trigger('modal:room:destroy', this.model);
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
    App.vent.trigger('modal:room:create', this.collection);
  }

});

module.exports = RoomCompositeView;
