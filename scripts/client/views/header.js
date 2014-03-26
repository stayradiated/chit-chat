'use strict';

var HeaderView = Marionette.ItemView.extend({

  className: 'header',
  template: '#template-header',

  ui: {
    input: 'input',
  },
  
  events: {
    'change input': 'changeName'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  changeName: function () {
    var name = this.ui.input.val();
    this.model.set('name', name);
  }

});

module.exports = HeaderView;
