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

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({

    tagName: 'a',

    className: 'pictures',

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
        var photosPreview = new Image();
        photosPreview.src = this.model.get('url');

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        photosPreview.addEventListener('load', this._onPreviewLoad);
        photosPreview.addEventListener('error', this._onPreviewFail);
        photosPreview.addEventListener('abort', this._onPreviewFail);
      }
    },

    unrender: function() {
      this._el.parentNode.removeChild(this._el);
      this._el.removeEventListener('click', this._onClick);
      this._el = null;
    },

    _onPreviewLoad: function() {
          this.el.style.width = '182px';
          this.el.style.height = '182px';

          var oldImage = this.el.getElementsByTagName('img')[0];
          //this.el.replaceChild(photosPreview, oldImage);
          
          clearTimeout(this._imageLoadTimeout);
    },

    _onPreviewFail: function() {
        this.el.classList.add('picture-load-failure');
    },
    
    _onClick: function() {
      event.preventDefault();
      if (!this._el.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }
    }

  });

  window.PhotoView = PhotoView;

})();
