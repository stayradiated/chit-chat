var User = require('./user');

var Users = Backbone.Collection.extend({

  url: 'user',
  model: User

});


module.exports = Users;
