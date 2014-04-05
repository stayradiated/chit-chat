'use strict';

var Jandal = require('jandal');
var JandalLog = require('jandal-log/client');
var sockjs = require('sockjs');
var express = require('express');
var _ = require('underscore');

var Socket = require('./socket');

var app = express();

var fs = require('fs');
console.log(fs.readdirSync(__dirname + '/../../dist/css'));
console.log(fs.readdirSync(__dirname + '/../../dist/js'));

app.configure(function () {
  app.use(express.static(__dirname + '/../../dist'));
});

var server = app.listen(process.env.PORT || 8080);

var connection = sockjs.createServer();
connection.installHandlers(server, { prefix: '/socket' });

connection.on('connection', function (socket) {
  var jandal = new Jandal(socket, 'stream');
  JandalLog.infect(jandal);
  new Socket(jandal);
});

