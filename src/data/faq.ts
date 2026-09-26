import { QUOTE_FLOOR } from './config';
import { fmt } from '../lib/format';

/* Preguntas frecuentes — misma fuente para la sección visible (FAQ.tsx) y el
   FAQPage de seo.ts, así no se desincronizan. Solo datos que ya están
   publicados en otras partes del sitio (plazos, pagos, garantía, pisos del
   cotizador): si cambia uno de esos, cambia acá también.
   Google ya no muestra FAQ como resultado enriquecido para comercios, pero
   el texto sí se indexa y lo leen los buscadores con IA. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: '¿Cuánto sale una pieza a medida?',
    a: `Depende del tamaño y del diseño. Como referencia, una pieza chica arranca en ${fmt(QUOTE_FLOOR.chico)}, una mediana en ${fmt(QUOTE_FLOOR.mediano)} y una grande en ${fmt(QUOTE_FLOOR.grande)}. El precio final te lo pasamos por WhatsApp con la foto, la idea o el archivo a la vista.`,
  },
  {
    q: '¿Necesito tener el archivo 3D?',
    a: 'No. Con una foto, un dibujo o las medidas alcanza; si hay que diseñarla, la diseñamos nosotros. Si ya tenés el archivo, mandalo y el precio sale exacto.',
  },
  {
    q: '¿Cuánto tarda?',
    a: 'Las piezas del catálogo marcadas "Listo" salen en el día; las "Bajo pedido", en 3 a 5 días. En una pieza a medida el plazo te lo confirmamos junto con el precio. El envío por correo tarda unos 7 días hábiles según destino.',
  },
  {
    q: '¿Hacen envíos?',
    a: 'Sí, a todo el país por correo con seguimiento. El costo depende del destino. En Bahía Blanca el retiro es sin cargo.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Con link de Mercado Pago, transferencia o efectivo al retirar.',
  },
  {
    q: '¿Hacen cantidades para empresas o eventos?',
    a: 'Sí: souvenirs, objetos con logo y series para eventos, con descuento por volumen. Contanos cuántas unidades necesitás y para cuándo.',
  },
  {
    q: '¿Hay un tamaño máximo?',
    a: 'No hay un límite fijo: las piezas grandes se imprimen en partes y se arman después. Lo evaluamos en cada caso.',
  },
  {
    q: '¿Y si llega dañada?',
    a: 'Mandanos una foto dentro de las 48 h de recibida y la rehacemos sin cargo. Las piezas del catálogo tienen además 10 días de arrepentimiento; las hechas según tus medidas o diseño, no.',
  },
];
