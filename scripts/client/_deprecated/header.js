'use strict';

var App = require('../app');
var HeaderView = require('../views/header');

var HeaderController = function () {

};

_.extend(HeaderController.prototype, {

  start: function () {
    this.showHeader(App.user);
  },

  showHeader: function (model) {
    var headerView = new HeaderView({
      model: model
    });
    App.header.show(headerView);
  }

});

App.addInitializer(function () {
  var controller = new HeaderController();
  controller.start();
});


module.exports = HeaderController;
