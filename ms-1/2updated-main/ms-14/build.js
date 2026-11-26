const fs = require('fs');

// Order of sections on the page. Names must match the files in src/partials
const parts = [
  'modals', 'loader', 'nav', 'hero', 'register', 'marquee', 'sensei-tv-promo',
  'about', 'maya-sabha', 'vision', 'verticals', 'pipeline', 'events-section',
  'omniverse', 'mascots', 'team', 'japan', 'faq',
  'contact', 'footer', 'mascot-system'
];

const head = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>狂賢師 MAD SENSEI STUDIOS — 狂気の創造</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="icon" type="image/jpeg" href="images/logo.jpg">
</head>
<body>
`;

const tail = `
<script src="script.js"></script>
</body>
</html>`;

let body = '';
for (const name of parts) {
  const file = `src/partials/${name}.html`;
  if (!fs.existsSync(file)) {
    console.error(`Missing file: ${file}`);
    process.exit(1);
  }
  body += fs.readFileSync(file, 'utf8') + '\n';
}

fs.writeFileSync('index.html', head + body + tail);
console.log('index.html created!');