export function Breather() {
  return (
    <div className="breather">
      <span className="tick tl"></span>
      <span className="tick tr"></span>
      <div className="wrap">
        <div className="breather-eyebrow">// A tu gusto</div>
        <h3>
          Elegís el color. Elegís <span className="accent">el diseño.</span>
        </h3>
        <p>Nada de elegir entre los 3 colores que quedaron en stock. Nos contás la idea y lo imprimimos a tu manera.</p>
        <div className="breather-badges">
          <span className="b-orange">Color</span>
          <span className="b-teal">Material</span>
          <span>Diseño</span>
        </div>
      </div>
    </div>
  );
}
