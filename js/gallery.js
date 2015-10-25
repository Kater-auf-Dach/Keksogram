/* global Backbone*/
'use strict';
(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._galleryElement = document.querySelector('.gallery-overlay');
    this._photoElement = this._galleryElement.querySelector('.gallery-overlay-preview');
    this._buttonClose = this._galleryElement.querySelector('.gallery-overlay-close');

    //this._currentKey = '';
    //this._photos = [];
    //this._currentPhoto = 0;

    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  Gallery.prototype.show = function() {
    this._galleryElement.classList.remove('invisible');
    this._photoElement.addEventListener('click', this._onPhotoClick);
    this._buttonClose.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._galleryElement.classList.add('invisible');
    this._photoElement.removeEventListener('click', this._onPhotoClick);
    this._buttonClose.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);

    this._photos.reset();
    this._currentPhoto = 0;
  };

  Gallery.prototype._onPhotoClick = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
    this._showCurrentPhoto();
  };

  Gallery.prototype._onCloseClick = function(event) {
    event.preventDefault();
    this.hide();
  };

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

  Gallery.prototype.setPhotos = function( photos) {
    this._photos = photos;
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);
    if (this._currentPhoto === index) {
      return;
    }
    this._currentPhoto = index;

  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._photoElement.innerHTML = '';

    var imageElement = new Image();
    imageElement.src = this._photos[this._currentPhoto];
    imageElement.onload = function() {
      this._photoElement.appendChild(imageElement);
    }.bind(this);
  };

  window.Gallery = Gallery;
})();
