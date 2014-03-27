'use strict';

var App = new Marionette.Application();

App.addRegions({
  header: '.header-container',
  message:'.message-container',
  input: '.input-container',
  sidebarLeft: '.sidebar-left',
  sidebarRight: '.sidebar-right',
  modal: '.modal-container'
});

App.on('initialize:after', function () {
  Backbone.history.start();
});

$(function () {

  // Create local user model
  var Users = require('./models/user');
  App.users = new Users();

  App.user = new Users.prototype.model({
    name: 'George'
  });

  App.users.add(App.user);

  // load controllers
  require('./controllers/room');
  require('./controllers/user');
  require('./controllers/message');
  require('./controllers/header');
  require('./controllers/modal');

  App.start();
});

module.exports = App;
