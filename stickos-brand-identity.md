# STICKOS 3D — Identidad de marca

## 1. La idea central

**"Toolpath Identity": mostrar el proceso, no esconderlo.**

Casi todo el e-commerce de impresión 3D en Argentina copia la estética de una tienda genérica (Tiendanube con fotos de producto sobre fondo blanco) y trata de que el producto "parezca inyectado", como si se avergonzara de ser impreso. Es al revés de lo que hace fuerte a STICKOS: es un taller familiar, de producción real, capa por capa, a la vista.

La identidad completa se construye sobre el proceso físico de imprimir: líneas de capa, trayectoria de la boquilla (toolpath), infill, cola de impresión, porcentajes. Esto no es decoración — es el único lenguaje visual que ningún competidor genérico puede copiar de forma creíble, porque no lo fabrican así.

**Posicionamiento en una frase:** *Vemos lo que otros esconden.*

## 2. Personalidad

Técnico-cálido. Preciso como una máquina, cercano como un taller de familia.

- Directo, sin relleno corporativo ("calidad premium", "los mejores productos del mercado" → afuera).
- Con humor de fierro, medido, nunca forzado.
- Orgulloso del proceso: specs reales, tiempos reales, fallas reales cuando las hay.
- Cercano pero no infantil — es una marca que un adulto que compra piezas técnicas toma en serio.

## 3. Paleta de colores

| Uso | Nombre | Hex | Rol |
|---|---|---|---|
| Fondo oscuro | Ink | `#14120F` | Base — negro cálido, no negro puro |
| Fondo claro | Paper | `#F4EFE4` | Base — blanco cartón/papel de taller |
| Acento primario | Signal Orange | `#FF5A1F` | CTAs, precios, estados activos — el color de la boquilla caliente |
| Acento secundario | Layer Teal | `#0AAFA0` | Contraste frío, links, detalles técnicos |
| Neutro texto | Warm Grey | `#8C8579` | Texto secundario sobre Paper |
| Divisor | Soft Grey | `#C9C2B4` | Líneas, bordes, separadores |

Regla: **el color de filamento elegido por el usuario en cada producto es también un acento de marca** — ya existe ese sistema en `COLORS`. La UI debe dejarle protagonismo: cuando alguien elige "azul PETG" en un producto, ese azul puede filtrarse sutilmente al borde de la card. La marca literalmente cambia de color con el producto — nadie más puede hacer eso.

## 4. Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display / títulos | **Space Grotesk** (700–800) | Headlines, precios grandes — geométrica, técnica, con carácter |
| Cuerpo | **Inter** (400–600) | Texto de lectura, descripciones |
| Técnico / mono | **IBM Plex Mono** (400–500) | Specs, badges de estado, "terminal", precios en tablas, todo lo que suene a dato de máquina |

Las tres son gratuitas en Google Fonts, sin licencias que gestionar.

## 5. Logo y marca gráfica

**Wordmark:** "STICKOS" en Space Grotesk 800, con una regla horizontal fina (línea de capa) atravesando el tercio inferior de las letras — sugiere que el texto también fue "impreso".

**Isotipo:** una "S" trazada como un único trayecto continuo (toolpath), sin levantar la línea — igual que hace una impresora FDM. Sirve como favicon, marca de agua y elemento decorativo suelto.

**Regla de uso:** el isotipo nunca va relleno de un color sólido plano — siempre lleva el hachurado de líneas horizontales (layer lines) o un trazo simple, nunca un bloque sólido. Eso es lo que lo distingue de cualquier logo genérico de "impresora 3D" (que suelen usar cubos isométricos gastados).

## 6. Motivos visuales (el sistema, no solo el logo)

Estos son los elementos que se repiten en toda la web y hacen que se sienta "una sola marca" y no una plantilla:

1. **Hachurado de capas** — líneas horizontales finas, opacidad baja (5–10%), de fondo en secciones oscuras. Simula la vista de capas de un slicer.
2. **Líneas de trayectoria (toolpath)** — líneas punteadas/discontinuas que conectan secciones o guían el ojo, como el recorrido de la boquilla.
3. **Badges de estado tipo máquina** — cápsulas mono con texto tipo `EN COLA`, `87% LISTO`, `SIN SOPORTE`, reutilizando la lógica que ya tiene la cola de impresión en vivo, pero llevada a toda la web (stock, envío, tiempo de producción).
4. **Marcas de calibración** — pequeños crosshairs/ticks en las esquinas de imágenes y cards, como las marcas de referencia en una cama de impresión.
5. **Grid de puntos** — fondo sutil de grilla de puntos en secciones claras, como el plato de una impresora.

Con estos cinco elementos alcanza. No hay que inventar más — la disciplina de repetirlos es lo que construye identidad, no la cantidad.

## 7. Voz y tono

- Frases cortas, información concreta antes que adjetivos.
- Jerga del oficio, usada con humor sutil: "recién salido de la cama caliente", "capa por capa", "sin soportes" (con guiño).
- Nunca vender con superlativos vacíos. Vender mostrando el proceso: tiempo de impresión real, material real, foto del print en curso.
- Tuteo, cercano, como quien atiende el local de la familia — pero sin perder precisión técnica en specs y precios.

**Ejemplos de microcopy con esta voz:**
- Botón de compra: `Agregar a la cola` (en vez de "Agregar al carrito")
- Confirmación: `Tu pedido entró en cola de impresión`
- Estado de stock: `Extruyendo ahora` / `Listo para retirar` / `Bajo pedido — 3 a 5 días`
- Footer: `Impreso en Bahía Blanca, capa por capa.`

## 8. Cómo se conecta con lo que ya está construido

Todo esto se apoya en la arquitectura de datos que ya existe (`CONFIG`, `COLORS`, `PRINT_QUEUE`, `QUOTE`, `PRODUCTS`) — no la reemplaza, la viste:

- El selector de color de filamento pasa de ser una feature funcional a ser el corazón visual de la marca (punto 3).
- La cola de impresión en vivo deja de ser una sección aislada y se convierte en el vocabulario de estado de toda la web (badges tipo máquina, punto 6.3).
- La estética "terminal" del "about" ya apuntaba en esta dirección — esta identidad la generaliza y le da reglas consistentes en vez de quedar aislada en una sola sección.
