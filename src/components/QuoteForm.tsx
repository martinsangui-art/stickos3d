import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import {
  buildQuoteMessage, quoteFloor,
  DELIVERY_OPTIONS, FILE_OPTIONS, FINISH_OPTIONS, SIZE_OPTIONS, WHEN_OPTIONS,
  type QuoteDelivery, type QuoteFile, type QuoteFinish, type QuoteSize, type QuoteWhen,
} from '../lib/quote';
import { fmt, openWhatsApp, wa } from '../lib/format';
import { trackPixel } from '../lib/pixel';

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

  const [size, setSize] = useState<QuoteSize | ''>('');
  const [finish, setFinish] = useState<QuoteFinish>('indistinto');
  const [qty, setQty] = useState(1);
  const [delivery, setDelivery] = useState<QuoteDelivery | ''>('');
  const [place, setPlace] = useState('');
  const [when, setWhen] = useState<QuoteWhen | ''>('');
  const [date, setDate] = useState('');
  const [hasFile, setHasFile] = useState<QuoteFile | ''>('');
  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');

  const floor = size ? quoteFloor(size) : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!size || !delivery || !when || !hasFile) return;
    const msg = buildQuoteMessage({ name, desc, size, finish, qty, delivery, place, when, date, file: hasFile });
    trackPixel('Lead', { content_category: 'cotizador', ...(floor ? { value: floor, currency: 'ARS' } : {}) });
    openWhatsApp(wa(msg));
  }

  return (
    <section className="custom" id="pedido">
      <div className="wrap custom-grid">
        <div className={copyReveal.className} ref={copyReveal.ref}>
          <div className="eyebrow">Capa 02 — Pieza a medida</div>
          <h2 className="sec-title">¿No está en el catálogo?<br />Cotizalo ahora, acá.</h2>
          <ul>
            <li><span className="li-mark">YA</span><span><b>Precio de referencia al instante.</b> Elegí el tamaño y ves desde cuánto arranca, sin esperar que nadie te responda.</span></li>
            <li><span className="li-mark">ARCHIVO</span><span><b>¿Ya tenés el archivo?</b> Mandanos el archivo por WhatsApp y afinamos el precio exacto.</span></li>
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
          <fieldset className="choice-group">
            <legend>Tamaño aproximado</legend>
            <Choice name="cfSize" options={SIZE_OPTIONS} value={size} onChange={setSize} />
          </fieldset>
          <p className="form-note">¿No sabés si el tamaño que tenés en mente se puede? Contanos las medidas igual — muchas piezas grandes se imprimen en partes y se arman después. Lo evaluamos caso por caso, sin límite fijo.</p>
          <fieldset className="choice-group">
            <legend>Acabado</legend>
            <Choice name="cfFinish" options={FINISH_OPTIONS} value={finish} onChange={setFinish} />
          </fieldset>
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
          {size && (
            <div className="quote-box">
              <p className="quote-floor" id="quoteValue">
                {floor
                  ? <>Este tipo de pieza arranca en <b>{fmt(floor)}</b>. El precio final te lo confirmo por WhatsApp una vez que vea el modelo.</>
                  : 'Te paso el precio por WhatsApp'}
              </p>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Pedir cotización por WhatsApp</button>
          <p className="form-note">Se abre WhatsApp con tu pedido ya redactado. Si tenés archivo o fotos, los adjuntás ahí.</p>
        </form>
      </div>
    </section>
  );
}
