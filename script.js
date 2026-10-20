(function () {
  'use strict';
  var progress = document.getElementById('progress-bar');
  var nav = document.getElementById('main-nav');
  var toggle = document.getElementById('menu-toggle');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  var sections = navLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
  var glow = document.querySelector('.cursor-glow');
  var ticking = false;

  function updateScrollState() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = Math.min(100, percent) + '%';
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 150) current = section;
    });
    navLinks.forEach(function (link) {
      var active = current && link.getAttribute('href') === '#' + current.id;
      link.classList.toggle('active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(updateScrollState); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open', !expanded);
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  var revealItems = document.querySelectorAll('.reveal, .stat-card, .stack-row');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach(function (item) { item.classList.add('reveal'); observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  }

  if (glow && window.matchMedia && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('pointermove', function (event) {
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    }, { passive: true });
  }
})();
