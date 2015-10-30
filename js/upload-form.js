'use strict';

define(['resize-picture'], function(Resizer) {
  /**
  * @type {Resizer}
  */
  var resizer;

  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var fileElement = uploadForm['upload-file'];

  function uploadImage(element, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      var image = event.target.result;
      callback(image);
    };

    fileReader.readAsDataURL(element.files[0]);
  }

  fileElement.onchange = function() {
    if (fileElement.value) {
      fileElement.classList.add('upload-input-hasvalue');
    }
  };

  uploadForm.onsubmit = function(event) {
    event.preventDefault();

    uploadImage(fileElement, function(image) {
      sessionStorage.setItem('uploaded-image', image);
      resizeForm.querySelector('.resize-image-preview').src = image;
      filterForm.querySelector('.filter-image-preview').src = image;

      resizer = new Resizer(image);
      resizer.setElement(resizeForm);

      uploadForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });
  };

  uploadForm.onreset = function() {
    fileElement.classList.remove('upload-input-hasvalue');
  };

});
