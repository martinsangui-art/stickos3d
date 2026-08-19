import type { Product } from './types';

/* ============================================================
   PRODUCTOS — copiá un bloque {...} para agregar uno nuevo.
   price se calculó como: (g / 1000) × 23000 (costo real filamento/kg, PLA
   Soleyin confirmado por laminado) × 5.739 (markup), redondeado a la centena.
   Piso mínimo: $3.500 en cualquier producto.
   g = gramos. Productos marcados [estimado +25%] todavía no tienen laminado
   real — actualizar cuando se lamine el STL reversionado.
   mpLink: link de pago de Mercado Pago, o null.
   ============================================================ */
// status: "extruyendo" | "listo" | "pedido" — placeholder, calibrar con el stock real del taller.
export const PRODUCTS: Product[] = [
  { id: 'p17', name: 'ONDA', cat: 'Deco', price: 44999, g: 185, mat: 'PLA · blanco', desc: 'Lámpara de mesa con pantalla plisada, impresa en 3D. Luz cálida y continua que se filtra a través de la trama radial de la pantalla. Base y cuerpo en dos diámetros escalonados. Medidas y colores personalizables a pedido.', mpLink: null, status: 'pedido', imgs: ['/assets/products/onda-1.jpg', '/assets/products/onda-2.jpg', '/assets/products/onda-3.jpg'] },
  { id: 'p19', name: 'KETIL', cat: 'Deco', price: 48200, g: 365, mat: 'PLA · Base + Cap + Pantalla', desc: 'Pantalla acanalada que envuelve la luz sin dejar una sola costura visible. Base E26/E27 — le entra cualquier bombita que ya tengas. 270mm de alto, 230mm de diámetro. Impresa capa por capa, a tu medida.', mpLink: null, status: 'listo', imgs: ['/assets/products/ketil-1.jpg', '/assets/products/ketil-2.jpg', '/assets/products/ketil-3.jpg'] },
  { id: 'p1', name: 'Organizador de escritorio modular', cat: 'Hogar', price: 29700, g: 225, mat: 'PLA · varios colores', desc: 'Ordená lápices, cargadores y clips en un solo módulo apilable. Se ensambla sin herramientas y se adapta al espacio que tengas en el escritorio.', mpLink: null, status: 'listo' }, // [estimado +25%]
  // p2: único con laminado real (Creality Print, 120,52 g de Soleyin, $2.772
  // de material, 4h31m). El precio sale de comparar contra talleres
  // artesanales en MercadoLibre, no de la fórmula: no lo recalcules.
  { id: 'p2', name: 'Soporte de celular ajustable', cat: 'Gadgets', price: 15800, g: 121, mat: 'PLA · negro / blanco', desc: 'Se pliega para viajar y se abre en el ángulo que necesites para mirar, tipear o hacer videollamadas. Base antideslizante, sin mecanismos que se rompan.', mpLink: null, status: 'extruyendo' },
  // p3: laminado real, 140 g y $5.500 de material → $39.286/kg (más alto
  // que el PLA estándar por el cambio de color cáscara/inserto). La
  // fórmula daría ~$31.564, pero el precio se ajustó a pedido a $20.000
  // (por debajo del costo×5,74) — precio fijado directo, no recalcular.
  { id: 'p3', name: 'Maceta Autorregante', cat: 'Deco', price: 20000, g: 140, mat: 'PLA · 2 colores', desc: 'Reserva de agua propia en la base y orificios de drenaje calibrados: regás menos seguido y la planta no se ahoga. Cáscara exterior texturada + inserto interior extraíble para limpiar fácil. Elegís los colores de cáscara e inserto a tu gusto.', mpLink: null, status: 'listo', imgs: ['/assets/products/maceta-autorregante-1.jpg', '/assets/products/maceta-autorregante-2.jpg', '/assets/products/maceta-autorregante-3.jpg', '/assets/products/maceta-autorregante-4.jpg'] },
  { id: 'p4', name: 'Portarretrato personalizado', cat: 'Regalos', price: 7900, g: 60, mat: 'PLA · texto grabado', desc: 'Un marco simple con el texto que quieras grabado — nombre, fecha, una frase. Para esa foto que ya sacaste pero nunca imprimiste.', mpLink: null, status: 'extruyendo' },
  // p5: suma ~$1.000 de LED + pila CR2032 antes del markup. Si lo recalculás
  // solo desde g te va a dar $14.800 y estarías regalando los componentes.
  { id: 'p5', name: 'Porta líquido difusor de aromas', cat: 'Deco', price: 15000, g: 107, mat: 'PLA mate', desc: 'Set de dos piezas con arcos apilados: una para varillas de difusor, otra como florero. Se venden por unidad, $15.000 cada una — combinalas o llevate la que necesites.', mpLink: null, status: 'pedido', imgs: ['/assets/products/porta-liquido-1.jpg'] },
  { id: 'p6', name: 'Rompecabezas de píxeles personalizado', cat: 'Juguetes', price: 9200, g: 70, mat: 'PLA · no tóxico', desc: 'Elegís la imagen, la convertimos en piezas para armar. Entretiene más de una tarde y queda de recuerdo.', mpLink: null, status: 'listo' },
  { id: 'p7', name: 'Gancho organizador de cables x6', cat: 'Hogar', price: 5000, g: 38, mat: 'TPU · flexible', desc: 'Seis clips flexibles para que los cables del escritorio dejen de ser un nudo. Se pegan o atornillan, como prefieras.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p8', name: 'Llavero personalizado con nombre', cat: 'Regalos', price: 3500, g: 12, mat: 'PLA · elegís color', desc: 'Tu nombre o el de quien se lo vas a regalar, en la tipografía que elijas. Diez minutos de trabajo, un regalo que no se olvida.', mpLink: null, status: 'extruyendo' }, // [estimado +25%] · piso
  { id: 'p9', name: 'Portamate con manija', cat: 'Hogar', price: 19800, g: 150, mat: 'PETG · resistente', desc: 'Para llevar el mate a todos lados sin quemarte ni derramarlo — la manija hace toda la diferencia. PETG, resiste el uso diario.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p10', name: 'Jarrón decorativo personalizado', cat: 'Deco', price: 17200, g: 130, mat: 'PLA · varios tamaños', desc: 'Una pieza escultórica para la mesa o la estantería, en el tamaño que necesites. Cada una sale un poco distinta — es parte de la gracia.', mpLink: null, status: 'pedido' },
  { id: 'p11', name: 'Fidget articulado (pulpo/dragón)', cat: 'Juguetes', price: 13200, g: 100, mat: 'PLA · flexible articulado', desc: 'Se mueve articulación por articulación, como el animal real. Impreso en una sola pieza, sin armado ni piezas sueltas que perder.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p12', name: 'Cartel / logo para emprendimientos', cat: 'Regalos', price: 13200, g: 100, mat: 'PLA · a medida', desc: 'Tu logo o el nombre de tu local, en 3D, listo para colgar o apoyar en el mostrador. Buen regalo para quien recién arranca un negocio.', mpLink: null, status: 'pedido' },
  // p13: laminado real, 122 g y $2.800 de material → $22.951/kg, que confirma
  // otra vez el costo de $23.000/kg. El precio sale de la fórmula, sin ajuste.
  { id: 'p13', name: 'Soporte elevador de smartphone con stand para auriculares', cat: 'Regalos', price: 16100, g: 122, mat: 'PLA · una sola pieza', desc: 'Levanta el celular a la altura justa para mirar de reojo mientras trabajás, con un espacio abajo para guardar los auriculares.', mpLink: null, status: 'pedido', imgs: ['/assets/products/soporte-elevador-1.jpg', '/assets/products/soporte-elevador-2.jpg', '/assets/products/soporte-elevador-3.jpg'] },
  // p14: laminado real, 13 g y $300 → $23.077/kg, otra confirmación del costo
  // base. La fórmula daría $1.700: acá manda el piso de $3.500.
  { id: 'p14', name: 'Ala Nocturna — anillo lector sujeta páginas', cat: 'Regalos', price: 3500, g: 13, mat: 'PLA · negro', desc: 'Se desliza en el dedo pulgar y sostiene el libro abierto solo, sin que tengas que usar las dos manos. Para leer comiendo, en el bondi, o en la cama.', mpLink: null, status: 'pedido', imgs: ['/assets/products/ala-nocturna-1.jpg', '/assets/products/ala-nocturna-2.jpg', '/assets/products/ala-nocturna-3.jpg'] }, // piso
  // p15: laminado real, 136 g y $5.300 de material → $38.971/kg, calza con
  // el $40.000/kg de Silk ya confirmado antes. Precio = costo real x 5.739,
  // sin ajuste.
  { id: 'p15', name: 'Now Playing — soporte para vinilo', cat: 'Deco', price: 30400, g: 136, mat: 'PLA Silk · azul/violeta', desc: 'Apoyá el disco que estás escuchando en este momento, bien visible. En PLA Silk, con un brillo que cambia según la luz.', mpLink: null, status: 'listo', imgs: ['/assets/products/now-playing-1.jpg', '/assets/products/now-playing-2.jpg', '/assets/products/now-playing-3.jpg', '/assets/products/now-playing-4.jpg'] },
  // p16: laminado real, 130 g y $3.000 de material → $23.077/kg, confirma
  // otra vez el costo de $23.000/kg. Precio = costo real x 5.739, sin
  // ajuste (redondeado a la centena).
  { id: 'p16', name: 'Soporte Universal Desmontable para Notebook', cat: 'Hogar', price: 17200, g: 130, mat: 'PLA · negro + acento a elección', desc: 'Se pliega para viajar, se arma en segundos, y el riel dentado te deja elegir el ángulo exacto. Para notebook, tablet o lo que necesites elevar del escritorio.', mpLink: null, status: 'pedido', imgs: ['/assets/products/soporte-notebook-1.jpg', '/assets/products/soporte-notebook-2.jpg', '/assets/products/soporte-notebook-3.jpg'] },
  { id: 'p18', name: 'MIXTURE', cat: 'Juguetes', price: 12000, g: 90, mat: 'PLA · colores a elección', desc: 'Doce controles, cero motivo. MIXTURE es un combo de dos piezas pensado para jugar con las manos mientras la cabeza hace otra cosa. Perillas, slider y una traba a rosca de bonus. Colores a elección.', mpLink: null, status: 'pedido', imgs: ['/assets/products/mixture-1.jpg', '/assets/products/mixture-2.jpg'] },
  { id: 'p20', name: 'FUELLE', cat: 'Deco', price: 78000, g: 328, mat: 'PLA · incluye portalámparas E27, cable y perilla', desc: 'Cinco módulos apilados que filtran la luz a través de una malla perforada. Encendida no ilumina de frente: proyecta un patrón cálido sobre la pared. Mide 23 cm y pesa lo que aparenta. 23 × 13,7 × 13,7 cm. Lista para enchufar. Tamaño y colores personalizables a pedido.', mpLink: null, status: 'pedido', imgs: ['/assets/products/fuelle-1.jpg', '/assets/products/fuelle-2.jpg', '/assets/products/fuelle-3.jpg'] },
];

// Un producto muestra precio final solo si ya tiene foto real cargada
// (imgs con al menos un elemento). Sin eso el precio es una estimación
// interna (ver PRICING.md) y no debe salir como si fuera definitivo.
export function hasConfirmedPrice(p: Product): boolean {
  return Array.isArray(p.imgs) && p.imgs.length > 0;
}
