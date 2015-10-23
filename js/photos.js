/* global PhotoModel, PhotoView, PhotosCollection */
'use strict';

(function() {
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PHOTO_NUMBER = 12;

  var filtersForm = document.querySelector('.filters');
  var photosContainer = document.querySelector('.pictures');
  var currentPage;

  var photosCollection = new PhotosCollection();
  var gallery = new Gallery();

  var initiallyLoaded = [];
  var renderedViews = [];

  filtersForm.classList.add('hidden');

  function renderPhotos(pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0;

    var fragment = document.createDocumentFragment();
    var photoTemplate = document.getElementById('picture-template');

    var photosFrom = pageNumber * PHOTO_NUMBER;
    var photosTo = photosFrom + PHOTO_NUMBER;

    if (replace) {
      while (renderedViews.length) {
        var viewForRemove = renderedViews.shift();
        photosContainer.removeChild(viewForRemove.el);
        viewForRemove.off('galleryclick');
        viewForRemove.remove();
      }
    }

    photosCollection.slice(photosFrom, photosTo).forEach(function(model) {
      var view = new PhotoView({ 
        model: model, 
        el: photoTemplate.content.children[0].cloneNode(true) 
      });
      view.render();
      fragment.appendChild(view.el);
      filtersForm.classList.remove('hidden');
      renderedViews.push(view);
      view.on('galleryclick', function() {
        gallery.setPhotos(photosCollection);
        gallery.showPhoto(view.model);
        gallery.show();
      });
      setTimeout(checkNextPage, 10);
    });

    photosContainer.appendChild(fragment);
    filtersForm.classList.remove('hidden');
  }

  // Set the filters for a photos
  function filterPhotos(sortValue) {
    var filteredPhotos = initiallyLoaded.slice(0);
    switch (sortValue) {
      case 'popular':
        filteredPhotos = filteredPhotos.sort(function(a, b) {
          return b.likes - a.likes;
        });
        break;
      case 'new':
        // Get new array contains the photos made last month
        var filteredPicturesNew = filteredPhotos.filter(function(a) {
          var today = new Date();
          var lastMonth = today.setMonth(today.getMonth() - 2);
          var datePicture = Date.parse(a.date);
          return datePicture > lastMonth;
        });
        // And sort this new array
        filteredPhotos = filteredPicturesNew.sort(function(a, b) {
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
        filteredPhotos = filteredPhotos.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }
    photosCollection.reset(filteredPhotos);
    localStorage.setItem('filterValue', sortValue);
  }


  // Initial filters for a photos
  function initFilters() {
    var filtersContainer = document.querySelector('.filters');
    filtersContainer.addEventListener('click', function(event) {
      var clickedFilter = event.target;

      while (clickedFilter !== filtersContainer) {
        if (clickedFilter.classList.contains('filters-radio')) {
          setActiveFilter(clickedFilter.value);
          return;
        }
        clickedFilter = clickedFilter.parentElement;
      }
    });
  }

  function setActiveFilter(sortValue) {
    document.getElementById('filter-' + sortValue).checked = true;
    filterPhotos(sortValue);
    currentPage = 0;
    renderPhotos(currentPage, true);
  }

  function showLoadFailure() {
    photosContainer.classList.add('pictures-failure');
  }

  function isNextPageAvailable () {
    if (photosCollection.length <= PHOTO_NUMBER) {
      return false;
    }
    return currentPage < Math.ceil(photosCollection.length / PHOTO_NUMBER);
  }

  function isAtTheBottom() {
    var BOTTOM_GAP = 100;
    return photosContainer.getBoundingClientRect().bottom - BOTTOM_GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable ()) {
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
      renderPhotos(++currentPage, false);
    });
  }

  photosCollection.fetch({ timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    initFilters();
    initScroll();
    setActiveFilter(localStorage.getItem('filterValue') || 'popular');
  }).fail(function() {
    showLoadFailure()
  });
})();