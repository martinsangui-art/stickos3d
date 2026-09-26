import { trackPixel } from '../lib/pixel';

/* Respiro Paper entre el strip y el catálogo — desde el 26/09/2026 muestra
   QUÉ se hace a medida, porque es por donde entraron todas las ventas.
   Cada tile precarga el cotizador (evento `stk:quote-prefill`, lo escucha
   QuoteForm) y baja hasta él: el cliente llega con la descripción empezada
   en vez de enfrentarse a un textarea vacío. */

export const QUOTE_PREFILL_EVENT = 'stk:quote-prefill';

const USES: { key: string; title: string; text: string; prefill: string }[] = [
  {
    key: 'regalo',
    title: 'Un regalo con nombre',
    text: 'Llaveros, carteles, portarretratos o una figura con el nombre, la fecha o el logo que quieras.',
    prefill: 'Quiero un regalo personalizado: ',
  },
  {
    key: 'lote',
    title: 'Tu marca, en cantidad',
    text: 'Souvenirs para eventos y objetos con el logo de tu negocio. Precio por volumen.',
    prefill: 'Necesito una cantidad para mi negocio / evento: ',
  },
  {
    key: 'lampara',
    title: 'Una lámpara a tu medida',
    text: 'Alto, color y forma según el lugar donde va. Te pasamos el precio con el kit eléctrico incluido.',
    prefill: 'Quiero una lámpara a medida: ',
  },
  {
    key: 'pieza',
    title: 'La pieza que no se consigue',
    text: 'Un soporte, una perilla, un organizador justo para ese hueco. Mandanos foto y medidas.',
    prefill: 'Necesito una pieza que no consigo: ',
  },
];

function prefill(key: string, text: string) {
  window.dispatchEvent(new CustomEvent(QUOTE_PREFILL_EVENT, { detail: { desc: text } }));
  trackPixel('ViewContent', { content_category: 'a-medida', content_name: key });
  document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Breather() {
  return (
    <div className="breather" id="a-medida">
      <span className="tick tl"></span>
      <span className="tick tr"></span>
      <div className="wrap">
        <div className="breather-eyebrow">// A medida</div>
        <h3>
          ¿No está en el catálogo? <span className="accent">Lo hacemos.</span>
        </h3>
        <p>Nos contás la idea con una foto, un dibujo o las medidas. No hace falta tener el archivo.</p>
        <div className="uses">
          {USES.map((u, i) => (
            <button key={u.key} type="button" className="use" onClick={() => prefill(u.key, u.prefill)}>
              <span className="use-n">0{i + 1}</span>
              <span className="use-t">{u.title}</span>
              <span className="use-d">{u.text}</span>
              <span className="use-cta">Cotizar →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
