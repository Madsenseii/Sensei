// // Show only one "page" at a time, based on the # in the URL
// (function () {
//   var PAGES = {
//     hero:         ['#hero', '.marquee-strip'],   // Home
//     register:     ['#register'],
//     about:        ['#about'],                    // Studio
//     'maya-sabha': ['#maya-sabha'],               // Legacy
//     events:       ['#events'],
//     verticals:    ['#verticals'],
//     omniverse:    ['#omniverse', '#mascots'],    // Universe
//     team:         ['#team', '#vision'],
//     japan:        ['#japan'],
//     pipeline:     ['#pipeline'],
//     faq:          ['#faq'],                      // Invest
//     contact:      ['#contact']
//   };

//   // every section that belongs to some page
//   var all = [];
//   Object.keys(PAGES).forEach(function (k) {
//     PAGES[k].forEach(function (sel) {
//       var el = document.querySelector(sel);
//       if (el) all.push(el);
//     });
//   });

//   function showPage(name) {
//     if (!PAGES[name]) name = 'hero';          // unknown link -> Home

//     all.forEach(function (el) { el.style.display = 'none'; });
//     PAGES[name].forEach(function (sel) {
//       var el = document.querySelector(sel);
//       if (el) el.style.display = '';
//     });

//     // close the mobile menu
//     var links = document.getElementById('nav-links');
//     var burger = document.getElementById('nav-burger');
//     if (links) links.classList.remove('open');
//     if (burger) burger.classList.remove('open');

//     window.scrollTo(0, 0);
//   }

//   function route() {
//     showPage(location.hash.replace('#', ''));
//   }

//   window.addEventListener('hashchange', route);
//   route();   // first load: shows Home only
// })();