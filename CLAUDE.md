# CLAUDE.md — STICKOS 3D

> Este archivo lo lee Claude Code automáticamente al arrancar en este repo.
> No hace falta pegarlo en el prompt — es memoria persistente del proyecto.
> Actualizarlo cuando cambie algo estructural (schema, fórmula de precios,
> convenciones). Es un documento vivo, no un snapshot fijo.

---

## 0. Cómo trabaja Martín (leer esto primero)

- **Comunicación directa, sin vueltas.** No hace falta explicar de más ni
  suavizar. Si algo está mal, decirlo directo con la razón.
- **Prefiere que le marquen los errores, no que le sigan la corriente.**
  Si un pedido tiene un problema (rompe el schema, contradice una decisión
  anterior, tiene un typo, el precio no cierra con la fórmula), decirlo
  ANTES de ejecutar el cambio, no después.
- **Rechaza el lenguaje de marketing genérico.** Prefiere copy concreto y
  específico por sobre lo que "suena lindo". Ejemplo real: "Sin filtros de
  mentira" fue rechazado, "algún print que salió mal" fue aprobado.
- **Toma las decisiones de negocio él, no Claude Code.** Cuando algo es una
  decisión de precio, naming o alcance (no un detalle técnico de
  implementación), preguntar antes de aplicar — no asumir.
- **Un cambio por commit, cuando sea razonable.** Si hay dos cambios
  independientes pedidos en el mismo mensaje (ej: agregar un producto +
  reordenar la grilla), preferir separarlos en dos commits para poder
  aislar un problema si algo rompe.
- **Flujo de trabajo real:** Martín charla estrategia/diseño/copy con Claude
  (chat, no Code) → ese chat le arma un prompt listo para pegar → lo pega acá
  en Claude Code → Claude Code ejecuta y commitea → Martín confirma que
  quedó bien en el sitio en vivo.

---

## 1. Qué es este proyecto

STICKOS 3D — impresión 3D a pedido, Bahía Blanca, Argentina. Martín es el
único operador (diseño, impresión, atención al cliente). Venta por
Instagram (@stickos3de), sitio (stickos3d.com.ar) y Mercado Pago.

**Posicionamiento core:** "sin stock, todo a pedido/a medida". Nunca se
enmarca como limitación de capacidad — es una elección de personalización.

**Regla de marca no negociable:** nunca mencionar ni insinuar en ningún
texto (código, copy, commits, comentarios) que STICKOS 3D tiene una sola
impresora o capacidad limitada.

---

## 2. Stack técnico

- **Sitio:** `index.html` single-file, sin frameworks ni build step.
- **Hosting:** GitHub Pages, dominio `stickos3d.com.ar` (DNS/email por
  Cloudflare).
- **Email:** `hola@stickos3d.com.ar` vía Zoho.
- **Formulario de contacto:** Formspree. Ojo: la respuesta exitosa es
  `{ok:true}`, NO `{success:true}` — si algo del form falla, revisar esto
  primero. (Se migró desde Web3Forms por fallas de entrega silenciosas:
  devolvía `success:true` pero no entregaba el mail.)
- **Autoresponder:** EmailJS.
- **Meta Pixel:** ID `4544907869062174`.
- **Pagos:** Mercado Pago (link de pago por producto, campo `mpLink`).

---

## 3. Identidad visual

- **Tipografías:** Space Grotesk (display/wordmark), Inter (body/descripciones
  largas), IBM Plex Mono (specs técnicas, precios, contacto).
- **Paleta:**
  - `INK` `#14120F`
  - `PAPER` `#F4EFE4`
  - `ORANGE` `#FF5A1F`
  - `TEAL` `#0AAFA0`
  - `WARM_GREY` `#8C8579`
  - `SOFT_GREY` `#C9C2B4`
- **Regla de fondo por tipo de pieza:**
  - Producto (fotos de catálogo) → fondo INK oscuro + tratamiento layer-band,
    **excepto ONDA y KETIL**, que van con foto limpia porque el detalle
    (plisado/acanalado) necesita verse sin textura superpuesta.
  - Marca/institucional → fondo PAPER + wedge ink + hachure.
