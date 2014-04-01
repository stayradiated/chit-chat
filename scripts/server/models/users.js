'use strict';

var Backbone = require('backbone');
var User = require('./user');

var Users = Backbone.Collection.extend({

  model: User

});

module.exports = Users;
