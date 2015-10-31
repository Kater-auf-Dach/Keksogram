/*global Backbone*/
'use strict';

define(function() {

  var VideoView = Backbone.View.extend({
    initialize: function() {
      this._togglePlayback = this._togglePlayback.bind(this);
    },

    render: function() {
      this._video = document.createElement('video');
      this._video.src = this.model.get('url');
      this._video.loop = true;
      this._video.addEventListener('click', this._togglePlayback);

      this.el.replaceChild(this._video, this.el.querySelector('img'));   
      this.el.querySelector('.likes-count').textContent = this.model.get('likes');
      this.el.querySelector('.comments-count').textContent = this.model.get('comments');
    },

    _togglePlayback: function() {
      (this._video.paused) ? this._video.play() : this._video.pause();
    }
  });

  return VideoView;

});
