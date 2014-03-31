var User = Backbone.RelationalModel.extend({

  url: 'user', 

  defaults: {
    name: ''
  }

});

module.exports = User;
