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

$(function () {

  var enabled = true;

  var enableSync = function () {
    enabled = true;
  };

  var connection = new SockJS('http://192.168.1.100:8080/socket');
  App.socket = new Jandal(connection, 'websocket');

  App.socketListen = function (event, fn) {
    App.socket.on(event, function (a, b, c) {
      if (! enabled) return;
      fn(a, b, c);
    });
  };

  Backbone.Model.prototype.url = function () {
    var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
    return base;
  };

  Backbone.sync = function (method, model, options) {
    var event = _.result(model, 'url') + '.' + method;

    console.log(event);

    var callback = _.compose(enableSync, options.success);

    enabled = false;

    switch (method) {
      case 'create':
        console.log('creating', model.toJSON());
        App.socket.emit(event, model.toJSON(), callback);
        break;
      
      case 'read':
        console.log('reading', event);
        App.socket.emit(event, callback);
        break;

      case 'update':
        console.log('update', model.toJSON());
        App.socket.emit(event, model.toJSON(), callback);
        break;

      case 'delete':
        console.log('delete', model.id);
        App.socket.emit(event, { id: model.id }, callback);
        break;

      default:
        enabled = true;
        break;
    }

  };

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

  App.socket.on('socket.open', function () {
    App.user.save();
    App.start();
  });

});

module.exports = App;
