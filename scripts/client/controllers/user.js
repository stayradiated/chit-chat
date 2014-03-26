'use strict';

var App = require('../app');
var UserCollection = require('../models/user');
var UserCollectionView = require('../views/user');

var Controller = function () {
  this.userCollection = new UserCollection();
};

_.extend(Controller.prototype, {

  start: function () {
    this.showUsers(this.userCollection);

    // this.userCollection.fetch();

    this.userCollection.add({
      name: 'My user',
      users: 20
    });

    this.userCollection.add({
      name: 'My other user',
      users: 42
    });

  },

  showUsers: function (userCollection) {
    var users = new UserCollectionView({
      collection: userCollection
    });
    App.sidebarB.show(users);
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
