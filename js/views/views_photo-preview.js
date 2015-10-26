/* global Backbone */
'use strict';

(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var GalleryView = Backbone.View.extend({

    events: {
      'click .likes-count': '_onLikeClick'
    },

    /**
     * Fix events handler context
     * @override
     */
    inialize: function() {
      this._onLikeClick = this._onLikeClick.bind(this);
    },

    render: function() {
      this.el.querySelector('img').src = this.model.get('url');
      this.el.querySelector('.likes-count').textContent = this.model.get('likes');
      this.el.querySelector('.comments-count').textContent = this.model.get('comments');
    },

    /**
     * @param {MouseEvent} event
     * @private
     */
    _onLikeClick: function(event) {
      event.preventDefault();
      if (this.model.get('liked')) {
        this.model.dislike();
      } else {
        this.model.like();
      }
      this.render();
    }

  });

  window.GalleryView = GalleryView;
})();
