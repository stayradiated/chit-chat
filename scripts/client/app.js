'use strict';

var App = new Marionette.Application();
var User = require('./models/user');
var Sync = require('./controllers/sync');

App.addRegions({
  header: '.header-container',
  message:'.message-container',
  input: '.input-container',
  sidebarLeft: '.sidebar-left',
  sidebarRight: '.sidebar-right',
  modal: '.modal-container'
});

$(function () {

  // load sockets
  require('./controllers/socket');

  App.user = new User({
    name: 'Guest' + Math.floor(Math.random() * 100)
  });

  // load views
  require('./controllers/views');

  Sync.on('socket.open', function () {
    App.user.save();
    App.start();
  });

});

module.exports = App;
