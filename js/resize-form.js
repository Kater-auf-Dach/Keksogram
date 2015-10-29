'use strict';

define(['resize-picture'], function(Resizer) {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  //var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  prevButton.onclick = function(event) {
    event.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(event) {
    event.preventDefault();
    var resizeImage = resizer.exportImage();
    filterForm.elements['filter-image-src'] = resizeImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

});
