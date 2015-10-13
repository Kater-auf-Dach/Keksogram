'use strict';

(function() {

  // var Key = {
  //   'ESC': 27,
  //   'LEFT': 37,
  //   'RIGHT': 39
  // };

  var KEY_ESC = 27;

  var picturesContainer = document.querySelector('.pictures');
  var galleryContainer = document.querySelector('.gallery-overlay');
  var buttonClose = galleryContainer.querySelector('.gallery-overlay-close');

  function isHaveParent(element, className) {
    do {
      if (element.classList.contains(className)) {
        return true;
      }
      element = element.parentElement;
    } while (element);

    return false;
  }

  function hideGallery() {
    galleryContainer.classList.add('invisible');
    buttonClose.removeEventListener('click', closeHandler);
    document.removeEventListener('keydown', keyHandler);
  }

  function closeHandler(event) {
    event.preventDefault();
    hideGallery();
  }

  // function keyHandler(event) {
  //   switch (event.keyCode) {
  //     case Key.LEFT:
  //       console.log('show previous photo');
  //       break;
  //     case Key.RIGHT:
  //       console.log('show previous photo');
  //       break;
  //     case Key.ESC:
  //     default:
  //       hideGallery();
  //       break;
  //   }
  // }

  function keyHandler(event) {
    if (event.keyCode === KEY_ESC) {
      hideGallery();
    }
  }

  function showGallery() {
    event.preventDefault();
    galleryContainer.classList.remove('invisible');
    buttonClose.addEventListener('click', closeHandler);
    document.addEventListener('keydown', keyHandler);
  }


  picturesContainer.addEventListener('click', function() {
    if (isHaveParent(event.target, 'picture')) {
      showGallery();
    }
  })
})();
