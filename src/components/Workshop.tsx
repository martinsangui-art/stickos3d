import { PRINT_QUEUE } from '../data/config';
import { useReveal } from '../hooks/useReveal';

export function Workshop() {
  const aboutReveal = useReveal<HTMLDivElement>();
  const workshopReveal = useReveal<HTMLDivElement>();

  return (
    <section id="nosotros">
      <div className="wrap about-grid">
        <div className={aboutReveal.className} ref={aboutReveal.ref}>
          <div className="eyebrow">Capa 04 — Cómo laburamos</div>
          <h2 className="sec-title" style={{ marginBottom: '22px' }}>Lo que ves acá<br />es lo que hay.</h2>
          <p>Ahí al lado tenés la cola de impresión real: qué se está imprimiendo ahora y qué sigue. La actualizamos a mano, pieza por pieza.</p>
          <p>Cada pedido se revisa antes de salir del taller. Lo que ves en la web es exactamente lo que vas a recibir.</p>
        </div>
        <div className={`workshop ${workshopReveal.className}`} ref={workshopReveal.ref} aria-label="Cola de impresión del taller">
          <div className="workshop-head">
            <span>Cola de impresión</span>
            <span className="live-dot">EN EL TALLER</span>
          </div>
          <div id="printQueue">
            {PRINT_QUEUE.map((j) => (
              <div className="job" key={j.name}>
                <div className="job-name">
                  <span>{j.name}</span>
                  {j.progress > 0 ? (
                    <span className="badge b-orange"><span className="dot"></span>{j.progress}% listo</span>
                  ) : (
                    <span className="badge b-grey"><span className="dot"></span>En cola</span>
                  )}
                </div>
                {j.progress > 0 && (
                  <div className="bar"><i style={{ width: `${j.progress}%` }}></i></div>
                )}
              </div>
            ))}
          </div>
          <div className="workshop-foot">
            <b>&gt;</b> materiales: PLA / PETG / TPU<br />
            <b>&gt;</b> control de calidad: pieza por pieza<br />
            <b>&gt;</b> estado: imprimiendo<span className="cursor">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
