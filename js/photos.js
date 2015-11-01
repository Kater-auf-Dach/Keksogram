/*global Backbone */
'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'models/models_photo',
  'models/models_photos',
  'views/views_photo',
  'gallery',

  'resize-picture',
  'resize-form',
  'upload-form',
  'filter-form',
  'logo-background'
],
function(PhotoModel, PhotosCollection, PhotoView, Gallery) {
  /** @const {number} */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /** @const {number} */
  var PHOTO_NUMBER = 12;

  /** @type {Element} */
  var filtersForm = document.querySelector('.filters');

  /** @type {Element} */
  var photosContainer = document.querySelector('.pictures');

  /** @type {number} */
  var currentPage;

  /** @type {PhotosCollection} */
  var photosCollection = new PhotosCollection();

  /** @type {Gallery} */
  var gallery = new Gallery();

  /** @type {Array.<Object>} */
  var initiallyLoaded = [];

  /** @type {Array.<PhotoView>} */
  var renderedViews = [];

  filtersForm.classList.add('hidden');

  /**
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
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

    photosCollection.slice(photosFrom, photosTo).forEach(function(photoModelItem) {
      var view = new PhotoView({ model: photoModelItem });
      view.setElement(photoTemplate.content.children[0].cloneNode(true));
      view.render();
      fragment.appendChild(view.el);
      filtersForm.classList.remove('hidden');
      renderedViews.push(view);
      view.on('galleryclick', function() {
        gallery.setPhotos(photosCollection);
        gallery.setCurrentPhoto(photosCollection.models.indexOf(view.model));
        gallery.show();
      });
      setTimeout(checkNextPage, 10);
    });

    photosContainer.appendChild(fragment);
    filtersForm.classList.remove('hidden');
  }

  /**
   * Set the filters for a photos
   * @param {string} sortValue
   * @return {Array.<Object>}
   */
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
  }

  function parseURL() {
    var hashValue = location.hash;
    var filterName = hashValue.match(/^#filters\/(\S+)$/);
    if (filterName) {
      setActiveFilter(filterName[1]);
    } else {
      setActiveFilter('popular');
    }
  }


  // Initial filters for a photos
  function initFilters() {
    var filtersContainer = document.querySelector('.filters');
    filtersContainer.addEventListener('click', function(event) {
      var clickedFilter = event.target;

      while (clickedFilter !== filtersContainer) {
        if (clickedFilter.classList.contains('filters-radio')) {
          window.location.hash = 'filters/' + clickedFilter.value;
          return;
        }
        clickedFilter = clickedFilter.parentElement;
      }
    });
  }


  /** @param {string} sortValue */
  function setActiveFilter(sortValue) {
    document.getElementById('filter-' + sortValue).checked = true;
    filterPhotos(sortValue);
    currentPage = 0;
    renderPhotos(currentPage, true);
  }

  function showLoadFailure() {
    photosContainer.classList.add('pictures-failure');
  }

  /**
   * @returns {boolean}
   */
  function isNextPageAvailable() {
    if (photosCollection.length <= PHOTO_NUMBER) {
      return false;
    }
    return currentPage < Math.ceil(photosCollection.length / PHOTO_NUMBER);
  }

  /**
   * @returns {boolean}
   */
  function isAtTheBottom() {
    var BOTTOM_GAP = 100;
    return photosContainer.getBoundingClientRect().bottom - BOTTOM_GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
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
    window.addEventListener('hashchange', function() {
      parseURL();
    });
    initFilters();
    initScroll();
    parseURL();
  }).fail(function() {
    showLoadFailure();
  });

});
