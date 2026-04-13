'use strict';
document.addEventListener('DOMContentLoaded', function() {

  // NAV hamburger
  var ham = document.getElementById('hamburger');
  var nav = document.getElementById('navLinks');
  if (ham && nav) {
    ham.addEventListener('click', function() { nav.classList.toggle('open'); });
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      a.addEventListener('click', function() { nav.classList.remove('open'); });
    });
  }

  // Scroll reveal
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(function(el) { observer.observe(el); });

  // Photo strip drag-to-scroll
  document.querySelectorAll('.photo-strip').forEach(function(strip) {
    var isDown = false, startX, scrollLeft;
    strip.addEventListener('mousedown', function(e) { isDown = true; strip.classList.add('grabbing'); startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; });
    strip.addEventListener('mouseleave', function() { isDown = false; strip.classList.remove('grabbing'); });
    strip.addEventListener('mouseup', function() { isDown = false; strip.classList.remove('grabbing'); });
    strip.addEventListener('mousemove', function(e) { if (!isDown) return; e.preventDefault(); var x = e.pageX - strip.offsetLeft; strip.scrollLeft = scrollLeft - (x - startX); });
  });

});