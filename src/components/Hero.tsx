import { PRINT_QUEUE } from '../data/config';
import { hasConfirmedPrice, PRODUCTS } from '../data/products';
import { fmt } from '../lib/format';

/* Hero — Ruta A ("Taller"): el argumento a la izquierda como ficha técnica,
   el estado real del taller a la derecha.

   La pieza destacada y el trabajo en curso NO están hardcodeados: salen del
   mismo array que el catálogo y de PRINT_QUEUE, así que cuando Martín
   reordena la grilla o actualiza la cola, el hero acompaña solo. */
export function Hero() {
  // Primera pieza con foto confirmada, respetando el orden real de la
  // grilla (hoy las lámparas van primero).
  const featured = PRODUCTS.find(hasConfirmedPrice);
  // El trabajo que está corriendo ahora; si no hay ninguno en curso, el
  // primero de la cola.
  const running = PRINT_QUEUE.find((j) => j.progress > 0) ?? PRINT_QUEUE[0];

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
              <div className="rig-head">
                <span>En la impresora</span>
                <span className="rig-live"><i></i>Ahora</span>
              </div>
              {running && (
                <div className="rig-body">
                  <div className="rig-job">
                    <span className="nm">{running.name}</span>
                    <span className="pc">{running.progress > 0 ? `${running.progress}%` : 'En cola'}</span>
                  </div>
                  {running.progress > 0 && (
                    <div className="rig-track"><i style={{ width: `${running.progress}%` }}></i></div>
                  )}
                </div>
              )}
              {featured && (
                <>
                  <div className="rig-photo">
                    <img src={featured.imgs![0]} alt={featured.name} />
                  </div>
                  <div className="rig-cap">
                    <div>
                      <div className="nm">{featured.name}</div>
                      <div className="mt">{featured.mat} · {featured.g} g</div>
                    </div>
                    <span className="pr">{fmt(featured.price)}</span>
                  </div>
                </>
              )}
              <div className="rig-foot">Control de calidad: pieza por pieza</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
