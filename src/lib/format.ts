import { CONFIG } from '../data/config';
import { hasConfirmedPrice } from '../data/products';
import type { Product } from '../data/types';

export const fmt = (n: number): string => '$ ' + Math.round(n).toLocaleString('es-AR');

export const wa = (msg: string): string =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* wa.me resuelve bien en celular pero en escritorio suele rebotar contra la
   app instalada; web.whatsapp.com es la salida para el que está en la compu. */
export const waWeb = (msg: string): string =>
  `https://web.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(msg)}`;

/* Compartir un producto — a diferencia de wa()/waWeb() (que arman un mensaje
   PARA el negocio), esto abre WhatsApp sin número de destino: el que
   comparte elige a quién mandárselo. Es el mecanismo real por el que ya
   circulan productos de STICKOS 3D — un botón de compartir con el link y el
   precio precargados es gratis y capitaliza ese boca en boca existente. */
export const shareWa = (msg: string): string => `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

// Link para compartir un producto puntual. Con foto confirmada, apunta a la
// página estática que genera scripts/generate-share-pages.mjs en el build
// (dist/p/<id>.html) — WhatsApp/Facebook/Instagram leen el HTML crudo sin
// ejecutar JS, así que la SPA sola nunca puede mostrar una foto de preview
// distinta por producto: siempre se vería la og:image genérica del home. Esa
// página estática tiene el og:image real del producto y manda a un humano
// que la abre directo a /?p=<id> (la app de verdad, con el modal abierto).
// Sin foto confirmada no hay nada que previsualizar — ahí se comparte el
// deep-link ?p=<id> de siempre, sin pasar por la página estática (no existe).
export const productShareUrl = (p: Product): string =>
  hasConfirmedPrice(p) ? `https://stickos3d.com.ar/p/${p.id}.html` : `https://stickos3d.com.ar/?p=${p.id}`;

export const mailBody = [
  'Hola STICKOS 3D:',
  '',
  'Quería consultar por…',
  '',
  '(Contame qué necesitás: tipo de pieza, medidas aproximadas y cantidad.)',
  '',
  'Nombre:',
  'Teléfono:',
].join('\n');
