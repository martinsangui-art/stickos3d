import { VISIBLE_PRODUCTS } from '../data/products';
import { fmt } from '../lib/format';

/* Hero — Ruta A ("Taller"): el argumento a la izquierda como ficha técnica,
   la pieza destacada a la derecha.

   Desde el 26/09/2026 el CTA principal es la pieza a medida: todas las
   ventas hasta ahora entraron por el cotizador o por consultas de piezas a
   medida (WhatsApp / Instagram), no por el carrito. El h1 nombra "impresos
   en 3D" a propósito: es lo que la gente escribe en Google para llegar.

   La pieza destacada NO está hardcodeada: sale del mismo array que el
   catálogo, así que cuando Martín reordena la grilla el hero acompaña solo. */
export function Hero() {
  // Primera pieza con foto confirmada, respetando el orden real de la
  // grilla (hoy las lámparas van primero).
  const featured = VISIBLE_PRODUCTS[0];

  return (
    <div className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-main">
            <div className="hero-idx">[ 01 ] — Piezas a pedido</div>
            <h1>
              <span className="capa">Piezas a medida,</span>
              <span className="capa">lámparas y regalos</span>
              <span className="capa">impresos en 3D.</span>
            </h1>
            <p>Del catálogo o diseñado para vos: mandanos una foto, la idea o el archivo, te pasamos el precio por WhatsApp y lo recibís donde estés.</p>
            <div className="hero-ctas">
              <a href="#pedido" className="btn btn-primary">Cotizar una pieza a medida</a>
              <a href="#catalogo" className="btn btn-ghost">Ver catálogo</a>
            </div>
            <div className="hero-specs">
              <div><strong>A medida</strong>Desde una foto, una idea o tu archivo</div>
              <div><strong>Precio</strong>Referencia al instante, final por WhatsApp</div>
              <div><strong>Garantía STICKOS</strong>Si llega dañada, la rehacemos</div>
              <div><strong>Entrega</strong>Retiro local + envío a todo el país</div>
            </div>
          </div>

          <div className="rule" aria-hidden="true"></div>

          <div className="hero-side">
            <div className="rig-panel">
              {featured && (
                <>
                  <div className="rig-photo">
                    <img src={featured.imgs![0]} alt={featured.name} />
                  </div>
                  <div className="rig-cap">
                    <div className="nm">{featured.name}</div>
                    <span className="pr">{fmt(featured.price)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
