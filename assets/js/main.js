'use strict';
document.addEventListener('DOMContentLoaded', function() {

  // --- NAV hamburger ---
  var ham = document.getElementById('hamburger');
  var nav = document.getElementById('navLinks');
  if (ham && nav) ham.addEventListener('click', function() { nav.classList.toggle('open'); });
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.addEventListener('click', function() { if (nav) nav.classList.remove('open'); });
  });

  // --- Scroll animations ---
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-anim]').forEach(function(el) { obs.observe(el); });

  // --- Form submit ---
  document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      if (btn) { btn.textContent = 'Sent!'; btn.disabled = true; }
      setTimeout(function() {
        if (btn) { btn.textContent = btn.dataset.label || 'Send'; btn.disabled = false; }
        form.reset();
      }, 3000);
    });
  });

  // --- Carousel ---
  var track   = document.getElementById('carouselTrack');
  var dotsEl  = document.getElementById('carouselDots');
  var btnPrev = document.getElementById('carouselPrev');
  var btnNext = document.getElementById('carouselNext');

  if (track && dotsEl && btnPrev && btnNext) {
    var slides  = track.querySelectorAll('.carousel-slide');
    var total   = slides.length;
    var current = 0;

    function perPage() { return window.innerWidth <= 768 ? 1 : 3; }
    function pages()   { return Math.ceil(total / perPage()); }

    function buildDots() {
      dotsEl.innerHTML = '';
      var p = pages();
      for (var i = 0; i < p; i++) {
        (function(idx) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Page ' + (idx + 1));
          dot.addEventListener('click', function() { goTo(idx); });
          dotsEl.appendChild(dot);
        })(i);
      }
    }

    function goTo(pageIdx) {
      current = ((pageIdx % pages()) + pages()) % pages();
      // First slide of this page
      var slideIdx  = current * perPage();
      // Each slide: width + 12px margin
      var slideEl   = slides[0];
      var slideW    = slideEl.offsetWidth + 12;
      track.style.transform = 'translateX(-' + (slideIdx * slideW) + 'px)';
      dotsEl.querySelectorAll('.carousel-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    buildDots();

    window.addEventListener('resize', function() { buildDots(); goTo(0); });

    btnPrev.addEventListener('click', function() { resetTimer(); goTo(current - 1); });
    btnNext.addEventListener('click', function() { resetTimer(); goTo(current + 1); });

    // Swipe
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { resetTimer(); goTo(diff > 0 ? current + 1 : current - 1); }
    });

    // Auto-advance, pause on hover
    var timer = setInterval(function() { goTo(current + 1); }, 5000);
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function() { goTo(current + 1); }, 5000);
    }
    var wrapper = track.closest('.carousel-wrapper');
    wrapper.addEventListener('mouseenter', function() { clearInterval(timer); });
    wrapper.addEventListener('mouseleave', function() { resetTimer(); });
  }

});

// --- Scroll animation styles injected ---
(function() {
  var s = document.createElement('style');
  s.textContent =
    '[data-anim]{opacity:0;transform:translateY(24px);transition:opacity .55s ease,transform .55s ease}' +
    '[data-anim].visible{opacity:1;transform:translateY(0)}' +
    '[data-anim-delay="1"]{transition-delay:.1s}' +
    '[data-anim-delay="2"]{transition-delay:.2s}' +
    '[data-anim-delay="3"]{transition-delay:.3s}';
  document.head.appendChild(s);
})();