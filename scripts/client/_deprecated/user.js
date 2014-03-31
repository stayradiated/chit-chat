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
  },

  showUsers: function (userCollection) {
    var users = new UserCollectionView({
      collection: userCollection
    });
    App.sidebarRight.show(users);
  }

});


App.addInitializer(function () {
var controller = new Controller();
  controller.start();
});

module.exports = Controller;
