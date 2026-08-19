import { useMemo, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { computeQuote, type QuoteMaterial, type QuoteSize } from '../lib/quote';
import { fmt, wa } from '../lib/format';

const SIZE_OPTIONS: [QuoteSize, string][] = [
  ['S', 'Chico (hasta 5 cm)'],
  ['M', 'Mediano (5–12 cm)'],
  ['L', 'Grande (12–20 cm)'],
  ['XL', 'Muy grande (+20 cm)'],
];
const MAT_OPTIONS: [QuoteMaterial, string][] = [
  ['PLA', 'PLA común (uso general)'],
  ['PLA_MATE', 'PLA Mate (acabado sin brillo)'],
  ['PLA_SILK', 'PLA Silk (brillo satinado)'],
  ['PETG', 'PETG (más resistente)'],
  ['TPU', 'TPU (flexible)'],
];
const CX_OPTIONS: [number, string][] = [
  [1, 'Simple'],
  [1.3, 'Media / no sé'],
  [1.7, 'Alta (mucho detalle)'],
];

export function QuoteForm() {
  const copyReveal = useReveal<HTMLDivElement>();
  const formReveal = useReveal<HTMLFormElement>();

  const [size, setSize] = useState<QuoteSize>('M');
  const [mat, setMat] = useState<QuoteMaterial>('PLA');
  const [cx, setCx] = useState(1.3);
  const [qty, setQty] = useState(1);
  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');

  const quote = useMemo(() => computeQuote({ size, mat, cx, qty }), [size, mat, cx, qty]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (quote.needsContact) {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const sizeLabel = SIZE_OPTIONS.find(([v]) => v === size)![1];
    // La etiqueta, no el value: los materiales nuevos tienen guion bajo
    // (PLA_SILK) y quedaría feo en el mensaje de WhatsApp.
    const matLabel = MAT_OPTIONS.find(([v]) => v === mat)![1];
    const cxLabel = CX_OPTIONS.find(([v]) => v === cx)![1];
    const msg =
      `¡Hola STICKOS 3D! Soy ${name} y usé el cotizador de la web:\n\n` +
      `📦 Pieza: ${desc}\n📐 Tamaño: ${sizeLabel}\n🧵 Material: ${matLabel}\n` +
      `⚙️ Complejidad: ${cxLabel}\n🔢 Cantidad: ${qty}\n\n` +
      `💰 Estimado web: ${fmt(quote.low!)} – ${fmt(quote.high!)}\n\n` +
      `¿Me confirman el precio final? Si necesitan fotos o el archivo, los mando por acá.`;
    window.open(wa(msg), '_blank');
  }

  return (
    <section className="custom" id="pedido">
      <div className="wrap custom-grid">
        <div className={copyReveal.className} ref={copyReveal.ref}>
          <div className="eyebrow">Capa 02 — Cotizador instantáneo</div>
          <h2 className="sec-title">¿No está en el catálogo?<br />Cotizalo ahora, acá.</h2>
          <ul>
            <li><span className="li-mark">YA</span><span><b>Precio estimado al instante.</b> Elegí tamaño, material y complejidad: el número aparece solo, sin esperar que nadie te responda.</span></li>
            <li><span className="li-mark">STL</span><span><b>¿Ya tenés el archivo?</b> Mandanos el STL/3MF por WhatsApp y afinamos el precio exacto.</span></li>
            <li><span className="li-mark">IDEA</span><span><b>¿Tenés una idea, no un archivo?</b> Contanos qué necesitás y te ayudamos a diseñarlo desde cero, a medida.</span></li>
            <li><span className="li-mark">LOTE</span><span><b>Cantidad.</b> Souvenirs, merchandising y series para eventos o negocios, con descuento por volumen.</span></li>
          </ul>
        </div>
        <form id="customForm" className={formReveal.className} ref={formReveal.ref} onSubmit={handleSubmit}>
          <span className="form-title">// Estimador de precio</span>
          <label>
            ¿Qué necesitás?
            <textarea
              id="cfDesc"
              placeholder='Ej: "Quiero un portalápices tipo pulpo, unos 15cm de alto" (cualquier tamaño, lo cotizamos según el caso)'
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>
          <div className="form-row-3">
            <label>
              Tamaño aproximado
              <select id="cfSize" value={size} onChange={(e) => setSize(e.target.value as QuoteSize)}>
                {SIZE_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </label>
            <label>
              Material
              <select id="cfMat" value={mat} onChange={(e) => setMat(e.target.value as QuoteMaterial)}>
                {MAT_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </label>
            <label>
              Complejidad
              <select id="cfCx" value={cx} onChange={(e) => setCx(parseFloat(e.target.value))}>
                {CX_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </label>
          </div>
          <p className="form-note">¿No sabés si el tamaño que tenés en mente se puede? Contanos las medidas igual — muchas piezas grandes se imprimen en partes y se arman después. Lo evaluamos caso por caso, sin límite fijo.</p>
          <div className="form-row">
            <label>
              Cantidad
              <input type="number" id="cfQty" min={1} value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} />
            </label>
            <label>
              Tu nombre
              <input type="text" id="cfName" placeholder="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          <div className="quote-box">
            <div>
              <div className="q-label">Estimado en el acto</div>
              <div className="quote-value" id="quoteValue">
                {quote.needsContact ? 'Te cotizamos por mail' : `${fmt(quote.low!)} – ${fmt(quote.high!)}`}
              </div>
              <p className="form-note" id="quoteNote" style={{ marginTop: '6px' }}>
                {quote.needsContact
                  ? 'Piezas grandes: preferimos ajustar el precio a mano para darte el mejor número. Escribinos desde el formulario de abajo.'
                  : 'Precio de referencia, sujeto a modificación sin previo aviso.'}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Confirmar cotización por WhatsApp</button>
          <p className="form-note">Se abre WhatsApp con tu pedido y el estimado ya redactados. Si tenés archivo o fotos, los adjuntás ahí.</p>
        </form>
      </div>
    </section>
  );
}
