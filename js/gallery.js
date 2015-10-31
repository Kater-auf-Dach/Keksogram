/*global Backbone */
'use strict';

define([
  'views/views_photo-preview',
  'views/views_video-preview'
], function(GalleryView, VideoView) {
  /**
   * @enum {number}
   */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * @param value
   * @param min
   * @param max
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * @constructor
   */
  var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._galleryOverlay = document.querySelector('.gallery-overlay');
    this._photoContainer = this._galleryOverlay.querySelector('.gallery-overlay-preview');
    this._photo = this._galleryOverlay.querySelector('img');
    this._buttonClose = this._galleryOverlay.querySelector('.gallery-overlay-close');

    // Fix event handlers's context
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };


  /**
   * @param {Collection} photos
   */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  /**
   * @param index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);
    if (this._currentPhoto === index) {
      return;
    }
    this._currentPhoto = index;
  };

  /**
   * @private
   */
  Gallery.prototype._showCurrentPhoto = function() {
    var currentModel = this._photos.at(this._currentPhoto);
    var galleryElement;
    if (currentModel.get('preview')) {
      galleryElement = new VideoView({ model: currentModel });
    } else {
      galleryElement = new GalleryView({ model: currentModel });
    }
    galleryElement.setElement(this._photoContainer);
    galleryElement.render();
  };


  Gallery.prototype.show = function() {
    this._galleryOverlay.classList.remove('invisible');
    this._photo.addEventListener('click', this._onPhotoClick);
    this._buttonClose.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._galleryOverlay.classList.add('invisible');
    this._photo.removeEventListener('click', this._onPhotoClick);
    this._buttonClose.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);

    this._currentPhoto = 0;
  };

  // Event handlers

  /**
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
    this._showCurrentPhoto();
  };

  /**
   * @param {MouseEvent} event
   * @private
   */
  Gallery.prototype._onCloseClick = function(event) {
    event.preventDefault();
    this.hide();
  };

  /**
   * @param {KeyboardEvent} event
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(event) {
    this._currentKey = event.keyCode;
    switch (this._currentKey) {
      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        this._showCurrentPhoto();
        break;
      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        this._showCurrentPhoto();
        break;
      case Key.ESC:
        this.hide();
        break;
      default:
        break;
    }
  };

  return Gallery;
});
