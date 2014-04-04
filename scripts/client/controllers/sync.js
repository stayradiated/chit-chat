
var connection = new SockJS('/socket');
var socket = new Jandal(connection, 'websocket');
var log = require('log_')('sync', 'green');

Backbone.sync = function (method, model, options) {

  var attrs;

  if (method === 'patch') {
    method = 'update';
    attrs = _.pick(model.toJSON(), _.keys(options.attrs));
  } else {
    attrs = model.toJSON();
  }

  var event = _.result(model, 'url') + '.' + method;

  switch (method) {
    case 'create':
      log(event, model.toJSON());
      socket.emit(event, model.toJSON(), options.success);
      break;

    case 'read':
      log(event);
      socket.emit(event, options.success);
      break;

    case 'update':
      log(event, model.toJSON());
      socket.emit(event, model.toJSON(), options.success);
      break;

    case 'delete':
      log(event, model.id);
      socket.emit(event, { id: model.id }, options.success);
      break;

    default:
      log.warn('Ignored', event);
      enabled = true;
      break;
  }

};


Backbone.Model.prototype.url = function () {
  var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
  return base;
};

module.exports = socket;
