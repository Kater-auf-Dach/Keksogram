'use strict';
(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var REQUEST_SUCCESS = 200,
    REQUEST_FAILURE = 400,
    REQUEST_FAILURE_TIMEOUT = 10000;
  var PHOTO_NUMBER = 12;

  var filtersForm = document.querySelector('.filters');
  var picturesContainer = document.querySelector('.pictures');
  var pictures;
  var currentPictures;
  var currentPage;

  filtersForm.classList.add('hidden');


  // Create DOM elements on a page from a template
  function showPictures(allPictures, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;


    if (replace) {
      picturesContainer.classList.remove('picture-failure');
      picturesContainer.innerHTML = '';
    }

    var pictureTemplate = document.getElementById('picture-template');
    var picturesFragment = document.createDocumentFragment();

    var picturesFrom = pageNumber * PHOTO_NUMBER;
    var picturesTo = picturesFrom + PHOTO_NUMBER;

    allPictures = allPictures.slice(picturesFrom, picturesTo);

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
      setTimeout(checkNextPage, 10)
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
      switch (loadedXhr.readyState) {
        case ReadyState.UNSENT:
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === REQUEST_SUCCESS) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('pictures-loading');
            callback(JSON.parse(data));
          }
          if (loadedXhr.status > REQUEST_FAILURE) {
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

  // Set the filters for a photos
  function filterPictures(sortPictures, sortValue) {
    var filteredPictures = sortPictures.slice(0);
    switch (sortValue) {
      case 'new':
        // Get new array contains the photos made last month
        var filteredPicturesNew = filteredPictures.filter(function(a) {
          var today = new Date();
          var lastMonth = today.setMonth(today.getMonth() - 2);
          var datePicture = Date.parse(a.date);
          return datePicture > lastMonth;
        });
        // And sort this new array
        filteredPictures = filteredPicturesNew.sort(function(a, b) {
          if (Date.parse(a.date) > Date.parse(b.date)) {
            return -1;
          }
          if (Date.parse(a.date) < Date.parse(b.date)) {
            return 1;
          }
          if (Date.parse(a.date) === Date.parse(b.date)) {
            return 0;
          }
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
    localStorage.setItem('filterValue', sortValue);
    return filteredPictures;
  }

  // Initial filters for a photos


  // function isHaveParent(element, className) {
  //   do {
  //     if (element.classList.contains(className)) {
  //       return true;
  //     }
  //     element = element.parentElement;
  //   } while (element);

  //   return false;
  // }

  // function initFilters() {
  //   var filterContainer = document.querySelector('.filters');
  //   filterContainer.addEventListener('click', function(event) {
  //     var clickedFilter = event.target;
  //     if (isHaveParent(clickedFilter, 'filters-radio')) {
  //       setActiveFilter(clickedFilter.value);
  //     }
  //   });
  // }


  function initFilters() {
    var filterContainer = document.querySelector('.filters');
    filterContainer.addEventListener('click', function(event) {
      var clickedFilter = event.target;

      while (clickedFilter !== filterContainer) {
        if (clickedFilter.className === 'filters-radio') {
          setActiveFilter(clickedFilter.value);
          return;
        }
        clickedFilter = clickedFilter.parentElement;
      }

    });
  }


  // Initial loading for a next photos at the scroll
  function setActiveFilter(sortValue) {
    document.getElementById('filter-' + sortValue).checked = true;
    currentPictures = filterPictures(pictures, sortValue);
    currentPage = 0;
    showPictures(currentPictures, currentPage, true);
  }

  function isNextPageAviable() {
    console.log(currentPage < Math.ceil(currentPictures.length / PHOTO_NUMBER));
    if (currentPictures.length <= PHOTO_NUMBER) {
      return false;
    }
    return currentPage < Math.ceil(currentPictures.length / PHOTO_NUMBER);
  }

  function isAtTheBottom() {
    var BOTTOM_GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - BOTTOM_GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAviable()) {
      window.dispatchEvent(new CustomEvent('atthebottom'));
    }
  }

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });

    window.addEventListener('atthebottom', function() {
      showPictures(currentPictures, ++currentPage, false);
    });
  }


  // Execute all this code
  initFilters();
  initScroll();
  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter(localStorage.getItem('filterValue') || 'filter-popular');
  });
})();
