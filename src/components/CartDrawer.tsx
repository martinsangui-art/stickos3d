import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { COLOR_TBD } from '../data/config';
import { fmt, openWhatsApp, wa } from '../lib/format';
import { trackPixel } from '../lib/pixel';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { cart, total, inc, dec } = useCart();
  const { notify } = useToast();
  const items = Object.entries(cart);

  function checkout() {
    if (!items.length) {
      // Mismo sistema de Toast que usa el resto del sitio (ej: "agregado
      // ✓") — antes esto disparaba un alert() nativo del navegador,
      // la única notificación de todo STICKOS 3D que no pasaba por acá.
      notify('Tu pedido está vacío — sumá algo del catálogo 👇');
      return;
    }
    let msg = '¡Hola STICKOS 3D! Quiero pedir esto:\n\n';
    items.forEach(([, i]) => {
      msg += `• ${i.name} — x${i.qty} — ${fmt(i.price * i.qty)}\n`;
    });
    msg += `\nTotal estimado: ${fmt(total)}\n\nMi usuario de Instagram (5 % off): \n\n¿Me confirman disponibilidad, colores y forma de pago?`;
    trackPixel('InitiateCheckout', {
      value: total,
      currency: 'ARS',
      num_items: items.reduce((a, [, i]) => a + i.qty, 0),
      content_ids: items.map(([key]) => key),
    });
    openWhatsApp(wa(msg));
  }

  return (
    <>
      <div className={'overlay' + (open ? ' open' : '')} onClick={onClose}></div>
      <aside className={'drawer' + (open ? ' open' : '')} aria-label="Tu pedido">
        <div className="drawer-head">
          <h3>Tu pedido</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar tu pedido">×</button>
        </div>
        <div className="drawer-items">
          {items.length === 0 ? (
            <p className="empty-cart">Tu pedido está vacío.<br />Sumá algo del catálogo 👇</p>
          ) : (
            items.map(([key, i]) => (
              <div className="d-item" key={key}>
                <div>
                  <h4>{i.name}</h4>
                  <div className="d-color"><i style={{ background: COLOR_TBD.hex }}></i>Color: a coordinar</div>
                  <span className="price">{fmt(i.price)} c/u</span>
                </div>
                <div className="qty">
                  <button aria-label="Restar" onClick={() => dec(key)}>−</button>
                  <span>{i.qty}</span>
                  <button aria-label="Sumar" onClick={() => inc(key)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="drawer-foot">
          <div className="total-row"><span>Total estimado</span><span className="price">{fmt(total)}</span></div>
          <p className="drawer-ig">¿Nos seguís en Instagram? 5 % off: dejá tu usuario en el mensaje.</p>
          <button className="btn btn-primary" onClick={checkout}>Enviar pedido por WhatsApp</button>
          <p className="drawer-note">Te confirmamos disponibilidad y plazo, y te pasamos el link de Mercado Pago o los datos de transferencia. Sin vueltas.</p>
        </div>
      </aside>
    </>
  );
}
