'use strict';

var DestroyRoomView = Marionette.ItemView.extend({

  className: 'modal modal-room-destroy',
  template: '#template-model-room-destroy',

  events: {
    'click .primary': 'destroyRoom',
    'click .cancel': 'remove'
  },

  destroyRoom: function () {
    this.model.destroy();
  }

});

module.exports = DestroyRoomView;
