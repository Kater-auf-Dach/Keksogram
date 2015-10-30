/*global Backbone*/
'use strict';

define(function() {

  var VideoView = Backbone.View.extend({
    event: {
      'click video': '_togglePlayback'
    },

    inialize: function() {
      this._togglePlayback = this._togglePlayback.bind(this);
    },

    render: function() {
      this.controls = false;
      this.src = this.model.get('url');
      this.type = 'video/mp4';
      this.poster = this.model.get('preview');
      this.addEventListener('onended', this.play())
    },

    _togglePlayback: function() {
      (this.paused) ? this.play() : this.pause();
    }
  });

  return VideoView;

});
