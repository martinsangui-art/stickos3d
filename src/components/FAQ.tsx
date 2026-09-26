import { FAQ as ITEMS } from '../data/faq';
import { useReveal } from '../hooks/useReveal';

/* <details> nativo: accesible por teclado, sin JS, y el texto queda en el
   DOM aunque esté cerrado (lo indexa Google). */
export function FAQ() {
  const headReveal = useReveal<HTMLDivElement>();
  const listReveal = useReveal<HTMLDivElement>();

  return (
    <section id="preguntas" className="faq">
      <div className="wrap faq-grid">
        <div className={`sec-head ${headReveal.className}`} ref={headReveal.ref}>
          <div>
            <div className="eyebrow">Capa 04 — Preguntas</div>
            <h2 className="sec-title">Lo que más nos preguntan</h2>
            <p>Si tu duda no está acá, el botón verde de WhatsApp está abajo a la derecha.</p>
          </div>
        </div>
        <div className={`faq-list ${listReveal.className}`} ref={listReveal.ref}>
          {ITEMS.map((it) => (
            <details key={it.q}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
