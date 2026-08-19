export function Hero() {
  return (
    <div className="hero">
      <div className="wrap">
        <div className="eyebrow">Bahía Blanca · Envíos a todo el país</div>
        <h1>
          <span className="capa">Ideas hechas</span>
          <span className="capa">objeto,</span>
          <span className="capa">capa por capa.</span>
        </h1>
        <p>Elegí el color en pantalla, cotizá al instante y recibilo donde estés. Con garantía de reimpresión si algo sale mal.</p>
        <div className="hero-ctas">
          <a href="#catalogo" className="btn btn-primary">Ver catálogo</a>
          <a href="#pedido" className="btn btn-ghost">Cotizar una pieza a medida</a>
          <a href="#contacto" className="btn btn-ghost">Contactanos</a>
        </div>
        <div className="hero-specs">
          <div><strong>Elegís el color</strong>EN PANTALLA, EN VIVO</div>
          <div><strong>Cotización al instante</strong>SIN ESPERAR RESPUESTA</div>
          <div><strong>Garantía STICKOS</strong>REIMPRESIÓN SIN CARGO</div>
          <div><strong>Retiro o envío</strong>LOCAL + TODO EL PAÍS</div>
        </div>
      </div>
    </div>
  );
}
