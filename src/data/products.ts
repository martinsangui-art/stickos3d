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
  { id: 'p1', name: 'Organizador de escritorio modular', cat: 'Hogar', price: 29700, g: 225, mat: 'PLA · varios colores', desc: 'Ordená lápices, cargadores y clips en un solo módulo apilable. Se ensambla sin herramientas y se adapta al espacio que tengas en el escritorio.', mpLink: null, status: 'listo' }, // [estimado +25%]
  // p2: único con laminado real (Creality Print, 120,52 g de Soleyin, $2.772
  // de material, 4h31m). El precio sale de comparar contra talleres
  // artesanales en MercadoLibre, no de la fórmula: no lo recalcules.
  { id: 'p2', name: 'Soporte de celular ajustable', cat: 'Gadgets', price: 15800, g: 121, mat: 'PLA · negro / blanco', desc: 'Se pliega para viajar y se abre en el ángulo que necesites para mirar, tipear o hacer videollamadas. Base antideslizante, sin mecanismos que se rompan.', mpLink: null, status: 'extruyendo', imgs: ['/assets/products/soporte-celular-1.jpg', '/assets/products/soporte-celular-2.jpg', '/assets/products/soporte-celular-3.jpg'] },
  // p3: laminado real, 140 g y $5.500 de material → $39.286/kg (más alto
  // que el PLA estándar por el cambio de color cáscara/inserto). Precio
  // pedido $31.500 — la fórmula da $31.564, cerca pero no exacto: se
  // respeta el precio real, no se recalcula.
  { id: 'p3', name: 'Maceta Autorregante', cat: 'Deco', price: 31500, g: 140, mat: 'PLA · 2 colores', desc: 'Reserva de agua propia en la base y orificios de drenaje calibrados: regás menos seguido y la planta no se ahoga. Cáscara exterior texturada + inserto interior extraíble para limpiar fácil. Elegís los colores de cáscara e inserto a tu gusto.', mpLink: null, status: 'listo', imgs: ['/assets/products/maceta-autorregante-1.jpg', '/assets/products/maceta-autorregante-2.jpg', '/assets/products/maceta-autorregante-3.jpg', '/assets/products/maceta-autorregante-4.jpg'] },
  { id: 'p4', name: 'Portarretrato personalizado', cat: 'Regalos', price: 7900, g: 60, mat: 'PLA · texto grabado', desc: 'Un marco simple con el texto que quieras grabado — nombre, fecha, una frase. Para esa foto que ya sacaste pero nunca imprimiste.', mpLink: null, status: 'extruyendo' },
  // p5: suma ~$1.000 de LED + pila CR2032 antes del markup. Si lo recalculás
  // solo desde g te va a dar $14.800 y estarías regalando los componentes.
  { id: 'p5', name: 'Lámpara de luna (con luz LED)', cat: 'Deco', price: 20500, g: 112, mat: 'PLA · incluye base', desc: 'Superficie texturada como la luna real, con luz LED cálida incluida. Se enciende con un toque, funciona a pila.', mpLink: null, status: 'pedido' }, // [estimado +25%]
  { id: 'p6', name: 'Rompecabezas de píxeles personalizado', cat: 'Juguetes', price: 9200, g: 70, mat: 'PLA · no tóxico', desc: 'Elegís la imagen, la convertimos en piezas para armar. Entretiene más de una tarde y queda de recuerdo.', mpLink: null, status: 'listo' },
  { id: 'p7', name: 'Gancho organizador de cables x6', cat: 'Hogar', price: 5000, g: 38, mat: 'TPU · flexible', desc: 'Seis clips flexibles para que los cables del escritorio dejen de ser un nudo. Se pegan o atornillan, como prefieras.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p8', name: 'Llavero personalizado con nombre', cat: 'Regalos', price: 3500, g: 12, mat: 'PLA · elegís color', desc: 'Tu nombre o el de quien se lo vas a regalar, en la tipografía que elijas. Diez minutos de trabajo, un regalo que no se olvida.', mpLink: null, status: 'extruyendo' }, // [estimado +25%] · piso
  { id: 'p9', name: 'Portamate con manija', cat: 'Hogar', price: 19800, g: 150, mat: 'PETG · resistente', desc: 'Para llevar el mate a todos lados sin quemarte ni derramarlo — la manija hace toda la diferencia. PETG, resiste el uso diario.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p10', name: 'Jarrón decorativo personalizado', cat: 'Deco', price: 17200, g: 130, mat: 'PLA · varios tamaños', desc: 'Una pieza escultórica para la mesa o la estantería, en el tamaño que necesites. Cada una sale un poco distinta — es parte de la gracia.', mpLink: null, status: 'pedido' },
  { id: 'p11', name: 'Fidget articulado (pulpo/dragón)', cat: 'Juguetes', price: 13200, g: 100, mat: 'PLA · flexible articulado', desc: 'Se mueve articulación por articulación, como el animal real. Impreso en una sola pieza, sin armado ni piezas sueltas que perder.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p12', name: 'Cartel / logo para emprendimientos', cat: 'Regalos', price: 13200, g: 100, mat: 'PLA · a medida', desc: 'Tu logo o el nombre de tu local, en 3D, listo para colgar o apoyar en el mostrador. Buen regalo para quien recién arranca un negocio.', mpLink: null, status: 'pedido' },
  // p13: laminado real, 122 g y $2.800 de material → $22.951/kg, que confirma
  // otra vez el costo de $23.000/kg. El precio sale de la fórmula, sin ajuste.
  { id: 'p13', name: 'Soporte elevador con guarda-auriculares', cat: 'Regalos', price: 16100, g: 122, mat: 'PLA · una sola pieza', desc: 'Levanta el celular a la altura justa para mirar de reojo mientras trabajás, con un espacio abajo para guardar los auriculares.', mpLink: null, status: 'pedido' },
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
];

// Un producto muestra precio final solo si ya tiene foto real cargada
// (imgs con al menos un elemento). Sin eso el precio es una estimación
// interna (ver PRICING.md) y no debe salir como si fuera definitivo.
export function hasConfirmedPrice(p: Product): boolean {
  return Array.isArray(p.imgs) && p.imgs.length > 0;
}