- **Wordmark:** "STICKOS" en ink/paper + "3D" en orange, con split-shift
  (mitad inferior corrida ~0.108em a la derecha) cuando se hace en CSS.

---

## 4. Schema del array `PRODUCTS` (en `index.html`)

```js
{
  id:      "pN",         // string, correlativo. Ver "próximo id libre" abajo.
  name:    "NOMBRE",      // string
  cat:     "Categoría",   // ver categorías en uso, sección 5. No crear
                           // categoría nueva por un solo producto.
  price:   12345,         // ENTERO PLANO, sin puntos ni comas ni decimales.
                           // Ej: 78000 (nunca "78.000" ni "78000.00")
  g:       150,           // gramos, entero
  mat:     "PLA · detalle corto",   // material + variante, texto libre corto
  desc:    "Descripción...",         // texto libre. Acá van medidas,
                                       // personalización, specs — NO existe
                                       // campo "dims" ni "personalizable",
                                       // se redactan como oración suelta
                                       // dentro de desc (ver ONDA/MIXTURE
                                       // como referencia de tono).
  mpLink:  null,          // placeholder, no se usa activamente todavía
  status:  "listo",       // ver STOCK_STATUS, sección 6
  imgs:    ["assets/products/slug-1.jpg", "assets/products/slug-2.jpg"]
           // OMITIR este campo (o dejar imgs:[]) = el producto muestra
           // "PRÓXIMAMENTE" en vez de precio. La función hasConfirmedPrice(p)
           // chequea imgs.length > 0 — es el mecanismo real, no un flag aparte.
}
```

### Orden en la grilla
El filtro "Todos" ordena con `sort()` estable: primero los productos con
`imgs` cargadas, después los que no. Dentro de cada grupo se respeta el
orden del array. Para que un producto aparezca primero en su grupo hay que
moverlo físicamente más arriba en el array — no existe campo de prioridad.

---

## 5. Categorías en uso

`Deco`, `Gadgets`, `Regalos`, `Hogar`, `Juguetes`

No crear categorías nuevas por un solo producto. Ejemplo: KETIL y ONDA son
lámparas pero quedan en "Deco" en vez de "Iluminación", hasta que haya
volumen que lo justifique.

---

## 6. `STOCK_STATUS` (valores válidos para el campo `status`)

```js
extruyendo: "Extruyendo ahora"         (badge naranja)
listo:      "Listo para retirar"       (badge teal)
pedido:     "Bajo pedido — 3 a 5 días" (badge gris)
```

---

## 7. Fórmula de precios

```
costo real de slicer (confirmado, no estimado) × 5.74 = precio de venta
Piso mínimo: $3.500
```

- Preferir siempre el costo **real confirmado por slicer** sobre el cálculo
  ingenuo por peso — el slicer incluye purga de multicolor, soporte, etc.
  Ejemplo real: Maceta Autorregante, 140g, cálculo por peso daba ~$18.500
  pero el costo real de slicer (con purga de 2 colores) era $5.500 →
  precio correcto $31.500. Se bajó después a $20.000 por decisión de
  negocio (margen ~3.6x en vez de 5.74x) — excepción consciente,
  documentada, no error.
- **Costo de filamento (actualizado agosto 2026):**
  - PLA común: $30.000/kg
  - Especiales (silk, mate, madera, etc.): $39.000/kg
  - **Los precios ya publicados en el catálogo NO se recalculan
    retroactivamente** con el costo nuevo — aplica solo a piezas nuevas de
    acá en adelante. Repricear algo viejo es decisión explícita de Martín,
    nunca automática.
- Gramaje sin confirmar por slicer real → aplicar +25% de buffer de
  seguridad (aprendizaje real: el phone stand se estimó en 60g y salió 121g).
- Productos sin `imgs` cargadas muestran "PRÓXIMAMENTE" — no se les asigna
  precio público hasta tener foto real confirmada.
- **Si un precio pedido no cierra con la fórmula (costo × 5.74), decirlo
  antes de escribirlo** — puede ser una excepción consciente (como la
  maceta) o un error de tipeo. No asumir.

---

## 8. Convención de nombres de archivos de imágenes

