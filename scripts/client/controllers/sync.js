
var connection = new SockJS('/socket');
var socket = new Jandal(connection, 'websocket');
var createLog = require('log_');

Backbone.sync = function (method, model, options) {

  var attrs;

  if (method === 'patch') {
    method = 'update';
    attrs = _.pick(model.toJSON(), _.keys(options.attrs));
  } else {
    attrs = model.toJSON();
  }

  var event = _.result(model, 'url') + '.' + method;
  var log = createLog(event, 'green');

  switch (method) {
    case 'create':
      log(model.toJSON());
      socket.emit(event, model.toJSON(), options.success);
      break;

    case 'read':
      log();
      socket.emit(event, options.success);
      break;

    case 'update':
      log(model.toJSON());
      socket.emit(event, model.toJSON(), options.success);
      break;

    case 'delete':
      log(model.id);
      socket.emit(event, { id: model.id }, options.success);
      break;

    default:
      log.warn('Ignored');
      enabled = true;
      break;
  }

};


Backbone.Model.prototype.url = function () {
  var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
  return base;
};

module.exports = socket;
