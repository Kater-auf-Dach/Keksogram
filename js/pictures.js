'use strict';
(function() {

  var ReadyState = {
  'UNSENT': 0,
  'OPENED': 1,
  'HEADERS_RECEIVED': 2,
  'LOADING': 3,
  'DONE': 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var filtersForm = document.querySelector('.filters');
  var picturesContainer = document.querySelector('.pictures');
  var pictures;

  filtersForm.classList.add('hidden');

  function showPictures(pictures) {
    picturesContainer.classList.remove('picture-failure');
    picturesContainer.innerHTML = '';

    var pictureTemplate = document.getElementById('picture-template');
    var picturesFragment = document.createDocumentFragment();

    pictures.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content ? pictureTemplate.content.children[0].cloneNode(true) : pictureTemplate.children[0].cloneNode(true);
      if (picture['url']) {
          var picturesPreview = new Image();
          picturesPreview.src = picture['url'];
          picturesPreview.width = 182;
          picturesPreview.height = 182;

          var imageLoadTimeout = setTimeout(function() {
            newPictureElement.classList.add('picture-load-failure');
          }, REQUEST_FAILURE_TIMEOUT);

          picturesPreview.onload = function () {
            var oldImage = newPictureElement.getElementsByTagName('img')[0];
            newPictureElement.replaceChild(picturesPreview, oldImage);
            clearTimeout(imageLoadTimeout);
          };

          picturesPreview.onerror = function () {
            newPictureElement.classList.add('picture-load-failure');
          };

      }

      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

      picturesFragment.appendChild(newPictureElement);
    });

    picturesContainer.appendChild(picturesFragment);
    filtersForm.classList.remove('hidden');
  }

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPictures(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json');
    xhr.onreadystatechange = function(event) {
      var loadedXhr = event.target;

      switch (loadedXhr.ReadyState) {
        case ReadyState.UNSENT:
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status == 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('picture-loading');
            callback(JSON.parse(data));
          }
          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    }
    xhr.ontimeout = function () {
      showLoadFailure();
    }
    xhr.send();
  }

  function filterPictures(pictures, sortValue) {
    var filteredPictures = pictures.slice(0);
    switch (sortValue) {
      case 'popular':
        filteredPictures = filteredPictures.sort(function(a, b) {
           return 0;
        });
        break;
      case 'new':

        var filteredPicturesNew = filteredPictures.filter(function (a) {
          var today = new Date();
          var lastMonth = today.setMonth(today.getMonth() - 1);
          var datePicture = Date.parse(a.date);
          return datePicture > lastMonth;
        })
        console.log(filteredPicturesNew);

        filteredPictures = filteredPicturesNew.sort(function(a, b) {
          if (a.date > b.date) { return -1; }
          if (a.date < b.date) { return 1; }
          if (a.date === b.date) { return 0; }
        });
        break;
      case 'discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.comments > b.comments) { return -1; }
          if (a.comments < b.comments) { return 1; }
          if (a.comments === b.comments) { return 0; }
        });
        break;
      default:
        break;
    }
    return filteredPictures;
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for ( var i = 0; i < filterElements.length; i++) {
      filterElements[i].onclick = function (event) {
        var clickedFilter = event.currentTarget;
        setActiveFilter(clickedFilter.value);
      }
    }
  }

  function setActiveFilter(sortValue) {
    var filteredPictures = filterPictures(pictures, sortValue);
    showPictures(filteredPictures);
  }

  initFilters();
  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    showPictures(loadedPictures);
  });
})();
