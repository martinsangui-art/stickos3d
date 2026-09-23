import { useMemo, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { computeQuote } from '../lib/quote';
import { fmt, wa } from '../lib/format';
import { trackPixel } from '../lib/pixel';

type SizeKey = 'chico' | 'mediano' | 'grande' | 'no_se';
type FinishKey = 'mate' | 'brillante' | 'seda' | 'indistinto';
type DeliveryKey = 'retiro' | 'envio';
type WhenKey = 'sin_apuro' | 'dos_semanas' | 'fecha';
type FileKey = 'si' | 'no';

// Referencias de objetos cotidianos en vez de centímetros: el cliente no
// sabe medir lo que imagina, y elegir "5–12 cm" terminaba en piezas de 15.
const SIZE_OPTIONS: [SizeKey, string][] = [
  ['chico', 'Chico — como una taza'],
  ['mediano', 'Mediano — como una pelota de handball'],
  ['grande', 'Grande — como un balde'],
  ['no_se', 'No estoy seguro, ayudame vos'],
];
const FINISH_OPTIONS: [FinishKey, string][] = [
  ['mate', 'Mate, sin brillo'],
  ['brillante', 'Brillante'],
  ['seda', 'Con brillo símil seda'],
  ['indistinto', 'Me da igual / recomendame'],
];
const DELIVERY_OPTIONS: [DeliveryKey, string][] = [
  ['retiro', 'Retiro en Bahía Blanca'],
  ['envio', 'Envío a domicilio'],
];
const WHEN_OPTIONS: [WhenKey, string][] = [
  ['sin_apuro', 'Sin apuro'],
  ['dos_semanas', 'Dentro de dos semanas'],
  ['fecha', 'Tengo fecha'],
];
const FILE_OPTIONS: [FileKey, string][] = [
  ['si', 'Sí, lo tengo'],
  ['no', 'No, lo busco con ustedes'],
];

// Transitorio hasta el piso de precio por tamaño: el rango viejo solo
// entiende S/M/L/XL.
const LEGACY_SIZE = { chico: 'S', mediano: 'M', grande: 'L', no_se: 'XL' } as const;

function Choice<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: [T, string][];
  value: T | '';
  onChange: (v: T) => void;
}) {
  return (
    <div className="choice-row">
      {options.map(([v, label], i) => (
        <label key={v} className={`choice${value === v ? ' on' : ''}`}>
          <input
            type="radio"
            name={name}
            value={v}
            checked={value === v}
            required={i === 0}
            onChange={() => onChange(v)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

export function QuoteForm() {
  const copyReveal = useReveal<HTMLDivElement>();
  const formReveal = useReveal<HTMLFormElement>();

  const [size, setSize] = useState<SizeKey | ''>('');
  const [finish, setFinish] = useState<FinishKey>('indistinto');
  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryKey | ''>('');
  const [place, setPlace] = useState('');
  const [when, setWhen] = useState<WhenKey | ''>('');
  const [date, setDate] = useState('');
  const [hasFile, setHasFile] = useState<FileKey | ''>('');
  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');

  const quote = useMemo(
    () => (size ? computeQuote({ size: LEGACY_SIZE[size], mat: 'PLA', cx: 1, qty }) : null),
    [size, qty],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!size || !delivery || !when || !hasFile) return;
    const label = <T extends string>(opts: [T, string][], v: T) => opts.find(([k]) => k === v)![1];
    const deliveryText = delivery === 'retiro'
      ? 'retiro en Bahía Blanca'
      : place.trim() ? `envío a ${place.trim()}` : 'envío a domicilio';
    const whenText = when === 'fecha' ? date.trim() : label(WHEN_OPTIONS, when).toLowerCase();
    const msg =
      `¡Hola STICKOS 3D! Soy ${name} y usé el cotizador de la web:\n\n` +
      `📦 Pieza: ${desc}\n📐 Tamaño: ${label(SIZE_OPTIONS, size)}\n🧵 Acabado: ${label(FINISH_OPTIONS, finish)}\n` +
      `🔢 Cantidad: ${qty}\n🚚 Entrega: ${deliveryText}\n📅 Lo necesito: ${whenText}\n` +
      `📁 Archivo: ${hasFile === 'si' ? 'lo tengo' : 'lo busco con ustedes'}\n\n` +
      (quote && !quote.needsContact ? `💰 Estimado web: ${fmt(quote.low!)} – ${fmt(quote.high!)}\n\n` : '') +
      `¿Me confirman el precio final? Si necesitan fotos o el archivo, los mando por acá.`;
    trackPixel('Lead', { content_category: 'cotizador', value: quote?.low ?? undefined, currency: 'ARS' });
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
          <div className="form-row">
            <label>
              Tamaño aproximado
              <select id="cfSize" required value={size} onChange={(e) => setSize(e.target.value as SizeKey)}>
                <option value="" disabled>Elegí una referencia</option>
                {SIZE_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </label>
            <label>
              Acabado
              <select id="cfFinish" value={finish} onChange={(e) => setFinish(e.target.value as FinishKey)}>
                {FINISH_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </label>
          </div>
          <p className="form-note">¿No sabés si el tamaño que tenés en mente se puede? Contanos las medidas igual — muchas piezas grandes se imprimen en partes y se arman después. Lo evaluamos caso por caso, sin límite fijo.</p>
          <fieldset className="choice-group">
            <legend>Entrega</legend>
            <Choice name="cfDelivery" options={DELIVERY_OPTIONS} value={delivery} onChange={setDelivery} />
            {delivery === 'envio' && (
              <input
                type="text"
                id="cfPlace"
                placeholder="Localidad y código postal"
                aria-label="Localidad y código postal"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            )}
          </fieldset>
          <fieldset className="choice-group">
            <legend>¿Para cuándo lo necesitás?</legend>
            <Choice name="cfWhen" options={WHEN_OPTIONS} value={when} onChange={setWhen} />
            {when === 'fecha' && (
              <input
                type="text"
                id="cfDate"
                placeholder="¿Para cuándo?"
                aria-label="Fecha"
                maxLength={60}
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            )}
          </fieldset>
          <fieldset className="choice-group">
            <legend>¿Tenés el archivo del modelo?</legend>
            <Choice name="cfFile" options={FILE_OPTIONS} value={hasFile} onChange={setHasFile} />
          </fieldset>
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
          {quote && (
            <div className="quote-box">
              <div>
                <div className="q-label">Estimado en el acto</div>
                <div className="quote-value" id="quoteValue">
                  {quote.needsContact ? 'Te cotizamos por WhatsApp' : `${fmt(quote.low!)} – ${fmt(quote.high!)}`}
                </div>
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Confirmar cotización por WhatsApp</button>
          <p className="form-note">Se abre WhatsApp con tu pedido y el estimado ya redactados. Si tenés archivo o fotos, los adjuntás ahí.</p>
        </form>
      </div>
    </section>
  );
}
