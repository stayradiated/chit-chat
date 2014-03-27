'use strict';

var App = require('../app');
var UserCollection = require('../models/user');
var UserCollectionView = require('../views/user');

var Controller = function () {
  this.userCollection = App.users;
};

_.extend(Controller.prototype, {

  start: function () {
    this.showUsers(this.userCollection);

    // this.userCollection.fetch();

    this.userCollection.add({
      name: 'Jono'
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
