import { CONFIG } from '../data/config';

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

// Deep-link a un producto puntual — la SPA no tiene rutas por producto, así
// que el ?p=<id> en la URL es lo que le permite a alguien que recibe el link
// compartido caer directo en el modal del producto, no solo en la home.
export const productShareUrl = (id: string): string => `https://stickos3d.com.ar/?p=${id}`;

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
