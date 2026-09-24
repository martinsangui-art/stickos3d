import { useReveal } from '../hooks/useReveal';

export function Workshop() {
  const aboutReveal = useReveal<HTMLDivElement>();

  return (
    <section id="nosotros">
      <div className="wrap">
        <div className={aboutReveal.className} ref={aboutReveal.ref}>
          <div className="eyebrow">Capa 04 — Cómo laburamos</div>
          <h2 className="sec-title" style={{ marginBottom: '22px' }}>Lo que ves acá<br />es lo que hay.</h2>
          <p>Cada pedido se revisa antes de salir del taller.</p>
        </div>
      </div>
    </section>
  );
}
