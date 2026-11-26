// Show only one "page" at a time, based on the # in the URL
(function () {
  var PAGES = {
    // Home
    hero:          ['#hero', '.marquee-strip', '#sensei-tv-promo'],

    // Menu groups
    studio:        ['#about', '#maya-sabha', '#vision'],
    work:          ['#verticals', '#pipeline', '#events'],
    universe:      ['#omniverse', '#mascots'],
    people:        ['#team', '#japan'],
    opportunities: ['#faq', '#register'],
    contact:       ['#contact'],

    // Old links still work (hero buttons, bookmarks)
    about:         ['#about'],
    'maya-sabha':  ['#maya-sabha'],
    verticals:     ['#verticals'],
    pipeline:      ['#pipeline'],
    events:        ['#events'],
    omniverse:     ['#omniverse', '#mascots'],
    team:          ['#team'],
    japan:         ['#japan'],
    faq:           ['#faq'],
    register:      ['#register']
  };

  var all = [];
  Object.keys(PAGES).forEach(function (k) {
    PAGES[k].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && all.indexOf(el) === -1) all.push(el);
    });
  });

  function showPage(name) {
    if (!PAGES[name]) name = 'hero';

    all.forEach(function (el) { el.style.display = 'none'; });
    PAGES[name].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = '';
    });

    var links = document.getElementById('nav-links');
    var burger = document.getElementById('nav-burger');
    if (links) links.classList.remove('open');
    if (burger) burger.classList.remove('open');

    window.scrollTo(0, 0);
  }

  function route() {
    showPage(location.hash.replace('#', ''));
  }

  window.addEventListener('hashchange', route);
  route();
})();