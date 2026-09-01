# STICKOS 3D — Sitio web

Vite + React + TypeScript, deployado a GitHub Pages vía GitHub Actions.

> Este proyecto era antes un único `index.html` sin build ni dependencias.
> Se migró a Vite + React para poder testear la lógica de negocio (cotizador,
> carrito) y reusar componentes, alineado con el resto del stack. La UI y el
> contenido son exactamente los mismos — mismos textos, precios, colores,
> animaciones e integraciones (WhatsApp, Mercado Pago, Meta Pixel, Formspree,
> EmailJS).

## Desarrollo local

```bash
npm install
npm run dev        # dev server con hot reload en http://localhost:5173
npm test           # tests de la lógica de negocio (cotizador, carrito)
npm run build      # build de producción a dist/
npm run preview    # sirve dist/ localmente para verificar el build
npm run lint       # eslint
```

## Deploy

`.github/workflows/deploy.yml` builda y publica `dist/` a GitHub Pages en
cada push a `main`.

**Paso manual único, una sola vez:** en el repo de GitHub, ir a
**Settings → Pages → Source** y cambiar de "Deploy from a branch" a
**"GitHub Actions"**. Antes el sitio se servía directo desde la rama; ahora
lo sirve el artifact que sube el workflow.

El dominio propio (`CNAME`) sigue funcionando igual — vive en `public/CNAME`
y Vite lo copia a `dist/` en cada build.

## Configurar sus datos

Abrí `src/data/config.ts`:

```ts
export const CONFIG = {
  whatsapp: "5492915164996",   // ← número con código de país, sin + ni espacios
  instagram: "stickos3de",
  email: "hola@stickos3d.com.ar"
};
```

## Agregar / editar productos

En `src/data/products.ts`, mismo formato que antes:

```ts
{ id:"p13", name:"Nombre del producto", cat:"Hogar", price:9900, g:75, mat:"PLA · negro", desc:"...", mpLink:null, status:"listo" },
```

- `id`: único, no repetir.
- `cat`: si usás una categoría nueva, el filtro se crea solo.
- `price`: en pesos, sin puntos. Ver `PRICING.md` para cómo se calcula.
- `mpLink`: link de pago de Mercado Pago del producto, o `null` (se compra vía carrito + WhatsApp).
- `imgs`: array de hasta 4 rutas en `public/assets/products/`, con `/` inicial (ej. `/assets/products/foto.jpg`). Sin `imgs`, el producto muestra "PRÓXIMAMENTE" en vez de precio — es intencional (ver `hasConfirmedPrice` en `src/data/products.ts`).

## Agregar fotos reales

1. Poné las fotos en `public/assets/products/` (ideal: cuadradas o 4:3, fondo limpio, ~800px).
2. Agregale al producto el campo `imgs:["/assets/products/nombre-foto.jpg"]` en `src/data/products.ts`.

## Colores de filamento

`src/data/config.ts` → `COLORS`. Se usan en las cards del catálogo, el
carrito y el modal de producto.

## Cola de impresión ("El taller, en vivo")

`src/data/config.ts` → `PRINT_QUEUE`. Actualizar a mano cuando cambien de
trabajo. `progress: 0` = en cola, sin barra.

## Cómo funciona la venta

- **Carrito → WhatsApp**: el cliente arma el pedido y les llega el detalle
  completo con total. Ustedes confirman y mandan link de MP o CBU.
- **Link de pago directo**: productos con `mpLink` tienen compra inmediata.
- **A pedido**: el formulario cotizador arma solo el mensaje de cotización.

Nota: el carrito vive en memoria de React (si el cliente recarga la página,
se vacía) — mismo comportamiento que el sitio estático original.

## Estructura

```
src/
  data/       CONFIG, COLORS, PRODUCTS, cola de impresión, precios del cotizador
  lib/        funciones puras: fmt/wa/waWeb, computeQuote, EmailJS
  hooks/      preloader, reveal on scroll, sonido, menú, modal IG
  context/    carrito, toast, sonido (compartidos entre componentes)
  components/ una sección/pieza de UI por archivo
tests van junto al código que testean (*.test.ts)
```
