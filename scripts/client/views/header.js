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
    var name = this.ui.input.val().trim();
    if (! name) {
      this.ui.input.val(this.model.get('name'));
    } else {
      this.model.save({name: name}, {patch: true});
    }
  }

});

module.exports = HeaderView;
