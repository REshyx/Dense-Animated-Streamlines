window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function () {

    var DEFAULT_DELAY = 3000;

    // ── Shared manual carousel initialiser ──
    document.querySelectorAll('.manual-carousel').forEach(function (root) {
        var track    = root.querySelector('.mc-track');
        var slides   = root.querySelectorAll('.mc-slide');
        var prevBtn  = root.querySelector('.mc-prev');
        var nextBtn  = root.querySelector('.mc-next');
        var dotsBox  = root.querySelector('.mc-dots');
        var total    = slides.length;
        if (!track || total === 0) return;

        var current = 0;
        var timer   = null;
        var videoEl  = null;
        var videoHandler = null;

        function detachVideo() {
            if (videoEl && videoHandler) {
                videoEl.removeEventListener('ended', videoHandler);
            }
            videoEl = null;
            videoHandler = null;
        }

        for (var i = 0; i < total; i++) {
            var dot = document.createElement('span');
            dot.className = 'mc-dot';
            dot.dataset.idx = i;
            dotsBox.appendChild(dot);
        }
        var dots = dotsBox.querySelectorAll('.mc-dot');

        function goTo(idx) {
            current = ((idx % total) + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function (d, j) {
                d.classList.toggle('is-active', j === current);
            });
            schedule();
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function schedule() {
            clearTimeout(timer);
            timer = null;
            detachVideo();

            var video = slides[current].querySelector('video');
            if (video) {
                videoEl = video;
                videoHandler = function () { detachVideo(); next(); };
                video.addEventListener('ended', videoHandler);
                video.currentTime = 0;
                var p = video.play();
                if (p && typeof p.catch === 'function') p.catch(function () {});
            } else {
                timer = setTimeout(next, DEFAULT_DELAY);
            }
        }

        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);
        dotsBox.addEventListener('click', function (e) {
            var d = e.target.closest('.mc-dot');
            if (d) goTo(parseInt(d.dataset.idx, 10));
        });

        goTo(0);
    });

    // ── Teaser video chain ──
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
            if (p && typeof p.catch === 'function') p.catch(function () {});
        }

        teaserP1.addEventListener('ended', function () { teaserPlayFromStart(1); });
        teaserP2.addEventListener('ended', function () { teaserPlayFromStart(0); });

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

});
