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
    this.element = document.querySelector('.gallery-overlay');
    this.buttonClose = this.element.querySelector('.gallery-overlay-close');
    this._photoElement = this.element.querySelector('.gallery-overlay-preview');

    this._currentKey = '';
    this._photos = [];
    this._currentPhoto = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.buttonClose.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.buttonClose.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);

    this._photos = [];
    this._currentPhoto = 0;
  };

  Gallery.prototype._onPhotoClick = function(event) {
    event.preventDefault();
    this._setCurrentPhoto();
  };

  Gallery.prototype._onCloseClick = function(event) {
    event.preventDefault();
    this.hide();
  };

  Gallery.prototype._onDocumentKeyDown = function(event) {
    this._currentKey = event.keyCode;
    switch (this._currentKey) {
      case Key.LEFT:
        this._setCurrentPhoto(this._setCurrentPhoto - 1);
        break;
      case Key.RIGHT:
        this._setCurrentPhoto(this._setCurrentPhoto + 1);
        break;
      case Key.ESC:
        this.hide();
        break;
      default:
        break;
    }
  };

  Gallery.prototype._setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype._setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);
    if (this._currentPhoto === index) {
      return;
    }
    this._currentPhoto = index;
    this._showCurrentPhoto();
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
