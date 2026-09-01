/* ---- Autorespuesta al visitante (EmailJS) ----
   La public key va en el HTML por diseño; lo que la protege es el dominio
   autorizado en el panel de EmailJS.
   Es un extra, no parte del flujo: cuando esto corre, el mensaje YA entró por
   Formspree. Por eso si falla no se le avisa nada al visitante ni se toca el
   estado del formulario — solo queda un warning en consola.

   El SDK se carga por <script> en index.html (no como paquete npm): así
   coincide 1:1 con el original y no hace falta bundlear la key distinto. */
const EMAILJS = { service: 'service_q92zkyv', template: 'template_j0ic3r9', publicKey: 'g76VDrZbQEF22XBq6' };

interface EmailJsGlobal {
  init: (opts: { publicKey: string }) => void;
  send: (service: string, template: string, params: Record<string, string>) => Promise<unknown>;
}

declare global {
  interface Window {
    emailjs?: EmailJsGlobal;
  }
}

let initialized = false;
function ensureInit() {
  if (initialized || typeof window.emailjs === 'undefined') return;
  window.emailjs.init({ publicKey: EMAILJS.publicKey });
  initialized = true;
}

export function sendAutoReply(p: { name: string; email: string; message: string }): void {
  ensureInit();
  if (typeof window.emailjs === 'undefined') {
    console.warn('[autorespuesta] el SDK de EmailJS no cargó; se omite.');
    return;
  }
  // Se mandan varios alias del mail porque el destinatario del template puede
  // estar mapeado a {{email}}, {{to_email}} o {{reply_to}} según cómo se armó.
  window.emailjs
    .send(EMAILJS.service, EMAILJS.template, {
      name: p.name,
      email: p.email,
      message: p.message,
      to_email: p.email,
      reply_to: p.email,
      to_name: p.name,
    })
    .catch((err) => console.warn('[autorespuesta] no se pudo enviar:', err));
}
