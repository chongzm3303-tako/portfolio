(function () {
  if (!('IntersectionObserver' in window)) return;

  var links = document.querySelectorAll('.site-nav a[href^="#"]');
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  // Mark the nav link for the section in the middle of the screen.
  function setCurrent(id) {
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (byId[id]) byId[id].setAttribute('aria-current', 'location');
  }

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setCurrent(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  ['top'].concat(Object.keys(byId)).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) spy.observe(section);
  });

  // Near the bottom of the page the Contact section may never reach the middle, so use the footer.
  var footer = document.querySelector('.site-footer');
  if (footer) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) setCurrent('contact');
    }).observe(footer);
  }

  // Show the back-to-top button once the hero has scrolled out of view.
  var toTop = document.querySelector('.to-top');
  var hero = document.getElementById('top');
  if (toTop && hero) {
    new IntersectionObserver(function (entries) {
      toTop.classList.toggle('is-visible', !entries[0].isIntersecting);
    }).observe(hero);
  }
})();
