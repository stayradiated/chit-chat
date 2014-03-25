'use strict';

var RoomItemView = Marionette.ItemView.extend({

  tagName: 'li',
  template: '#template-room'

});

var RoomCollectionView = Marionette.CompositeView.extend({

  template: '#template-room-container',
  itemView: RoomItemView,
  itemViewContainer: 'ul'

});

module.exports = RoomCollectionView;
