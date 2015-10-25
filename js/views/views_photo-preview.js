/* global Backbone */
'use strict';

(function() {
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var GalleryView = Backbone.View.extend({

    /**
     * @override
     */
    render: function() {
      this.el.querySelector('img').src = this.model.get('url');
      this.el.querySelector('.likes-count').textContent = this.model.get('comments');
      this.el.querySelector('.comments-count').textContent = this.model.get('likes');
    }
  });

  window.GalleryView = GalleryView;
})();