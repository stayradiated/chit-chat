'use strict';

var App = new Marionette.Application();
var Users = require('./models/user');

App.user = new Users.prototype.model({
  name: 'George'
});

App.addRegions({
  header: '.header-container',
  content:'.content',
  sidebarA: '.sidebar-a',
  sidebarB: '.sidebar-b'
});

App.on('initialize:after', function () {
  Backbone.history.start();
});

$(function () {

  // load controllers
  require('./controllers/room');
  require('./controllers/user');
  require('./controllers/message');
  require('./controllers/header');

  App.start();
});

module.exports = App;
