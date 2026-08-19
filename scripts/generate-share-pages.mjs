#!/usr/bin/env node
/* Genera una página HTML estática por producto con foto confirmada
   (dist/p/<id>.html), con og:title / og:description / og:image PROPIOS de
   ESE producto — necesario porque WhatsApp/Facebook/Instagram leen el HTML
   crudo sin ejecutar JS. El sitio real es una SPA con un solo index.html:
   sin esto, compartir CUALQUIER producto mostraba siempre la misma
   og:image genérica del home (la del <head> de index.html), nunca la foto
   real del producto compartido.

   Un humano que abre el link cae acá un instante y se lo manda enseguida a
   /?p=<id> (la app de verdad, con el modal del producto ya abierto) — el
   <meta http-equiv="refresh"> cubre el caso sin JS, el <script> cubre el
   caso normal (más rápido, sin el parpadeo del refresh). Los bots de
   preview no ejecutan JS: solo leen los meta tags de este HTML y ya está.

   Se corre después de "vite build" (ver npm run build) — necesita dist/
   ya generado para escribir ahí adentro. */
import { execSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://stickos3d.com.ar';

// products.ts es TypeScript pero no tiene dependencias en tiempo de
// ejecución (el único import es "type Product", que se borra solo) — lo
// bundleamos rápido con esbuild (ya vive en node_modules vía Vite) a un
// .mjs temporal en vez de sumar una dependencia nueva (tsx/ts-node) solo
// para este script.
const tmpDir = mkdtempSync(path.join(tmpdir(), 'stickos-share-'));
const bundlePath = path.join(tmpDir, 'products.mjs');
try {
  execSync(
    `npx esbuild src/data/products.ts --bundle --platform=node --format=esm --outfile="${bundlePath}"`,
    { cwd: ROOT, stdio: 'inherit' },
  );

  const { PRODUCTS, hasConfirmedPrice } = await import(bundlePath);

  const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const priced = PRODUCTS.filter(hasConfirmedPrice);
  const outDir = path.join(DIST, 'p');
  mkdirSync(outDir, { recursive: true });

  for (const p of priced) {
    const imageUrl = `${SITE_URL}${p.imgs[0]}`; // imgs ya viene con "/" inicial
    const title = `${p.name} — STICKOS 3D`;
    const price = `$ ${p.price.toLocaleString('es-AR')}`;
    const description = `${price} · ${p.cat}. ${p.desc || ''}`.slice(0, 200);
    const pageUrl = `${SITE_URL}/p/${p.id}.html`;
    const redirectPath = `/?p=${p.id}`;

    const html = `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<!-- noindex: esta página es solo para bots de preview de redes sociales
     (no ejecutan JS, no leen robots.txt para decidir si las mandan a
     alguien — solo las usan para armar la tarjeta de share). La versión
     indexable de verdad para Google ya existe vía /?p=<id> + los datos
     estructurados de src/lib/seo.ts; sin este noindex, Google podría
     indexar esta página finita de redirect como contenido duplicado. -->
<meta name="robots" content="noindex">
<link rel="canonical" href="${pageUrl}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(imageUrl)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:type" content="product">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${redirectPath}">
<script>location.replace(${JSON.stringify(redirectPath)});</script>
</head>
<body>
<p><a href="${redirectPath}">Ver ${esc(p.name)} en STICKOS 3D</a></p>
</body>
</html>
`;
    writeFileSync(path.join(outDir, `${p.id}.html`), html, 'utf8');
  }

  console.log(`✓ ${priced.length} páginas de preview generadas en dist/p/`);
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
