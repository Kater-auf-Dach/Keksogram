/* global Backbone */

'use strict';
(function() {

  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;
var photoTemplate = document.getElementById('picture-template');
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({

    initialize: function() {
      this._onPreviewLoad = this._onPreviewLoad.bind(this);
      this._onPreviewFail = this._onPreviewFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    events: {
      'click': '_onClick'
    },

    render: function() {
      //this.el = photoTemplate.content.children[0].cloneNode(true)
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');
      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');

      if(this.model.get('url')) {
        var photoPreview = new Image();
        photoPreview.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        photoPreview.addEventListener('load', this._onPreviewLoad);
        photoPreview.addEventListener('error', this._onPreviewFail);
        photoPreview.addEventListener('abort', this._onPreviewFail);
      }
    },

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

    _onPreviewFail: function(event) {
      clearTimeout(this._imageLoadTimeout);
      var failedPhoto = event.target;
      this.el.classList.add('picture-load-failure');
      this._cleanupPhotoListeners(failedPhoto);
    },

    _onClick: function(event) {
      event.preventDefault();
      if (!this.el.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    },

    _cleanupPhotoListeners: function(photo) {
      photo.removeEventListener('load', this._onPreviewLoad);
      photo.removeEventListener('error', this._onPreviewFail);
      photo.removeEventListener('abort', this._onPreviewFail);
    }

  });

  window.PhotoView = PhotoView;

})();
