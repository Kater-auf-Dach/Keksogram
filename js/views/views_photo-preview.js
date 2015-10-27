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

    _toggleLike: function() {
      if (this.model.get('liked')) {
        this.model.dislike();
        this.el.querySelector('.likes-count').classList.remove('likes-count-liked');
      } else {
        this.model.like();
        this.el.querySelector('.likes-count').classList.add('likes-count-liked');
      }
    },

    /**
     * @param {MouseEvent} event
     * @private
     */
    _onLikeClick: function(event) {
      event.preventDefault();
      this._toggleLike();
      this.render();
    }

  });

  window.GalleryView = GalleryView;
})();
