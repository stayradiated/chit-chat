'use strict';

var HeaderView = Marionette.ItemView.extend({

  className: 'header',
  template: '#template-header',

  ui: {
    input: 'input',
  },
  
  events: {
    'keydown input': 'onKeyDown',
    'blur input': 'changeName'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  onKeyDown: function (e) {
    if (e.keyCode !== 13) return true;
    this.ui.input.blur();
  },

  changeName: function () {
    console.log('changing name');
    var name = this.ui.input.val();
    this.model.set('name', name);
    this.model.save();
  }

});

module.exports = HeaderView;
