'use strict';

define(['resize-picture'], function(Resizer) {

  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

//
  var resizeFormX = resizeForm['resize-x'];
  var resizeFormY = resizeForm['resize-y'];
  var resizeSide  = resizeForm['resize-size'];

  resizeFormX.min = 50;
  resizeFormY.min = 50;
  resizeSide.min  = 50;


  previewImage.onload = function() {
    var previewImageX = previewImage.width;
    var previewImageY = previewImage.height;

    resizeFormX.max = previewImageX;
    resizeFormY.max = previewImageY;
    resizeSide.max = (previewImageX < previewImageY) ?  previewImageX : previewImageY;
  };

  resizeSide.onchange = function() {
    resizeFormX.max = resizeSide.value;
    resizeFormY.max = resizeSide.value;
    resizer.setConstraint(resizeFormX.value, resizeFormY.value, resizeSide.value);
  };

//
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

 window.addEventListener('resizerchange', function() {
   var photoConstraint = resizer.getConstraint();
   resizeFormX.value = Math.floor(photoConstraint.x);
   resizeFormY.value = Math.floor(photoConstraint.y);
   resizeSide.value = Math.floor(photoConstraint.side);
   //resizer.setConstraint(resizeFormX.value, resizeFormY.value, resizeSide.value);
 })

});
