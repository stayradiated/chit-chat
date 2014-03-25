'use strict';

var User = Backbone.Model.extend({

  defaults: {
    name: ''
  }

});

var Users = Backbone.Collection.extend({

  model: User

});

module.exports = Users;
