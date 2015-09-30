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

  // Create DOM elements on page from template
  function showPictures(allPictures) {
    picturesContainer.classList.remove('picture-failure');
    picturesContainer.innerHTML = '';

    var pictureTemplate = document.getElementById('picture-template');
    var picturesFragment = document.createDocumentFragment();
    console.log(pictureTemplate);

    allPictures.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content ? pictureTemplate.content.children[0].cloneNode(true) : pictureTemplate.children[0].cloneNode(true);
      if (picture['url']) {
        var picturesPreview = new Image();
        picturesPreview.src = picture['url'];
        picturesPreview.width = 182;
        picturesPreview.height = 182;

        var imageLoadTimeout = setTimeout(function() {
          newPictureElement.classList.add('picture-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        picturesPreview.onload = function() {
          var oldImage = newPictureElement.getElementsByTagName('img')[0];
          newPictureElement.replaceChild(picturesPreview, oldImage);
          clearTimeout(imageLoadTimeout);
        };

        picturesPreview.onerror = function() {
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

  // Error on loading a picture
  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  // Get JSON through AJAX
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
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('picture-loading');
            callback(JSON.parse(data));
          }
          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };
    xhr.ontimeout = function() {
      showLoadFailure();
    };
    xhr.send();
  }

  // Set the filters for photos
  function filterPictures(sortPictures, sortValue) {
    var filteredPictures = sortPictures.slice(0);
    switch (sortValue) {
      case 'new':
        // Get new array contains photos made last month
        var filteredPicturesNew = filteredPictures.filter(function(a) {
          var today = new Date();
          var lastMonth = today.setMonth(today.getMonth() - 1);
          var datePicture = Date.parse(a.date);
          return datePicture > lastMonth;
        });
        // And sort this new array
        filteredPictures = filteredPicturesNew.sort(function(a, b) {
          return b.date - a.date;
        });
        break;
      case 'discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
      default:
        filteredPictures = sortPictures.slice(0);
        break;
    }
    return filteredPictures;
  }

  // Initial filters for photos
  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for ( var i = 0; i < filterElements.length; i++) {
      filterElements[i].onclick = function(event) {
        var clickedFilter = event.currentTarget;
        setActiveFilter(clickedFilter.value);
      };
    }
  }

  function setActiveFilter(sortValue) {
    var filteredPictures = filterPictures(pictures, sortValue);
    showPictures(filteredPictures);
  }

  // Execute all this code
  initFilters();
  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    showPictures(loadedPictures);
  });
})();
