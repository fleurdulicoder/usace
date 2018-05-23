var App = {};
App.navHidden = false;
App.hideNavAt = document.getElementById('news-section').offsetTop-100 || 100;
App.navHeader = document.getElementById('nav-header');
App.backToTop = document.getElementById('back-to-top');

/* hide navigation at the top on scroll */
window.onscroll = function() {
  var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  if (scrollTop > App.hideNavAt && !App.navHidden) {
    App.navHeader.className += ' hidden';
    App.navHidden = true;
  } else if (scrollTop < App.hideNavAt && App.navHidden) {
    App.navHeader.className = App.navHeader.className.replace(' hidden','');
    App.navHidden = false;
  }
};

/* show back to top button */
document.getElementById('back-to-top').addEventListener('click', function() {
  TweenLite.to(window, 0.5, {scrollTo: 0, ease: 'cubic-bezier(.41,.73,.47,.96)'});
}, false);

/* news component, page by page viewing, responsive */
var NewsCarousel = function(stripId, leftControlId, rightControlId){
  var strip = stripId ? document.getElementById(stripId) : null;
  var leftControl = leftControlId ? document.getElementById(leftControlId) : null;
  var rightControl = rightControlId ? document.getElementById(rightControlId) : null;
  if (!strip || !leftControl || !rightControl) return;

  var current = 0,
      quantity = strip.children.length,
      distance = getDistance();

  function getDistance() {
    return strip.parentNode.getBoundingClientRect().width ||
      strip.getBoundingClientRect().width/quantity || 0;
  }

  function moveLeft() {
    if (current + 1 <= 0) {
      TweenLite.to(strip, 0.4, {
        x: (++current*distance),
        ease: 'cubic-bezier(.41,.73,.47,.96)'
      });
    }
  }

  function moveRight() {
    if (Math.abs(current - 1) < quantity) {
      TweenLite.to(strip, 0.4, {
        x: (--current*distance),
        ease: 'cubic-bezier(.41,.73,.47,.96)'
      });
    }
  }

  var debouncedFn = debounce(getDistance, 250);
  window.addEventListener('resize', debouncedFn);

  leftControl.addEventListener('click', moveLeft, false);
  rightControl.addEventListener('click', moveRight, false);
  leftControl.addEventListener('touch', moveLeft, false);
  rightControl.addEventListener('touch', moveRight, false);
};

// video component
var BannerHeadlinesRotator = function(headlinesId, time){
  var root = document.getElementById(headlinesId);
  if (!root) return;

  var rotationTime = time || 3000;
  var count, length, distance, animeOffset;
  function reset() {
    count = -1;
    length = root.children.length;
    distance = getDistance();
    animeOffset = 16;
    TweenLite.set(root, {
      opacity: 0,
      x: 0
    });
  }

  function getDistance() {
    return root.parentNode.getBoundingClientRect().width || root.getBoundingClientRect().width/length;
  }

  function putIntoPosition() {
    TweenLite.set(root, {
      x: (-count)*distance+animeOffset,
      opacity: 0
    });
  }

  function animateHeadline() {
    TweenLite.to(root, 0.5, {
      x: (-count)*distance,
      opacity: 1,
      ease: 'cubic-bezier(.41,.73,.47,.96)',
      onComplete: function(){
       window.setTimeout(function() {
         removeFromPosition();
       }, rotationTime);
      }
    });
  }

  function removeFromPosition() {
    TweenLite.to(root, 0.5, {
      x: (-count)*distance+animeOffset,
      opacity: 0,
      onComplete: function(){
       pickNext();
      }
    });
  }

  function pickNext() {
    count++;
    if (count >= length) count = 0;
    putIntoPosition();
    animateHeadline();
  }

  var debouncedFn = debounce(reset, 250);
  window.addEventListener('resize', debouncedFn);

  window.setTimeout(function(){
    reset();
    pickNext();
  }, 1000);
};

// Underscore.js: Debounce function for JS performance
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

document.addEventListener('DOMContentLoaded', function(){
  var bannerHeadlinesRotator = new BannerHeadlinesRotator('headlines-list');
  var newsCarousel = new NewsCarousel('news-carousel', 'news-carousel-control-left', 'news-carousel-control-right');
}, false);
