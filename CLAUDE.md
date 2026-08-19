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
- **Todo PR se abre con suscripción a su actividad, siempre.** Confirmado
  explícitamente (19/08/2026): apenas se abre un PR, suscribirse a sus
  eventos (CI, comentarios de review) sin volver a preguntar cada vez —
  es comportamiento por defecto del proyecto, no algo a confirmar PR por
  PR.

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

- **Sitio:** Vite + React + TypeScript (migrado desde un `index.html`
  single-file el 19/08/2026 — mismo diseño/contenido, ahora componentizado
  y con tests). Ver `README.md` para el flujo de desarrollo (`npm run dev`,
  `npm test`, `npm run build`).
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) build+publica
  `dist/` a GitHub Pages en cada push a `main`. `ci.yml` corre lint+test+build
  en cada PR.
- **Hosting:** GitHub Pages, dominio `stickos3d.com.ar` (DNS/email por
  Cloudflare). Source de Pages = **GitHub Actions** (no "Deploy from a
  branch" — se cambió el 19/08/2026, ver sección 13).
- **Email:** `hola@stickos3d.com.ar` vía Zoho.
- **Formulario de contacto:** Formspree. Ojo: la respuesta exitosa es
  `{ok:true}`, NO `{success:true}` — si algo del form falla, revisar esto
  primero. (Se migró desde Web3Forms por fallas de entrega silenciosas:
  devolvía `success:true` pero no entregaba el mail.)
- **Autoresponder:** EmailJS.
- **Meta Pixel:** ID `4544907869062174`. Manda `PageView` (fijo, en
  `index.html`) + eventos de conversión reales vía `src/lib/pixel.ts`:
  `AddToCart` (agregar al carrito), `InitiateCheckout` (confirmar cola por
  WhatsApp), `Lead` (enviar cotizador), `Contact` (form de contacto + botón
  flotante de WhatsApp). Antes solo mandaba PageView — sin esto Meta no
  puede optimizar campañas por conversión real ni armar públicos de
  retargeting por intención de compra.
- **SEO estructurado:** `LocalBusiness` + `Product` por cada producto con
  precio confirmado, generado en runtime por `src/lib/seo.ts` desde
  `PRODUCTS` — no vive más como bloque estático en `index.html` (eso se
  desincronizaba: el `priceRange` quedó fijo en "$3.500 - $31.500" mucho
  después de que el máximo real subiera a $78.000).
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

## 4. Schema del array `PRODUCTS` (en `src/data/products.ts`)

```ts
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
  imgs:    ["/assets/products/slug-1.jpg", "/assets/products/slug-2.jpg"],
           // OMITIR este campo (o dejar imgs:[]) = el producto muestra
           // "PRÓXIMAMENTE" en vez de precio. La función hasConfirmedPrice(p)
           // (en el mismo archivo) chequea imgs.length > 0 — es el mecanismo
           // real, no un flag aparte. Ojo con el "/" inicial: los archivos
           // viven en public/assets/products/, Vite los sirve desde la raíz.
  video:   "/assets/products/slug.mp4"  // opcional, se suma a imgs sin
           // reemplazarlo — badge de video en la card + rotación automática
           // por hover (desktop) + slide final con sonido en el modal.
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

`public/assets/products/{slug-del-producto}-{n}.jpg`, empezando en 1
(referenciado en el código como `/assets/products/...`, con `/` inicial —
Vite sirve todo lo de `public/` desde la raíz). Ejemplo:
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
| p5 | Porta líquido difusor de aromas | Deco | $15.000 | pedido |
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
- **Un workflow de GitHub Actions recién agregado no corre en el push que lo
  agrega.** Para el evento `pull_request`, GitHub sí lee el workflow desde la
  rama del PR (no hace falta que esté en `main` primero, a pesar de lo que
  parece al principio) — pero necesita un push *posterior* a que el archivo
  ya exista en la rama para dispararse. El push que agrega `ci.yml` no
  cuenta; el siguiente sí. `workflow_dispatch` (disparo manual) sí requiere
  que el archivo esté en la rama default del repo — ahí si da 404 al
  intentar dispararlo, es señal de que el workflow todavía no llegó a `main`.
- **Al cambiar Settings → Pages → Source de "Deploy from a branch" a
  "GitHub Actions"**, el dominio propio (`stickos3d.com.ar`) puede tirar el
  404 genérico de GitHub ("There isn't a GitHub Pages site here") durante
  15-20 minutos aunque el campo "Custom domain" en Settings se vea
  configurado sin errores y el deploy haya corrido en verde — es demora de
  propagación del lado de GitHub, no un problema de DNS ni de config. La
  URL default (`usuario.github.io/repo`) sirve para confirmar que el deploy
  en sí funciona mientras se espera. Pasó una vez, se resolvió solo (con un
  redeploy manual de por medio, que puede o no haber acelerado algo).

---

## 13. Migración a Vite + React (19/08/2026)

El sitio pasó de un `index.html` single-file (2251 líneas, sin build ni
dependencias) a Vite + React + TypeScript, en PR #1
(`claude/ecc-selective-install-rj4oau` → `main`). Motivo: alinear el
proyecto con el resto del stack de Martín (JAM7, GestionComercialMCR, ambos
Vite+React+Firebase) y poder testear la lógica de negocio en vez de
confiar solo en verificación manual.

**Qué NO cambió** (a propósito): diseño, copy, precios, integraciones
(WhatsApp, Mercado Pago, Meta Pixel, Formspree, EmailJS), todas las
animaciones (preloader FDM, scroll-reveal, header flotante, sonido del
taller vía Web Audio API). El CSS se movió a `src/styles/global.css` sin
tocar una sola regla — mismos selectores que usaba el HTML/JS original.

**Qué sí cambió, estructuralmente:**
- `PRODUCTS`/`CONFIG`/`QUOTE`/`PRINT_QUEUE`: de `index.html` a
  `src/data/*.ts` (ver secciones 2 y 4 de este archivo).
- Lógica de negocio extraída como funciones puras testeables:
  `src/lib/quote.ts` (`computeQuote`), `src/context/cartReducer.ts`
  (reglas del carrito). 17 tests unitarios cubren ambas.
- Carrito, sonido, modal de Instagram: pasaron de variables globales/DOM a
  React Context (`src/context/`) — mismo comportamiento, sin `window.__x`.
- Fotos/audio/favicon/CNAME/robots.txt/sitemap.xml: de la raíz del repo a
  `public/` (Vite los sirve igual, sin reescritura de ruta salvo el `/`
  inicial en cada referencia — ver sección 8).
- CI/CD nuevo: `.github/workflows/ci.yml` (lint+test+build en cada PR) y
  `deploy.yml` (build+publica `dist/` a Pages en cada push a `main`).

**Riesgo real durante la migración, ya resuelto:** el trabajo de migrar
tardó lo suficiente como para que `main` avanzara 17 commits por separado
(4 productos nuevos, cambios de precio, la función de video+hover en las
cards). Se detectó al mergear (conflictos de archivo en `index.html` y en
`assets/products/`) y se re-portó todo a mano contra el estado más
reciente de `main` antes de mergear — no se perdió nada, pero es la razón
por la que conviene avisar antes de arrancar una migración larga si va a
haber cambios de contenido en paralelo.

**Para agregar productos/tocar precios de acá en adelante:** todo sigue
igual que antes en términos de reglas de negocio (secciones 0, 4, 7) — lo
único que cambia es que el array vive en `src/data/products.ts` en vez de
adentro de `index.html`, y hay que correr `npm run build` (o esperar el CI)
para ver el resultado, ya no alcanza con abrir el HTML directo en el
navegador. Ver `README.md` para el flujo de desarrollo completo.

---

## 14. Marketing/SEO — primera tanda (19/08/2026)

Auditoría + mejoras con sombrero de diseño/marketing, priorizadas por
impacto/esfuerzo. Implementado:

- **Eventos de conversión de Meta Pixel** (ver sección 2) — antes solo
  `PageView`. Sin esto no se puede optimizar Ads por conversión real.
- **SEO estructurado dinámico** (`Product` + `LocalBusiness`, ver sección 2)
  — habilita rich snippets con precio en Google para los 10 productos con
  foto real cargada.
- **Botón "Compartir" por WhatsApp en el modal de producto**, con deep-link
  (`?p=<id>` en la URL abre ese producto directo al cargar). Capitaliza el
  boca en boca que ya existe por WhatsApp — antes un link compartido caía
  siempre en la home, ahora cae en el producto puntual.
- `sitemap.xml` con `lastmod` actualizado.

**Pendiente, necesita contenido real de Martín (no se fabrica):**
sección de reseñas/testimonios — el sitio no tiene ninguna prueba social
todavía. Necesita 3-5 reseñas reales (capturas de Instagram/WhatsApp,
lo que haya) antes de construir esa sección — nunca inventar testimonios,
es publicidad engañosa.

**Ideas que salieron en la auditoría pero no entraron en esta tanda**
(no rechazadas por Martín, solo no priorizadas — vale la pena volver a
proponerlas): Google Analytics 4 (hoy solo hay Meta Pixel, sin visibilidad
de tráfico orgánico separado del de Ads); newsletter/email capture.

---

## 15. Refresh de UX del modal de producto (19/08/2026)

Segunda ronda de revisión de diseño (después de la tanda de marketing/SEO
de la sección 14). Martín pidió específicamente "algo para rever en tema
de diseño" con gorro de marketing/diseño web, y después confirmó hacer un
refresh 100% de UX/interacción basado en tendencias 2026 **sin tocar la
identidad de marca** — la estética "tactile/handmade" que ya tiene STICKOS
3D está validada como tendencia vigente (no hacía falta rediseñar el look,
solo la interacción).

**Cambios implementados** (`src/components/ProductModal.tsx` +
`src/styles/global.css`):

1. **Bottom sheet en mobile en vez de modal centrado.** El modal de
   producto ahora se ancla abajo (`align-items:flex-end`) con animación de
   entrada (`sheetUp`), siguiendo el patrón que en investigación de UX
   (NN/g) rinde mejor que el modal centrado tradicional en mobile — se
   siente como una extensión natural de la pantalla en vez de una
   interrupción.

2. **"A la cola" siempre visible sin scrollear.** Antes había que
   scrollear DENTRO del modal para encontrar el botón de compra — nadie lo
   descubre solo. Ahora la franja de precio + "A la cola" / "Cotizar por
   WhatsApp" queda fija abajo del sheet, y la descripción/specs scrollean
   en su propio contenedor interno angosto.

   **Bug real encontrado y corregido en el camino:** el bloque
   `.product-modal-cta` vivía anidado ADENTRO de `.product-modal-info` en
   el JSX (no como hermano), mientras el CSS (primero `position:sticky`,
   después CSS Grid con `grid-template-areas`, después flexbox) siempre
   asumió que eran hermanos dentro de `.product-modal-content`. Tres
   enfoques de CSS distintos fallaron con el mismo síntoma exacto (CTA
   solapado y empujado fuera del viewport) porque el problema nunca fue el
   CSS — era la estructura del DOM. Se resolvió moviendo
   `.product-modal-cta` a hermano de `.product-modal-info`, y ahí sí
   `display:flex;flex-direction:column` con `.product-modal-info{flex:1;
   min-height:0;overflow-y:auto}` funcionó a la primera. **Aprendizaje:**
   si varios approaches de CSS distintos fallan con números idénticos,
   sospechar de la estructura del DOM antes que seguir iterando CSS.

3. **"Compartir" bajó de jerarquía visual.** Antes era un botón de texto
   con el mismo peso que "A la cola"/"Cotizar por WhatsApp" (competía por
   atención con las acciones que facturan). Ahora es un ícono circular
   chico al lado del botón de cerrar (mismo tratamiento visual que
   `.product-modal-close`) — sigue disponible pero no compite.

4. **Placeholder del textarea del cotizador ya no se corta en mobile.**
   El placeholder de ejemplo tiene 3 líneas; con el `min-height:80px`
   genérico de todos los `textarea`, la última línea quedaba cortada.
   Se agregó `#cfDesc{min-height:108px}` solo para esa caja puntual (el
   textarea del form de contacto entra bien con el genérico, no se tocó).

**Verificado con Playwright** (mobile 390×844 y desktop 1400×900):
"A la cola" visible sin scroll en el primer render del modal, sin
solapamiento entre galería/info/cta, desktop sin cambios de layout
(sigue siendo grid centrado, no hereda el bottom sheet).

**No se tocó:** paleta, tipografías, wordmark, ninguna copy, fórmula de
precios, ni el modal en desktop (el bottom sheet es mobile-only, media
query `max-width:720px`).

---

## 16. Swipe en el modal + preview con foto al compartir (19/08/2026)

Dos pedidos puntuales de Martín después de confirmar el refresh de UX de la
sección 15.

**1. Swipe táctil en el modal de producto.** Ya existía en las cards del
catálogo (`ProductCard.tsx` — `onTouchStart`/`onTouchEnd`, umbral de 40px),
pero faltaba en el modal grande (`ProductModal.tsx`): ahí solo se podía
navegar con las flechitas `‹›`. Se agregó el mismo criterio (mismo umbral,
mismo signo de dirección) al `.tile-slider` del modal.

**2. Preview con foto real al compartir un producto por WhatsApp.** El
`og:image` de `index.html` es fijo (uno solo, genérico, para todo el
sitio) — como STICKOS 3D es una SPA sin server-side rendering, y WhatsApp
lee el HTML crudo sin ejecutar JS, compartir cualquier producto (vía
`?p=<id>`) siempre mostraba la misma imagen genérica del home, nunca la
foto real del producto.

**Solución:** `scripts/generate-share-pages.mjs`, que corre como parte de
`npm run build` (después de `vite build`, antes tenía solo `tsc --noEmit
&& vite build`) y genera una página HTML estática por cada producto con
precio confirmado: `dist/p/<id>.html`, con `og:title`/`og:description`/
`og:image` PROPIOS de ese producto (primera foto de `imgs`). Un humano que
abre el link cae ahí un instante y un `<script>` + `<meta
http-equiv="refresh">` lo mandan enseguida a `/?p=<id>` (la app real, con
el modal ya abierto) — los bots de preview (WhatsApp/Facebook/Instagram)
no ejecutan JS, así que solo leen los meta tags de esa página y arman la
tarjeta con la foto correcta. Llevan `<meta name="robots" content="noindex">`
porque son solo para bots de preview — la versión indexable de verdad para
Google sigue siendo `/?p=<id>` + los datos estructurados de `src/lib/seo.ts`
(Google sí ejecuta JS); sin el noindex, Google podría indexar estas páginas
finitas de redirect como contenido duplicado.

`productShareUrl()` (en `src/lib/format.ts`) ahora recibe el producto
completo (antes solo el `id`) y decide el link según tenga foto confirmada
o no: con foto → `/p/<id>.html` (la página de preview); sin foto (todavía
"PRÓXIMAMENTE") → el deep-link de siempre, `/?p=<id>` (no hay nada que
previsualizar, esa página estática ni se genera para esos productos).

El script bundlea `src/data/products.ts` a un `.mjs` temporal con esbuild
(ya vive en `node_modules` vía Vite, no se sumó dependencia nueva) porque
es TypeScript pero sin dependencias en tiempo de ejecución — más simple que
sumar `tsx`/`ts-node` solo para este script puntual.

**No hizo falta tocar `.github/workflows/deploy.yml`:** ya corre `npm run
build` como paso único, así que las páginas nuevas se generan y suben a
Pages sin cambios en el workflow.
