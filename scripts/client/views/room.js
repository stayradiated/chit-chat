'use strict';

var RoomItemView = Backbone.Marionette.ItemView.extend({

  tagName: 'li',
  template: '#template-room'

});

var RoomCollectionView = Backbone.Marionette.CompositeView.extend({

  template: '#template-room-container',
  itemView: RoomItemView,
  itemViewContainer: 'ul'

});

module.exports = RoomCollectionView;
