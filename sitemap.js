import fs from 'fs';

const units = JSON.parse(fs.readFileSync('./data/units.json', 'utf8'));

const urls = units.map(u =>
  `<url><loc>https://example.com/convert/${u.from}-${u.to}</loc></url>`
).join('');

const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', xml);
