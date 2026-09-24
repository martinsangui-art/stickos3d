#!/usr/bin/env node
/* Escribe dist/sitemap.xml con la fecha del build como lastmod. Antes era
   un archivo fijo en public/ y el lastmod quedaba congelado en la fecha en
   que alguien se acordaba de tocarlo a mano.

   Solo la home: los productos se abren como /?p=<id> dentro de la misma
   página, y las dist/p/<id>.html son noindex (solo para previews). */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lastmod = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stickos3d.com.ar/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync(path.join(ROOT, 'dist', 'sitemap.xml'), xml, 'utf8');
console.log(`✓ sitemap.xml generado (lastmod ${lastmod})`);
