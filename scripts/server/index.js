'use strict';

var Jandal = require('jandal');
var sockjs = require('sockjs');
var express = require('express');
var _ = require('underscore');

var Socket = require('./socket');

var app = express();

app.configure(function () {
  app.use(express.static(__dirname + '/../../dist'));
});

var server = app.listen(8080);

var connection = sockjs.createServer();
connection.installHandlers(server, { prefix: '/socket' });

connection.on('connection', function (socket) {
  var jandal = new Jandal(socket, 'stream');
  new Socket(jandal);
});

