import { wa } from '../lib/format';
import { trackPixel } from '../lib/pixel';

export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={wa('¡Hola STICKOS 3D! Quería hacer una consulta.')}
      target="_blank"
      rel="noopener"
      aria-label="Escribinos por WhatsApp"
      onClick={() => trackPixel('Contact', { content_category: 'wa-float' })}
    >
      <svg viewBox="0 0 32 32">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.6.8 5 2.3 7L4 29l7.2-2.2c1.9 1 4 1.5 4.8 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-4.3 1.3 1.3-4.1-.3-.4C6 18.9 5.4 17 5.4 15 5.4 9.2 10.2 4.4 16 4.4S26.6 9.2 26.6 15 21.8 25.2 16 25.2zm5.8-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.4-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </a>
  );
}
