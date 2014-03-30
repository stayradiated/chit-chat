'use strict';

var DestroyRoomView = Marionette.ItemView.extend({

  className: 'modal modal-room-destroy',
  template: '#template-model-room-destroy',

  events: {
    'click .primary': 'destroyRoom',
    'click .cancel': 'remove'
  },

  destroyRoom: function () {
    console.log('destroying room');
    this.model.destroy();
    this.remove();
  }

});

module.exports = DestroyRoomView;
