/* global Backbone */

'use strict';
(function() {

  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @type {Element}
   */
  var photoTemplate = document.getElementById('picture-template');

  var photosPreview;
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({

    tagName: 'a',

    className: 'picture',

    initialize: function() {
      this._onPreviewLoad = this._onPreviewLoad.bind(this);
      this._onPreviewFail = this._onPreviewFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    events: {
      'click': '_onClick'
    },

    render: function() {
      this.el.appendChild(photoTemplate.content.children[0].cloneNode(true));
      this.el.querySelector('.picture-comments').textContent = this.model.get('comments');
      this.el.querySelector('.picture-likes').textContent = this.model.get('likes');

      if(this.model.get('url')) {
        photosPreview = new Image();
        photosPreview.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        photosPreview.addEventListener('load', this._onPreviewLoad);
        photosPreview.addEventListener('error', this._onPreviewFail);
        photosPreview.addEventListener('abort', this._onPreviewFail);
      }
    },

    _onPreviewLoad: function() {
      console.log(photosPreview);
      this.el.style.width = '182px';
      this.el.style.height = '182px';

      var oldImage = this.el.getElementsByTagName('img')[0];
      oldImage.parentNode.insertBefore(photosPreview,oldImage);
      oldImage.parentNode.removeChild(oldImage);

      clearTimeout(this._imageLoadTimeout);
    },

    _onPreviewFail: function() {
        this.el.classList.add('picture-load-failure');
    },
    
    _onClick: function() {
      event.preventDefault();
      if (!this.el.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    }

  });

  window.PhotoView = PhotoView;

})();
