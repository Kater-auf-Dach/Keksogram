/* global Backbone*/
'use strict';

(function() {

  /**
   * @enum {number}
   */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * @constructor
   */
  var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._galleryOverlay = document.querySelector('.gallery-overlay');
    this._photoContainer = this._galleryOverlay.querySelector('.gallery-overlay-preview');
    this._buttonClose = this._galleryOverlay.querySelector('.gallery-overlay-close');

    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };


  /**
   * @param photos
   */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  /**
   * @param index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    this._currentPhoto = this._photos.indexOf(index);
  };

  /**
   * @private
   */
  Gallery.prototype._showCurrentPhoto = function() {
    console.log(this._currentPhoto);

    /**
     * @type {*|GalleryView}
     */
    var galleryElement = new GalleryView({ model: this._photos.at(this._currentPhoto) });
    galleryElement.setElement(this._photoContainer);
    galleryElement.render();
  };


  Gallery.prototype.show = function() {
    this._galleryOverlay.classList.remove('invisible');
    this._photoContainer.addEventListener('click', this._onPhotoClick);
    this._buttonClose.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._galleryOverlay.classList.add('invisible');
    this._photoContainer.removeEventListener('click', this._onPhotoClick);
    this._buttonClose.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);

    this._photos.reset();
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

  window.Gallery = Gallery;
})();
