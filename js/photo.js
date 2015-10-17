'use strict';
(function() {

  var Photo = function(id, data) {
    this.id = id;
    this._data = data;
    this._element = null;
    this._onClick = this._onClick.bind(this);
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var pictureTemplate = document.getElementById('picture-template');

  Photo.prototype.render = function(container) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];

    container.appendChild(newPictureElement);

    var picturesPreview = new Image();
    picturesPreview.src = this._data['url'];

    var imageLoadTimeout = setTimeout(function() {
      newPictureElement.classList.add('picture-load-failure');
    }, REQUEST_FAILURE_TIMEOUT);

    picturesPreview.onload = function() {
      picturesPreview.style.width = '182px';
      picturesPreview.style.height = '182px';

      var oldImage = newPictureElement.getElementsByTagName('img')[0];

      newPictureElement.replaceChild(picturesPreview, oldImage);
      clearTimeout(imageLoadTimeout);
    };

    picturesPreview.onerror = function() {
      newPictureElement.classList.add('picture-load-failure');
    };

    this._element = newPictureElement;
    this._element.addEventListener('click', this._onClick);
  };

  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  Photo.prototype._onClick = function(event) {
    event.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('galleryclick', { detail: { pictureElement: this }});
      window.dispatchEvent(galleryEvent);
    }
  };

  Photo.prototype.getCurrentPhoto = function() {
    return this._data.url;
  };

  window.Photo = Photo;

})();