(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

//
  var resizeFormX = resizeForm['resize-x'],
      resizeFormY = resizeForm['resize-y'],
      resizeSide  = resizeForm['resize-size'];

  resizeFormX.min = 0;
  resizeFormY.min = 0;
  resizeSide.min  = 10;

  previewImage.onload = function(evt) {
    var previewImageX = previewImage.width,
        previewImageY = previewImage.height;
    resizeFormX.max = previewImageX;
    resizeFormY.max = previewImageY;
    if(previewImageX < previewImageY) {
      resizeSide.max = previewImageX;
    }
    else {
      resizeSide.max = previewImageY;
    }
//    resizeSide.max = (previewImageX < previewImageY) ?  previewImageX : previewImageY;
//    Number(resizeSide.max);
//    console.log(resizeSide.max, resizeFormX.max, resizeFormY.max);
   };

  resizeSide.onchange = function(evt) {
    resizeFormX.max = resizeSide.value;
    resizeFormY.max = resizeSide.value;
  };

//
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
