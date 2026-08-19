import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { sendAutoReply } from '../lib/email';
import { trackPixel } from '../lib/pixel';
import { useSoundContext } from '../context/SoundContext';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'err'; text: string };

const IDLE_TEXT = 'No compartimos tu mail con nadie. Solo lo usamos para responderte.';

/* ============================================================
   FORMULARIO DE CONTACTO — Formspree.
   Se manda por fetch en vez de dejar que el form navegue: así el
   visitante ve la confirmación acá mismo, sin recargar. Recargar no es
   gratis en esta web — el carrito vive en memoria y se perdería.
   El ID del endpoint es público (va en el HTML del cliente); lo que lo
   protege es el dominio autorizado en el panel de Formspree.
   Ojo con el chequeo de éxito: Formspree responde {"ok":true}, no
   {"success":true} como Web3Forms. Confundir esos dos campos hace que
   cada envío se muestre como error aunque haya salido bien.
   ============================================================ */
export function ContactForm() {
  const copyReveal = useReveal<HTMLDivElement>();
  const formReveal = useReveal<HTMLFormElement>();
  const { playBlip } = useSoundContext();

  const [status, setStatus] = useState<Status>({ kind: 'idle', text: IDLE_TEXT });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setStatus({ kind: 'sending', text: 'Enviando tu mensaje…' });
    try {
      // Se captura antes del reset(): después de limpiar el form los valores ya
      // no están, y la autorespuesta los necesita.
      const payload = Object.fromEntries(new FormData(form)) as Record<string, string>;
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'error');
      form.reset();
      setStatus({ kind: 'ok', text: 'Listo, te respondemos a la brevedad.' });
      playBlip(660);
      trackPixel('Contact');
      sendAutoReply({ name: payload.name, email: payload.email, message: payload.message }); // sin await: no debe demorar ni arrastrar el flujo
    } catch {
      setStatus({ kind: 'err', text: 'No pudimos enviarlo. Probá de nuevo, o escribinos por WhatsApp acá abajo.' });
    } finally {
      setSending(false);
    }
  }

  const statusClass = 'form-note' + (status.kind === 'ok' ? ' ok' : status.kind === 'err' ? ' err' : '');

  return (
    <section className="contact" id="contacto">
      <div className="wrap contact-grid">
        <div className={copyReveal.className} ref={copyReveal.ref}>
          <div className="eyebrow">Capa 05 — Contacto</div>
          <h2 className="sec-title">¿Preferís escribirnos?</h2>
          <p className="contact-copy">WhatsApp es lo más rápido, pero si estás en la compu o preferís dejarlo por escrito, mandanos el mensaje desde acá. Te contestamos al mail que nos dejes.</p>
          <ul className="contact-list">
            <li><span className="li-mark">1</span><span><b>Contanos qué necesitás.</b> Si es una pieza a medida, sumá medidas aproximadas y para qué la vas a usar.</span></li>
            <li><span className="li-mark">2</span><span><b>Te respondemos por mail.</b> Con precio estimado o las preguntas que falten para cerrarlo.</span></li>
            <li><span className="li-mark">WA</span><span><b>¿Tenés apuro?</b> El botón verde de WhatsApp sigue estando abajo a la derecha.</span></li>
          </ul>
        </div>
        <form id="contactForm" className={formReveal.className} ref={formReveal.ref} action="https://formspree.io/f/xvzejwvl" method="POST" onSubmit={handleSubmit}>
          <span className="form-title">// Mensaje directo</span>
          {/* _subject define el asunto del mail; el campo "email" de abajo lo toma
              Formspree como responder-a, así se le contesta al cliente directo. */}
          <input type="hidden" name="_subject" value="Nuevo mensaje desde stickos3d.com.ar" />
          {/* Honeypot de Formspree: los bots la completan, las personas no la ven. */}
          <input type="text" name="_gotcha" className="hp" tabIndex={-1} autoComplete="off" />
          <label>
            Tu nombre
            <input type="text" name="name" placeholder="Nombre y apellido" required />
          </label>
          <label>
            Tu mail
            <input type="email" name="email" placeholder="nombre@mail.com" required />
          </label>
          <label>
            Mensaje
            <textarea name="message" placeholder="Contanos qué necesitás…" required />
          </label>
          <button type="submit" className="btn btn-primary" id="contactSubmit" style={{ justifyContent: 'center' }} disabled={sending}>
            {sending ? 'Enviando…' : 'Enviar mensaje'}
          </button>
          <p className={statusClass} id="contactStatus" role="status" aria-live="polite">{status.text}</p>
        </form>
      </div>
    </section>
  );
}
