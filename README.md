# STICKOS 3D — Sitio web

Sitio de una sola página, sin frameworks ni dependencias. Un solo archivo (`index.html`), hosting gratis en GitHub Pages.

## Publicar en GitHub Pages (5 minutos)

1. Creá un repositorio nuevo en GitHub (ej: `stickos3d`).
2. Subí `index.html` a la raíz del repo.
3. En el repo: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. En 1-2 minutos el sitio queda en `https://TU-USUARIO.github.io/stickos3d/`.

Para dominio propio (ej: `stickos3d.com.ar`), se compra el dominio en NIC.ar (~gratis siendo .com.ar) y se configura en Settings → Pages → Custom domain.

## Configurar sus datos (obligatorio antes de publicar)

Abrí `index.html` y buscá el bloque `CONFIG` (está al inicio del `<script>`):

```js
const CONFIG = {
  whatsapp: "5492910000000",   // ← su número: 54 9 + código de área + número, sin espacios
  instagram: "stickos3d",
  email: "hola@stickos3d.com.ar"
};
```

## Agregar / editar productos

En el mismo archivo, bloque `PRODUCTS`. Cada producto es una línea:

```js
{ id:"p13", name:"Nombre del producto", cat:"Hogar", price:9900, mat:"PLA · negro", mpLink:null },
```

- `id`: único, no repetir.
- `cat`: si usás una categoría nueva, el filtro se crea solo.
- `price`: en pesos, sin puntos.
- `mpLink`: pegá acá el **link de pago de Mercado Pago** del producto (se crea gratis desde la app de MP → "Cobrar" → "Link de pago"). Si está, aparece el botón "Comprar ya". Si es `null`, se compra vía carrito + WhatsApp.

## Agregar fotos reales (cuando las tengan)

1. Creá una carpeta `img/` en el repo y subí las fotos (ideal: cuadradas o 4:3, fondo limpio, ~800px).
2. Agregale al producto el campo `img:"img/nombre-foto.jpg"`.
3. En la función `renderProducts()`, reemplazá la línea del tile por:

```js
<div class="tile">${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;position:relative">` : `<span>${p.name.charAt(0)}</span>`}</div>
```

## Cómo funciona la venta

- **Carrito → WhatsApp**: el cliente arma el pedido y les llega el detalle completo con total. Ustedes confirman y mandan link de MP o CBU.
- **Link de pago directo**: productos con `mpLink` tienen compra inmediata.
- **A pedido**: el formulario arma solo el mensaje de cotización.

Nota: el carrito vive en la sesión del navegador (si el cliente recarga la página, se vacía). Para esta escala es el comportamiento estándar de sitios estáticos.
