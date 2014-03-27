'use strict';

var CreateRoomView = Marionette.ItemView.extend({

  className: 'modal modal-room-create',
  template: '#template-model-room-create',

  ui: {
    input: 'input'
  },

  events: {
    'keydown input': 'onKeyDown',
    'click .primary': 'createRoom',
    'click .cancel': 'remove'
  },

  onShow: function () {
    this.ui.input.focus();
  },

  onKeyDown: function (e) {
    if (e.keyCode !== 13) return true;
    this.createRoom();
  },

  createRoom: function () {
    var name = this.ui.input.val().trim();
    if (! name) return;
    this.collection.add({
      id: Date.now(),
      name: name
    });
    this.remove();
  }

});

module.exports = CreateRoomView;

