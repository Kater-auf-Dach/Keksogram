/* global Backbone */
'use strict';

(function() {
  var GalleryView = Backbone.View.extend({
    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    events: {
      'click .gallery-overlay-image': '_onClick'
    },

    render: function() {
      this.el.querySelector('.gallery-overlay-image').src = this.model.get('url');
      this.el.querySelector('.likes-count').textContent = this.model.get('likes');
      this.el.querySelector('.comments-count').textContent = this.model.get('comments');
    },

    _onClick: function() {
      event.preventDefault();
      this.render();
    }
  });

  window.GalleryView = GalleryView;
})();