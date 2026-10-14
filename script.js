/* ===== Terry.Dev — lively animations ===== */
(function () {
  // Respect users who prefer no motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ---- 1. Scroll reveal: fade + slide elements in as they enter ---- */
  var revealItems = document.querySelectorAll(
    'main section h1, main section h2, main section > p, ' +
    '#services article, #work article, #about img, #about ul, ' +
    '#contact ul, #contact form, footer p'
  );
  revealItems.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = ((i % 4) * 80) + 'ms';
  });

  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) {
      revealer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- 2. Animated hero stat counters (20+, 100%, 5 star) ---- */
  var stats = document.querySelectorAll('main section:first-of-type ul li strong');
  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    stats.forEach(function (el) {
      var text = el.textContent;
      var num = parseInt(text, 10);
      if (isNaN(num)) return;
      var suffix = text.slice(String(num).length); // "+", "%", " star"
      var start = null;
      var duration = 1200;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(num * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window && stats.length) {
    var statWatcher = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        runCounters();
        statWatcher.disconnect();
      }
    });
    statWatcher.observe(stats[0].parentElement);
  } else {
    runCounters();
  }

  /* ---- 3. Gentle parallax on the picture-mosaic background ---- */
  var collage = document.querySelector('.bg-collage');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!collage || ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      collage.style.translate = '0 ' + (window.scrollY * 0.08) + 'px';
      ticking = false;
    });
  }, { passive: true });

  /* ---- 4. Highlight the nav link for the section on screen ---- */
  var navLinks = document.querySelectorAll('nav a[href^="#"]');
  var sections = ['work', 'services', 'about', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var navWatcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navWatcher.observe(s); });
  }

  /* ---- 5. Playful press bounce on buttons ---- */
  document.querySelectorAll('section a, button, header > a:last-child').forEach(function (el) {
    el.addEventListener('mousedown', function () {
      el.style.transform = 'scale(0.95)';
    });
    ['mouseup', 'mouseleave'].forEach(function (ev) {
      el.addEventListener(ev, function () {
        el.style.transform = '';
      });
    });
  });

  /* ---- 6. Subtle 3D tilt on the featured project box ---- */
  var featured = document.querySelector('#work article.featured');
  if (featured && window.matchMedia('(hover: hover)').matches) {
    featured.addEventListener('mousemove', function (e) {
      var r = featured.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      featured.style.transform =
        'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
    });
    featured.addEventListener('mouseleave', function () {
      featured.style.transform = '';
    });
  }
})();
