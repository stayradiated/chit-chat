'use strict';

var UserItemView = Marionette.ItemView.extend({

  tagName: 'li',
  template: '#template-user',

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  }

});

var UserCompositeView = Marionette.CompositeView.extend({

  className: 'users',
  template: '#template-user-container',

  itemView: UserItemView,
  itemViewContainer: 'ul'

});

module.exports = UserCompositeView;
