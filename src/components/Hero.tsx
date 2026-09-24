import { VISIBLE_PRODUCTS } from '../data/products';
import { fmt } from '../lib/format';

/* Hero — Ruta A ("Taller"): el argumento a la izquierda como ficha técnica,
   la pieza destacada a la derecha.

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
              <span className="capa">Ideas hechas</span>
              <span className="capa">objeto,</span>
              <span className="capa">capa por capa.</span>
            </h1>
            <p>Elegí el color en pantalla, cotizá al instante y recibilo donde estés. Con garantía de reimpresión si algo sale mal.</p>
            <div className="hero-ctas">
              <a href="#catalogo" className="btn btn-primary">Ver catálogo</a>
              <a href="#pedido" className="btn btn-ghost">Cotizar una pieza a medida</a>
            </div>
            <div className="hero-specs">
              <div><strong>Elegís el color</strong>En pantalla, en vivo</div>
              <div><strong>Cotización</strong>Al instante, sin esperar respuesta</div>
              <div><strong>Garantía STICKOS</strong>Reimpresión sin cargo</div>
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
