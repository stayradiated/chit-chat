'use strict';

var App = require('../app');
var UserCollection = require('../models/user');
var UserCollectionView = require('../views/user');

var Controller = function () {
  this.userCollection = App.users;
};

_.extend(Controller.prototype, {

  start: function () {
    var self = this;
    this.userCollection.fetch();

    this.showUsers(this.userCollection);

    App.socketListen('user.create', function (user) {
      self.userCollection.add(user);
    });

    App.socketListen('user.update', function (user) {
      self.userCollection.get(user.id).set(user);
    });

  },

  showUsers: function (userCollection) {
    var users = new UserCollectionView({
      collection: userCollection
    });
    App.sidebarRight.show(users);
  },

  openUser: function (userId) {
    App.vent.trigger('user:open', (userId && userId.trim()) || '');
  }

});


App.addInitializer(function () {
var controller = new Controller();
  controller.start();
});

module.exports = Controller;
