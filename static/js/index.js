window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			// false: built-in pause only watches .slider-container; moving to nav restarts autoplay. We pause on .slider wrapper below.
			pauseOnHover: false
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    var parallelismCarousel = carousels.find(function (c) {
      return c.element && c.element.classList && c.element.classList.contains('carousel-parallelism');
    });
    var parallelismSlideSyncTimer;
    var videoSel = '.carousel-parallelism-defer-video';

    function syncParallelismAutoplayWithVideoSlide() {
      if (!parallelismCarousel) return;
      var idx = parallelismCarousel.state.index;
      var slide = parallelismCarousel.slides[idx];
      var onVideoSlide = slide && slide.querySelector(videoSel);
      if (onVideoSlide) {
        parallelismCarousel.stop();
      } else {
        parallelismCarousel.start();
      }
    }

    if (parallelismCarousel && typeof parallelismCarousel.on === 'function') {
      parallelismCarousel.on('show', function () {
        clearTimeout(parallelismSlideSyncTimer);
        parallelismSlideSyncTimer = setTimeout(syncParallelismAutoplayWithVideoSlide, 400);
      });
      parallelismCarousel.element.querySelectorAll(videoSel).forEach(function (v) {
        v.addEventListener('ended', function () {
          parallelismCarousel.start();
        });
      });
    }

    // Pause autoplay whenever pointer is anywhere over the carousel (slides, nav, pagination), not only .slider-container.
    carousels.forEach(function (carousel) {
      if (!carousel.wrapper || !carousel.options.autoplay) return;
      var onLeave = function () {
        if (carousel === parallelismCarousel) {
          syncParallelismAutoplayWithVideoSlide();
        } else {
          carousel.start();
        }
      };
      carousel.wrapper.addEventListener('mouseenter', function () {
        carousel.stop();
      });
      carousel.wrapper.addEventListener('mouseleave', onLeave);
    });

    bulmaSlider.attach();

    var teaserP1 = document.getElementById('teaser-p1');
    var teaserP2 = document.getElementById('teaser-p2');
    var teaserPrev = document.getElementById('teaser-prev');
    var teaserNext = document.getElementById('teaser-next');
    if (teaserP1 && teaserP2) {
      var teaserClips = [teaserP1, teaserP2];
      var teaserIndex = 0;

      function teaserShowIndex(i) {
        teaserIndex = i;
        teaserClips.forEach(function (v, j) {
          if (j === i) {
            v.classList.remove('is-inactive');
          } else {
            v.classList.add('is-inactive');
            v.pause();
          }
        });
      }

      function teaserPlayFromStart(i) {
        var v = teaserClips[i];
        v.currentTime = 0;
        teaserShowIndex(i);
        var p = v.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {});
        }
      }

      teaserP1.addEventListener('ended', function () {
        teaserPlayFromStart(1);
      });
      teaserP2.addEventListener('ended', function () {
        teaserPlayFromStart(0);
      });

      if (teaserPrev) {
        teaserPrev.addEventListener('click', function () {
          teaserPlayFromStart((teaserIndex - 1 + 2) % 2);
        });
      }
      if (teaserNext) {
        teaserNext.addEventListener('click', function () {
          teaserPlayFromStart((teaserIndex + 1) % 2);
        });
      }
    }

})


