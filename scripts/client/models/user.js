'use strict';

var App = require('../app');

var User = Backbone.RelationalModel.extend({

  defaults: {
    name: ''
  }

});

var Users = Backbone.Collection.extend({

  model: User,

  initialize: function () {
    this.listenTo(this, 'add', function (model) {
      if (this !== App.users) {
        App.users.add(model);
      }
    });
  }

});


module.exports = Users;
