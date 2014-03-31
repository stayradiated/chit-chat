var Room = require('./room');

var Rooms = Backbone.Collection.extend({

  url: 'room',
  model: Room,

  initialize: function () {

    // whenever a room is selected, deselect the others
    this.on('change:selected', function (selectedRoom, selected) {
      if (! selected) return;
      this.each(function (room) {
        if (room === selectedRoom) return;
        room.set('selected', false);
      });
    });
  }

});

module.exports = Rooms;
