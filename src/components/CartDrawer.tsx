import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { fmt, wa } from '../lib/format';
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
      // Mismo sistema de Toast que usa el resto del sitio (ej: "agregado a
      // la cola ✓") — antes esto disparaba un alert() nativo del navegador,
      // la única notificación de todo STICKOS 3D que no pasaba por acá.
      notify('Tu cola está vacía — sumá algo del catálogo 👇');
      return;
    }
    let msg = '¡Hola STICKOS 3D! Quiero mandar esto a la cola de impresión:\n\n';
    items.forEach(([, i]) => {
      msg += `• ${i.name} — color ${i.color} — x${i.qty} — ${fmt(i.price * i.qty)}\n`;
    });
    msg += `\nTotal estimado: ${fmt(total)}\n\n¿Me confirman disponibilidad y forma de pago?`;
    trackPixel('InitiateCheckout', {
      value: total,
      currency: 'ARS',
      num_items: items.reduce((a, [, i]) => a + i.qty, 0),
      content_ids: items.map(([key]) => key.split('|')[0]),
    });
    window.open(wa(msg), '_blank');
  }

  return (
    <>
      <div className={'overlay' + (open ? ' open' : '')} onClick={onClose}></div>
      <aside className={'drawer' + (open ? ' open' : '')} aria-label="Cola de impresión">
        <div className="drawer-head">
          <h3>Tu cola de impresión</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar cola de impresión">×</button>
        </div>
        <div className="drawer-items">
          {items.length === 0 ? (
            <p className="empty-cart">Tu cola está vacía.<br />Sumá algo del catálogo 👇</p>
          ) : (
            items.map(([key, i]) => (
              <div className="d-item" key={key}>
                <div>
                  <h4>{i.name}</h4>
                  <div className="d-color"><i style={{ background: i.colorHex }}></i>{i.color}</div>
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
          <button className="btn btn-primary" onClick={checkout}>Confirmar cola por WhatsApp</button>
          <p className="drawer-note">Te confirmamos stock y plazo, y te pasamos el link de Mercado Pago o los datos de transferencia. Sin vueltas.</p>
        </div>
      </aside>
    </>
  );
}
