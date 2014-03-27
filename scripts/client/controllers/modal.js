'use strict';

var App = require('../app');
var CreateRoomView = require('../views/modals/createRoom');
var DestroyRoomView = require('../views/modals/destroyRoom');

var ModalController = function () {
  App.vent.on('modal:room:create', this.showCreateRoom, this);
  App.vent.on('modal:room:destroy', this.showDestroyRoom, this);
};

_.extend(ModalController.prototype, {

  showCreateRoom: function (collection) {
    var view = new CreateRoomView({
      collection: collection
    });
    App.modal.show(view);
  },

  showDestroyRoom: function (model) {
    var view = new DestroyRoomView({
      model: model
    });
    App.modal.show(view);
  }

});

App.addInitializer(function () {
  var modalController = new ModalController();
});

module.exports= ModalController;