`assets/products/{slug-del-producto}-{n}.jpg`, empezando en 1. Ejemplo:
`ketil-1.jpg`, `ketil-2.jpg`, `ketil-3.jpg`. Slug en minúsculas, sin tildes
ni espacios (guion medio como separador).

---

## 9. Reglas de copy

- Rechaza lenguaje de marketing genérico o "que suena lindo" sin ser
  concreto.
- Nombres de producto: cortos, sonoros, sin significado literal obvio
  (ONDA, MIXTURE, KETIL, FUELLE). No nombres descriptivos tipo catálogo
  escandinavo genérico, tampoco slang de barrio forzado (se probó y se
  descartó explícitamente).
- Nunca prometer mecánicas de interacción que no existen en la plataforma
  donde se publica (ej: "Deslizá para escribirnos" solo vale con sticker de
  link en Instagram Stories; en WhatsApp Status no existe ese gesto).
- Cuidado con claims de exclusividad no literales. "Pieza única" implica
  que no se puede reimprimir — si se puede, usar "edición limitada" u otro
  término que no comprometa.

---

## 10. Catálogo actual (snapshot — verificar contra el array real antes de
asumir que está actualizado; esta tabla puede desactualizarse)

| id | Nombre | Categoría | Precio | Status |
|---|---|---|---|---|
| p1 | Organizador de escritorio modular | Hogar | $29.700 | listo |
| p2 | Soporte de celular ajustable | Gadgets | $15.800 | (pasado a PRÓXIMAMENTE) |
| p3 | Maceta Autorregante | Deco | $20.000 | listo |
| p4 | Portarretrato personalizado | Regalos | $7.900 | extruyendo |
| p5 | Lámpara de luna (con luz LED) | Deco | $20.500 | pedido |
| p6 | Rompecabezas de píxeles personalizado | Juguetes | $9.200 | listo |
| p7 | Gancho organizador de cables x6 | Hogar | $5.000 | listo |
| p8 | Llavero personalizado con nombre | Regalos | $3.500 | extruyendo |
| p9 | Portamate con manija | Hogar | $19.800 | listo |
| p10 | Jarrón decorativo personalizado | Deco | $17.200 | pedido |
| p11 | Fidget articulado (pulpo/dragón) | Juguetes | $13.200 | listo |
| p12 | Cartel / logo para emprendimientos | Regalos | $13.200 | pedido |
| p13 | Soporte elevador de smartphone con stand para auriculares | Regalos | $16.100 | pedido |
| p14 | Ala Nocturna — anillo lector sujeta páginas | Regalos | $3.500 | pedido |
| p15 | Now Playing — soporte para vinilo | Deco | $30.400 | listo |
| p16 | Soporte Universal Desmontable para Notebook | Hogar | $17.200 | pedido |
| p17 | ONDA (lámpara) | Deco | $44.999 | pedido |
| p18 | MIXTURE | Juguetes | $12.000 | pedido |
| p19 | KETIL (lámpara) | Deco | $48.200 | listo |
| p20 | FUELLE (lámpara) | Deco | $78.000 | pedido |

**Próximo id libre: p21**

---

## 11. Aprendizajes técnicos varios

- **Video HDR del iPhone:** los .mov vienen en HLG/bt2020
  (`color_transfer=arib-std-b67`). Tonemapear a SDR/bt709 antes de exportar
  a H.264 o Instagram lo muestra lavado. Pipeline: `zscale`+`tonemap=hable`
  en ffmpeg.
- **Composición de fotos de producto sobre fondos sintéticos** (rembg + PIL)
  da resultados mediocres — probado y rechazado por Martín. Para fotos hero
  reales, usar Photoshop/Firefly (Generative Fill) da resultados muy
  superiores.
- **PDF de fichas de producto:** reportlab (Canvas), no HTML-to-PDF.

---

## 12. Errores ya cometidos (no repetir)

- Web3Forms devolvía `success:true` pero no entregaba 0 de 7 emails —
  migrado a Formspree. Si el form falla silenciosamente, sospechar del
  proveedor antes que del código.
- Cuenta de Instagram vieja `@stickos3d` quedó inaccesible — la cuenta
  activa es `@stickos3de` (con "e" al final). Verificar cuál está hardcoded
  antes de asumir.
