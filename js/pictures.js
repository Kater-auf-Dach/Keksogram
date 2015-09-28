(function() {
  var IMAGE_FAILURE_TIMEOUT = 10000;

  var filtersForm = document.querySelector('.filters');
  filtersForm.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.getElementById('picture-template');
  var picturesFragment = document.createDocumentFragment();

  pictures.forEach(function(picture) {
    if(pictureTemplate.content) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
    }
    else {
      var newPictureElement = pictureTemplate.children[0].cloneNode(true);
    }
    if (picture['url']) {
        var picturesPreview = new Image();
        picturesPreview.src = picture['url'];
        picturesPreview.width = 182;
        picturesPreview.height = 182;

        var imageLoadTimeout = setTimeout(function() {
          newPictureElement.classList.add('picture-load-failure');
        }, IMAGE_FAILURE_TIMEOUT);

        picturesPreview.onload = function () {
          var oldImage = newPictureElement.getElementsByTagName('img')[0];
          newPictureElement.replaceChild(picturesPreview, oldImage);
          clearTimeout(imageLoadTimeout);
        }

        picturesPreview.onerror = function (event) {
          newPictureElement.classList.add('picture-load-failure');
        }

    }

    newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

    picturesFragment.appendChild(newPictureElement);
  });

  picturesContainer.appendChild(picturesFragment);
  filtersForm.classList.remove('hidden');
})();
