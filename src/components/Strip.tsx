// Contenido fijo, no viene de usuario — dangerouslySetInnerHTML es seguro acá
// y reproduce el innerHTML exacto (incluida la etiqueta <b>) del original.
const stripItems =
  'ELEGÍS EL COLOR <b>//</b> COTIZACIÓN INSTANTÁNEA <b>//</b> GARANTÍA DE REIMPRESIÓN <b>//</b> PLA · PETG · TPU <b>//</b> PIEZAS A MEDIDA <b>//</b> STOCK ELEGIDO <b>//</b> ';

export function Strip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-inner" id="strip">
        <span dangerouslySetInnerHTML={{ __html: stripItems.repeat(4) }} />
      </div>
    </div>
  );
}
