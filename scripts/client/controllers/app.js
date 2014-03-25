'use strict';

var App = new Backbone.Marionette.Application();

App.addRegions({
  rooms:'.rooms',
  users: '.users',
  messages: '.messages'
});

App.on('initialize:after', function () {
  Backbone.history.start();
});

$(function () {
  require('./room');
  App.start();
});

module.exports = App;
