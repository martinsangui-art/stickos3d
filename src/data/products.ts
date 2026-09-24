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
  // p21: laminado real 345 g (128 + 189 de piezas + 28 de purga del cambio de
  // color) en Hyper PLA a $35.000/kg = $12.075 de filamento, más $15.000 de
  // cable y foco LED cálido → costo real $27.075. La fórmula (costo × 5,74)
  // daría $155.400. Se fijó $49.999 como PRECIO DE LANZAMIENTO por decisión de
  // negocio (margen ~1,85x): excepción consciente y documentada, no error.
  // No recalcular ni "corregir" hacia la fórmula.
  { id: 'p21', name: 'HUSO', cat: 'Deco', price: 49999, g: 345, mat: 'Dos colores a elección', desc: 'Pantalla torcida sobre sí misma, con una trama fina que deja pasar la luz sin mostrar la bombita. 29 cm de alto. Luz baja y cálida para una mesa, un estante o el piso al lado del sillón. Llega lista para enchufar, con cable y foco LED cálido. Elegís la combinación de colores de pantalla y base.', mpLink: null, status: 'pedido', imgs: ['/assets/products/huso-1.jpg', '/assets/products/huso-2.jpg', '/assets/products/huso-3.jpg'] },
  { id: 'p19', name: 'KETIL', cat: 'Deco', price: 48200, g: 365, mat: 'Color a elección', desc: 'Pantalla acanalada que envuelve la luz sin dejar una sola costura visible. Base E26/E27 — le entra cualquier bombita que ya tengas. 27 cm de alto y 23 cm de diámetro. Medidas y colores personalizables a pedido.', mpLink: null, status: 'listo', imgs: ['/assets/products/ketil-1.jpg', '/assets/products/ketil-2.jpg', '/assets/products/ketil-3.jpg'] },
  // p20: repreciada el 1/9/2026 de $78.000 a $46.999 por decisión de
  // posicionamiento, no por costo. Es la más chica de las cuatro lámparas
  // (23 cm, 328 g) y a $78.000 quedaba como outlier frente a ONDA ($44.999),
  // KETIL ($48.200) y HUSO ($49.999). La escalera de la línea ahora es
  // ONDA < FUELLE < KETIL < HUSO. Excepción consciente a la fórmula x5,74,
  // documentada. No recalcular.
  { id: 'p20', name: 'FUELLE', cat: 'Deco', price: 46999, g: 328, mat: 'Incluye portalámparas E27, cable y perilla', desc: 'Cinco módulos apilados que filtran la luz a través de una malla perforada. Encendida no ilumina de frente: proyecta un patrón cálido sobre la pared. Mide 23 cm y pesa lo que aparenta. 23 × 13,7 × 13,7 cm. Lista para enchufar. Tamaño y colores personalizables a pedido.', mpLink: null, status: 'pedido', imgs: ['/assets/products/fuelle-1.jpg', '/assets/products/fuelle-2.jpg', '/assets/products/fuelle-3.jpg'] },
  // p22: laminado real 280 g en Hyper PLA a $35.000/kg = $9.800 de filamento,
  // mas $10.000 de kit electrico con foco LED blanco calido -> costo real
  // $19.800. La formula (costo x 5,74) daria $113.700. Se fijo $47.999 por
  // posicionamiento dentro de la linea de lamparas (ONDA 44.999 / FUELLE
  // 46.999 / KENDAI 47.999 / KETIL 48.200 / HUSO 49.999). Margen 2,42x:
  // excepcion consciente y documentada, no error. No recalcular.
  { id: 'p22', name: 'KENDAI', cat: 'Deco', price: 47999, g: 280, mat: 'Pantalla y patas en dos colores a elección', desc: 'Aletas en espiral que filtran la luz entre las láminas, nunca de frente. 23 cm de alto por 16 de ancho. Es 100 % decorativa: arma un rincón, no ilumina para leer ni para trabajar. Llega lista para enchufar, con cable y foco LED blanco cálido. También se puede hacer colgante. Elegís la combinación de colores de pantalla y patas.', mpLink: null, status: 'pedido', imgs: ['/assets/products/kendai-1.jpg', '/assets/products/kendai-2.jpg', '/assets/products/kendai-3.jpg'] },
  { id: 'p17', name: 'ONDA', cat: 'Deco', price: 44999, g: 185, mat: 'Blanco', desc: 'Lámpara de mesa con pantalla plisada. Luz cálida y continua que se filtra a través de la trama radial de la pantalla. Base y cuerpo en dos diámetros escalonados. Medidas y colores personalizables a pedido.', mpLink: null, status: 'pedido', imgs: ['/assets/products/onda-1.jpg', '/assets/products/onda-2.jpg', '/assets/products/onda-3.jpg'] },
  // Death Star — excepción consciente a la fórmula (22/9/2026, decisión de Martín).
  // Costo real: filamento 216 g Hyper PLA × $35.000/kg = $7.560
  //           + kit eléctrico $10.450 (portalámparas E27 $1.450, cable c/enchufe $5.500, foco LED $3.500)
  //           = $18.010.
  // Precio por fórmula: $7.560 × 5,74 = $43.394 + $10.450 × 1,4 = $14.630 → $58.024.
  // Publicado a $49.999 (≈2,78x sobre costo real). No es error de tipeo.
  {
    id: 'p23',
    name: 'Death Star',
    cat: 'Deco',
    price: 49999,
    g: 216,
    mat: 'Esfera blanca, base plata',
    desc: 'Velador esférico de 15 cm de diámetro sobre un trípode de 4 cm. Superficie con muchísimo detalle en relieve, que encendida se marca todavía más. Viene listo para enchufar: portalámparas E27, cable con enchufe y foco LED incluidos. Usar foco LED de hasta 9 W.',
    mpLink: null,
    status: 'pedido',
    imgs: [
      '/assets/products/death-star-4.jpg',
      '/assets/products/death-star-1.jpg',
      '/assets/products/death-star-2.jpg',
      '/assets/products/death-star-3.jpg',
    ],
  },
  // p15: laminado real, 136 g y $5.300 de material → $38.971/kg, calza con
  // el $40.000/kg de Silk ya confirmado antes. Precio = costo real x 5.739,
  // sin ajuste.
  { id: 'p15', name: 'Now Playing — soporte para vinilo', cat: 'Deco', price: 30400, g: 136, mat: 'Azul y violeta con brillo símil seda', desc: 'Apoyá el disco que estás escuchando en este momento, bien visible. Con un brillo símil seda que cambia según la luz.', mpLink: null, status: 'listo', imgs: ['/assets/products/now-playing-1.jpg', '/assets/products/now-playing-2.jpg', '/assets/products/now-playing-3.jpg', '/assets/products/now-playing-4.jpg'] },
  // p3: laminado real, 140 g y $5.500 de material → $39.286/kg (más alto
  // que el PLA estándar por el cambio de color cáscara/inserto). La
  // fórmula daría ~$31.564, pero el precio se ajustó a pedido a $20.000
  // (por debajo del costo×5,74) — precio fijado directo, no recalcular.
  { id: 'p3', name: 'Maceta Autorregante', cat: 'Deco', price: 20000, g: 140, mat: 'Dos colores a elección', desc: 'Reserva de agua propia en la base y orificios de drenaje calibrados: regás menos seguido y la planta no se ahoga. Cáscara exterior texturada + inserto interior extraíble para limpiar fácil. Elegís los colores de cáscara e inserto a tu gusto.', mpLink: null, status: 'listo', imgs: ['/assets/products/maceta-autorregante-1.jpg', '/assets/products/maceta-autorregante-2.jpg', '/assets/products/maceta-autorregante-3.jpg', '/assets/products/maceta-autorregante-4.jpg'] },
  // Básquet de mesa — precio por fórmula (22/9/2026).
  // Costo: 52 g Hyper PLA × $35.000/kg = $1.820 (impreso por color en dos
  // placas, sin purga) → × 5,74 = $10.447 → $10.500.
  {
    id: 'p24',
    name: 'Básquet de mesa',
    cat: 'Juguetes',
    price: 10500,
    g: 52,
    mat: 'Negro y naranja',
    desc: 'Apretás la palanca y la pelotita sale volando al aro. Mide 15 cm de alto, 8 de ancho y 9 de profundidad, entra en cualquier escritorio. Para desafiar a quien tengas al lado.',
    mpLink: null,
    status: 'pedido',
    imgs: [
      '/assets/products/basquet-de-mesa-1.jpg',
      '/assets/products/basquet-de-mesa-2.jpg',
      '/assets/products/basquet-de-mesa-3.jpg',
      '/assets/products/basquet-de-mesa-4.jpg',
    ],
    video: '/assets/products/basquet-de-mesa.mp4',
    videoPoster: '/assets/products/basquet-de-mesa-video-poster.jpg',
  },
  // p5: suma ~$1.000 de LED + pila CR2032 antes del markup. Si lo recalculás
  // solo desde g te va a dar $14.800 y estarías regalando los componentes.
  { id: 'p5', name: 'Porta líquido difusor de aromas', cat: 'Deco', price: 15000, g: 107, mat: 'Precio por unidad · terminación mate', desc: 'Set de dos piezas con arcos apilados: una para varillas de difusor, otra como florero. Se venden por unidad, $15.000 cada una — combinalas o llevate la que necesites.', mpLink: null, status: 'pedido', imgs: ['/assets/products/porta-liquido-1.jpg'] },
  // p13: laminado real, 122 g y $2.800 de material → $22.951/kg, que confirma
  // otra vez el costo de $23.000/kg. El precio sale de la fórmula, sin ajuste.
  { id: 'p13', name: 'Soporte elevador de smartphone con stand para auriculares', cat: 'Regalos', price: 16100, g: 122, mat: 'Una sola pieza', desc: 'Levanta el celular a la altura justa para mirar de reojo mientras trabajás, con un espacio abajo para guardar los auriculares.', mpLink: null, status: 'pedido', imgs: ['/assets/products/soporte-elevador-1.jpg', '/assets/products/soporte-elevador-2.jpg', '/assets/products/soporte-elevador-3.jpg'] },
  // p14: laminado real, 13 g y $300 → $23.077/kg, otra confirmación del costo
  // base. La fórmula daría $1.700: acá manda el piso de $3.500.
  { id: 'p14', name: 'Ala Nocturna — anillo lector sujeta páginas', cat: 'Regalos', price: 3500, g: 13, mat: 'Negro', desc: 'Se desliza en el dedo pulgar y sostiene el libro abierto solo, sin que tengas que usar las dos manos. Para leer comiendo, en el bondi, o en la cama.', mpLink: null, status: 'pedido', imgs: ['/assets/products/ala-nocturna-1.jpg', '/assets/products/ala-nocturna-2.jpg', '/assets/products/ala-nocturna-3.jpg'] }, // piso
  // p16: laminado real, 130 g y $3.000 de material → $23.077/kg, confirma
  // otra vez el costo de $23.000/kg. Precio = costo real x 5.739, sin
  // ajuste (redondeado a la centena).
  { id: 'p16', name: 'Soporte Universal Desmontable para Notebook', cat: 'Hogar', price: 17200, g: 130, mat: 'Negro + acento a elección', desc: 'Se pliega para viajar, se arma en segundos, y el riel dentado te deja elegir el ángulo exacto. Para notebook, tablet o lo que necesites elevar del escritorio.', mpLink: null, status: 'pedido', imgs: ['/assets/products/soporte-notebook-1.jpg', '/assets/products/soporte-notebook-2.jpg', '/assets/products/soporte-notebook-3.jpg'] },
  { id: 'p18', name: 'MIXTURE', cat: 'Juguetes', price: 12000, g: 90, mat: 'Colores a elección', desc: 'Doce controles, cero motivo. MIXTURE es un combo de dos piezas pensado para jugar con las manos mientras la cabeza hace otra cosa. Perillas, slider y una traba a rosca de bonus. Colores a elección.', mpLink: null, status: 'pedido', imgs: ['/assets/products/mixture-1.jpg', '/assets/products/mixture-2.jpg'] },
  { id: 'p1', name: 'Organizador de escritorio modular', cat: 'Hogar', price: 29700, g: 225, mat: 'PLA · varios colores', desc: 'Ordená lápices, cargadores y clips en un solo módulo apilable. Se ensambla sin herramientas y se adapta al espacio que tengas en el escritorio.', mpLink: null, status: 'listo' }, // [estimado +25%]
  // p2: único con laminado real (Creality Print, 120,52 g de Soleyin, $2.772
  // de material, 4h31m). El precio sale de comparar contra talleres
  // artesanales en MercadoLibre, no de la fórmula: no lo recalcules.
  { id: 'p2', name: 'Soporte de celular ajustable', cat: 'Gadgets', price: 15800, g: 121, mat: 'PLA · negro / blanco', desc: 'Se pliega para viajar y se abre en el ángulo que necesites para mirar, tipear o hacer videollamadas. Base antideslizante, sin mecanismos que se rompan.', mpLink: null, status: 'extruyendo' },
  { id: 'p4', name: 'Portarretrato personalizado', cat: 'Regalos', price: 7900, g: 60, mat: 'PLA · texto grabado', desc: 'Un marco simple con el texto que quieras grabado — nombre, fecha, una frase. Para esa foto que ya sacaste pero nunca imprimiste.', mpLink: null, status: 'extruyendo' },
  { id: 'p6', name: 'Rompecabezas de píxeles personalizado', cat: 'Juguetes', price: 9200, g: 70, mat: 'PLA · no tóxico', desc: 'Elegís la imagen, la convertimos en piezas para armar. Entretiene más de una tarde y queda de recuerdo.', mpLink: null, status: 'listo' },
  { id: 'p7', name: 'Gancho organizador de cables x6', cat: 'Hogar', price: 5000, g: 38, mat: 'TPU · flexible', desc: 'Seis clips flexibles para que los cables del escritorio dejen de ser un nudo. Se pegan o atornillan, como prefieras.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p8', name: 'Llavero personalizado con nombre', cat: 'Regalos', price: 3500, g: 12, mat: 'PLA · elegís color', desc: 'Tu nombre o el de quien se lo vas a regalar, en la tipografía que elijas. Diez minutos de trabajo, un regalo que no se olvida.', mpLink: null, status: 'extruyendo' }, // [estimado +25%] · piso
  { id: 'p9', name: 'Portamate con manija', cat: 'Hogar', price: 19800, g: 150, mat: 'PETG · resistente', desc: 'Para llevar el mate a todos lados sin quemarte ni derramarlo — la manija hace toda la diferencia. PETG, resiste el uso diario.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p10', name: 'Jarrón decorativo personalizado', cat: 'Deco', price: 17200, g: 130, mat: 'PLA · varios tamaños', desc: 'Una pieza escultórica para la mesa o la estantería, en el tamaño que necesites. Cada una sale un poco distinta — es parte de la gracia.', mpLink: null, status: 'pedido' },
  { id: 'p11', name: 'Fidget articulado (pulpo/dragón)', cat: 'Juguetes', price: 13200, g: 100, mat: 'PLA · flexible articulado', desc: 'Se mueve articulación por articulación, como el animal real. Impreso en una sola pieza, sin armado ni piezas sueltas que perder.', mpLink: null, status: 'listo' }, // [estimado +25%]
  { id: 'p12', name: 'Cartel / logo para emprendimientos', cat: 'Regalos', price: 13200, g: 100, mat: 'PLA · a medida', desc: 'Tu logo o el nombre de tu local, en 3D, listo para colgar o apoyar en el mostrador. Buen regalo para quien recién arranca un negocio.', mpLink: null, status: 'pedido' },
];

// Un producto muestra precio final solo si ya tiene foto real cargada
// (imgs con al menos un elemento). Sin eso el precio es una estimación
// interna (ver PRICING.md) y no debe salir como si fuera definitivo.
export function hasConfirmedPrice(p: Product): boolean {
  return Array.isArray(p.imgs) && p.imgs.length > 0;
}

// Lo que el sitio muestra: solo productos con foto real. PRODUCTS queda
// intacto como fuente de datos (los sin foto siguen ahí, listos para volver
// apenas se les cargue imgs). Todo lo que se pinta o se cuenta en el sitio
// (grilla, filtros, modal/deep-link, hero, SEO, páginas de share) sale de acá.
export const VISIBLE_PRODUCTS: Product[] = PRODUCTS.filter((p) => (p.imgs?.length ?? 0) > 0);
