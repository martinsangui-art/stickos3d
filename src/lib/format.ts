import { CONFIG } from '../data/config';

export const fmt = (n: number): string => '$ ' + Math.round(n).toLocaleString('es-AR');

export const wa = (msg: string): string =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* wa.me resuelve bien en celular pero en escritorio suele rebotar contra la
   app instalada; web.whatsapp.com es la salida para el que está en la compu. */
export const waWeb = (msg: string): string =>
  `https://web.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(msg)}`;

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
