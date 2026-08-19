import { useReveal } from '../hooks/useReveal';

function RevealDiv({ className, style, children }: { className: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const r = useReveal<HTMLDivElement>();
  return (
    <div className={`${className} ${r.className}`} style={style} ref={r.ref}>
      {children}
    </div>
  );
}

export function HowToBuy() {
  const headReveal = useReveal<HTMLDivElement>();

  return (
    <section id="comprar">
      <div className="wrap">
        <div className={`sec-head ${headReveal.className}`} ref={headReveal.ref}>
          <div>
            <div className="eyebrow">Capa 03 — Cómo comprar</div>
            <h2 className="sec-title">Simple, como tiene que ser</h2>
          </div>
        </div>
        <div className="steps">
          <RevealDiv className="step">
            <div className="step-n">PASO 01</div>
            <h3>Armá tu pedido</h3>
            <p>Sumá productos al carrito con el color elegido, o cotizá tu pieza a medida. Sin registrarte ni crear cuentas.</p>
          </RevealDiv>
          <RevealDiv className="step">
            <div className="step-n">PASO 02</div>
            <h3>Confirmamos por WhatsApp</h3>
            <p>Te llega el detalle completo, confirmamos plazo de impresión y te pasamos el link de pago o datos de transferencia.</p>
          </RevealDiv>
          <RevealDiv className="step">
            <div className="step-n">PASO 03</div>
            <h3>Retirás o te lo enviamos</h3>
            <p>Retiro sin cargo en Bahía Blanca, o envío a todo el país por correo con seguimiento.</p>
          </RevealDiv>
        </div>
        <div className="pay-row">
          <span className="pay-tag"><b>Mercado Pago</b> · link de pago</span>
          <span className="pay-tag"><b>Transferencia</b> · CBU/alias</span>
          <span className="pay-tag"><b>Efectivo</b> · al retirar</span>
          <span className="pay-tag"><b>Envíos</b> · Correo Argentino / a convenir</span>
        </div>

        <div className="trust">
          <RevealDiv className="trust-card">
            <span className="trust-mark">Diseño propio</span>
            <h3>¿No existe? Lo diseñamos</h3>
            <p>Traés la idea, no hace falta archivo ni planos. Lo dibujamos nosotros y recién ahí se imprime.</p>
          </RevealDiv>
          <RevealDiv className="trust-card">
            <span className="trust-mark">Garantía STICKOS</span>
            <h3>Si llega dañada, la rehacemos</h3>
            <p>Mandanos una foto dentro de las 48hs de recibido el paquete y la reimprimimos sin cargo.</p>
          </RevealDiv>
          <RevealDiv className="trust-card">
            <span className="trust-mark">Sin vueltas</span>
            <h3>Todo por WhatsApp</h3>
            <p>Cotizás, confirmás y seguís tu pedido por WhatsApp. Entrega en 48 a 72hs.</p>
          </RevealDiv>
        </div>
      </div>
    </section>
  );
}
