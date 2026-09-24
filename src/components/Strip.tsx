// Contenido fijo, no viene de usuario — dangerouslySetInnerHTML es seguro acá
// y reproduce el innerHTML exacto (incluida la etiqueta <b>) del original.
const stripItems =
  'ELEGÍS EL COLOR <b>//</b> PRECIO DE REFERENCIA AL INSTANTE <b>//</b> SI LLEGA DAÑADA, LA REHACEMOS <b>//</b> RETIRO SIN CARGO EN BAHÍA BLANCA <b>//</b> PIEZAS A MEDIDA <b>//</b> ENVÍOS A TODO EL PAÍS <b>//</b> ';

export function Strip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-inner" id="strip">
        <span dangerouslySetInnerHTML={{ __html: stripItems.repeat(4) }} />
      </div>
    </div>
  );
}
