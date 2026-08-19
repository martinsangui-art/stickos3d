import { useCart } from '../context/CartContext';
import { fmt, wa } from '../lib/format';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { cart, total, inc, dec } = useCart();
  const items = Object.entries(cart);

  function checkout() {
    if (!items.length) {
      alert('Tu cola está vacía. Agregá algo del catálogo primero.');
      return;
    }
    let msg = '¡Hola STICKOS 3D! Quiero mandar esto a la cola de impresión:\n\n';
    items.forEach(([, i]) => {
      msg += `• ${i.name} — color ${i.color} — x${i.qty} — ${fmt(i.price * i.qty)}\n`;
    });
    msg += `\nTotal estimado: ${fmt(total)}\n\n¿Me confirman disponibilidad y forma de pago?`;
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
