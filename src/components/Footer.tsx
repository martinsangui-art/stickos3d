import { CONFIG } from '../data/config';
import { mailBody, wa, waWeb } from '../lib/format';

export function Footer() {
  // Botón de arrepentimiento (Res. 424/2020 de Comercio Interior): acceso
  // directo, sin registro, para pedir la revocación de una compra a distancia.
  const withdrawalHref = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Arrepentimiento de compra')}&body=${encodeURIComponent('Nombre:\nProducto:\nFecha de compra:\n')}`;
  const mailtoHref = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Consulta desde la web — STICKOS 3D')}&body=${encodeURIComponent(mailBody)}`;

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a href="#" className="logo" style={{ marginBottom: '12px', display: 'inline-flex' }} aria-label="STICKOS 3D">
              <span className="wm" style={{ fontSize: '21px' }}>
                <span className="wm-b">STICKOS<em>3D</em></span>
                <span className="wm-t" aria-hidden="true">STICKOS<em>3D</em></span>
              </span>
            </a>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', maxWidth: '32ch' }}>Lámparas y objetos de deco hechos a pedido en Bahía Blanca.</p>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', maxWidth: '38ch', marginTop: '8px' }}>Envío a todo el país, según destino · Productos del catálogo: podés arrepentirte dentro de los 10 días corridos de recibido. Las piezas hechas según tus medidas o diseño no admiten arrepentimiento. Ante un defecto de fabricación, garantía legal de 6 meses — el envío de cambio lo cubrimos nosotros.</p>
            <a href={withdrawalHref} className="foot-withdrawal" id="footWithdrawal">Botón de arrepentimiento</a>
          </div>
          <div>
            <h4>Tienda</h4>
            <a href="#catalogo">Catálogo</a>
            <a href="#pedido">Pieza a medida</a>
            <a href="#comprar">Cómo comprar</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <span className="foot-mail" id="footEmail">{CONFIG.email}</span>
            <a href={wa('¡Hola STICKOS 3D!')} id="footWa" target="_blank" rel="noopener">WhatsApp — abrir app</a>
            <a href={waWeb('¡Hola STICKOS 3D!')} id="footWaWeb" target="_blank" rel="noopener">WhatsApp Web</a>
            <a href={mailtoHref} id="footMail">Escribinos por mail</a>
          </div>
          <div>
            <h4>Redes</h4>
            <a href={`https://instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener">Instagram — @{CONFIG.instagram}</a>
          </div>
        </div>
        <div className="foot-base">
          <span>© 2026 STICKOS 3D</span>
          <span>HECHO A PEDIDO EN BAHÍA BLANCA</span>
        </div>
      </div>
    </footer>
  );
}
