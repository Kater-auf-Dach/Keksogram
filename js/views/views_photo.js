/*global Backbone */
'use strict';

define(function() {

  /** @const {number} */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({
    /** @override */
    initialize: function() {

      // Fix event handlers's context
      this._onPreviewLoad = this._onPreviewLoad.bind(this);
      this._onPreviewFail = this._onPreviewFail.bind(this);
      this._onClick = this._onClick.bind(this);
      this._getSrc = this._getSrc.bind(this);
    },

    /** @type {Object.<string, string>} */
    events: {
      'click': '_onClick'
    },

    /** @override */
    render: function() {
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');
      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');
      this._getSrc();
    },

    /**
     * @private
     */
    _getSrc: function() {
      var photoPreview = new Image();

      if (this.model.get('preview')) {
        photoPreview.src = this.model.get('preview');
      } else if (this.model.get('url')) {
        photoPreview.src = this.model.get('url');
      }

      this._imageLoadTimeout = setTimeout(function() {
        this.el.classList.add('picture-load-failure');
      }.bind(this), REQUEST_FAILURE_TIMEOUT);

      photoPreview.addEventListener('load', this._onPreviewLoad);
      photoPreview.addEventListener('error', this._onPreviewFail);
      photoPreview.addEventListener('abort', this._onPreviewFail);
    },

    /**
     * @param {Event} event
     * @private
     */
    _onPreviewLoad: function(event) {
      var loadedPhoto = event.target;

      loadedPhoto.width = 182;
      loadedPhoto.height = 182;

      var oldPhoto = this.el.querySelector('img');
      this.el.replaceChild(loadedPhoto, oldPhoto);

      this.el.classList.remove('picture-load-failure');
      this._cleanupPhotoListeners(loadedPhoto);
      clearTimeout(this._imageLoadTimeout);
    },

    /**
     * @param {Event} event
     * @private
     */
    _onPreviewFail: function(event) {
      clearTimeout(this._imageLoadTimeout);
      var failedPhoto = event.target;
      this.el.classList.add('picture-load-failure');
      this._cleanupPhotoListeners(failedPhoto);
    },

    /**
     * @param {MouseEvent} event
     * @private
     */
    _onClick: function(event) {
      event.preventDefault();
      if (!this.el.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    },

    /**
     * @param {Image} photo
     * @private
     */
    _cleanupPhotoListeners: function(photo) {
      photo.removeEventListener('load', this._onPreviewLoad);
      photo.removeEventListener('error', this._onPreviewFail);
      photo.removeEventListener('abort', this._onPreviewFail);
    }

  });

  return PhotoView;

});
