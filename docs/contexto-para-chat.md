# STICKOS 3D — contexto para charlas de estrategia, diseño y copy

> **Para qué es este archivo.** Pegalo en un Proyecto de claude.ai para
> charlar estrategia, diseño, marketing o copy. NO es documentación técnica:
> el detalle de código, build y deploy vive en `CLAUDE.md` en la raíz del
> repo, y lo lee Claude Code solo.
>
> Actualizado: 19/08/2026.

---

## El negocio

Impresión 3D a pedido en **Bahía Blanca, Argentina**. Martín es el único
operador: diseña, imprime y atiende. Vende por Instagram (**@stickos3de**),
por el sitio (**stickos3d.com.ar**) y cobra por Mercado Pago.

**Posicionamiento:** "sin stock, todo a pedido / a medida". Nunca se enmarca
como limitación de capacidad — es una elección de personalización.

**Regla de marca no negociable:** nunca mencionar ni insinuar, en ningún
texto, que STICKOS 3D tiene una sola impresora o capacidad limitada.

---

## Cómo trabaja Martín (leer esto primero)

- **Comunicación directa, sin vueltas.** No hace falta suavizar ni explicar
  de más. Si algo está mal, decirlo con la razón.
- **Prefiere que le marquen los errores, no que le sigan la corriente.** Si
  un pedido tiene un problema (contradice una decisión anterior, el precio
  no cierra con la fórmula, promete algo que no existe), decirlo **antes**
  de ejecutarlo, no después.
- **Rechaza el lenguaje de marketing genérico.** Prefiere copy concreto y
  específico por sobre lo que "suena lindo". Ejemplo real: "Sin filtros de
  mentira" fue rechazado; "algún print que salió mal" fue aprobado.
- **Las decisiones de negocio las toma él**, no la IA. Precio, naming y
  alcance se preguntan, no se asumen.

**El flujo real:** Martín charla estrategia/diseño/copy en chat → esa charla
le arma **un prompt listo para pegar** → lo pega en Claude Code → Code
ejecuta, commitea y abre PR → Martín confirma en el sitio en vivo.

Este contexto es para el **primer paso**. El entregable de una conversación
así suele ser un prompt bien armado para Claude Code, no código.

---

## Identidad de marca

**Tipografías:** Space Grotesk (display y wordmark), Inter (texto corrido),
IBM Plex Mono (specs técnicas, precios, datos).

**Paleta — no se toca:**

| Token | Hex |
|---|---|
| INK | `#14120F` |
| PAPER | `#F4EFE4` |
| ORANGE | `#FF5A1F` |
| TEAL | `#0AAFA0` |
| WARM_GREY | `#8C8579` |
| SOFT_GREY | `#C9C2B4` |

**Wordmark:** "STICKOS" en ink/paper + "3D" en naranja, con la mitad
superior corrida a la derecha (efecto de capa desplazada, como cuando la
impresora pierde pasos).

**Dirección visual (desde el 19/08/2026): Ruta A "Taller", templada.**
La web se comporta como una máquina que opera a la vista: tipografía mono,
reglas finas, información densa, retícula de plano técnico de fondo, y la
cola de impresión real visible. "Templada" quiere decir que se le dejó un
rastro cálido y aire entre secciones para que no lea helada — alguien que
entra a comprar un regalo no tiene que sentir que se metió en un panel
industrial.

Se eligió entre tres rutas presentadas como mockups: **A · Taller** (la
elegida), **B · Galería** (fondo claro, foto enorme) y **C · Editorial**
(revista).

**Esquina recta en todo el sitio.** Es regla de marca, no gusto: la pieza
impresa tiene aristas. Únicas excepciones: el borde superior de los paneles
que suben desde abajo en mobile.

---

## Reglas de copy

- Nada de marketing genérico o "que suena lindo" sin ser concreto.
- **Nombres de producto:** cortos, sonoros, sin significado literal obvio
  (ONDA, MIXTURE, KETIL, FUELLE). No nombres descriptivos tipo catálogo
  escandinavo genérico, tampoco slang de barrio forzado (se probó y se
  descartó).
- **Nunca prometer mecánicas que no existen en la plataforma donde se
  publica.** Ejemplo: "deslizá para escribirnos" solo vale con sticker de
  link en Instagram Stories; en WhatsApp Status ese gesto no existe.
- **Cuidado con los claims de exclusividad.** "Pieza única" implica que no
  se puede reimprimir. Si se puede, usar "edición limitada" u otro término
  que no comprometa.
- **Nunca inventar testimonios ni reseñas.** Es publicidad engañosa.

---

## Fórmula de precios

```
costo real de slicer (confirmado, no estimado) × 5.74 = precio de venta
Piso mínimo: $3.500
```

- Preferir siempre el **costo real confirmado por slicer** sobre el cálculo
  por peso: el slicer incluye purga de multicolor, soporte, etc. Caso real:
  la maceta autorregante daba ~$18.500 por peso, pero el costo real con
  purga de 2 colores llevaba el precio a $31.500.
- **Costo de filamento (agosto 2026):** PLA común $30.000/kg; especiales
  (silk, mate, madera) $39.000/kg.
- **Los precios ya publicados NO se recalculan retroactivamente** cuando
  sube el costo. Aplica solo a piezas nuevas. Repricear algo viejo es
  decisión explícita de Martín.
- Si un gramaje no está confirmado por slicer real, aplicar **+25% de
  buffer** (aprendizaje real: un soporte se estimó en 60g y salió 121g).
- **Si un precio pedido no cierra con la fórmula, decirlo antes de
  aplicarlo** — puede ser una excepción consciente o un error de tipeo.

---

## Catálogo actual (20 productos)

Categorías en uso: **Deco, Gadgets, Regalos, Hogar, Juguetes**. No crear una
categoría nueva por un solo producto (KETIL y ONDA son lámparas pero van en
Deco, no en "Iluminación", hasta que haya volumen que lo justifique).

Estados posibles: *Extruyendo ahora* / *Listo para retirar* / *Bajo pedido
(3-5 días)*.

Un producto sin foto real cargada muestra **PRÓXIMAMENTE** en vez de precio.

| N° | Producto | Categoría | Precio | Peso | Estado |
|---|---|---|---|---|---|
| 17 | ONDA | Deco | $44.999 | 185 g | Bajo pedido (3-5 días) |
| 19 | KETIL | Deco | $48.200 | 365 g | Listo para retirar |
| 1 | Organizador de escritorio modular | Hogar | PRÓXIMAMENTE | 225 g | Listo para retirar |
| 2 | Soporte de celular ajustable | Gadgets | PRÓXIMAMENTE | 121 g | Extruyendo ahora |
| 3 | Maceta Autorregante | Deco | $20.000 | 140 g | Listo para retirar |
| 4 | Portarretrato personalizado | Regalos | PRÓXIMAMENTE | 60 g | Extruyendo ahora |
| 5 | Porta líquido difusor de aromas | Deco | $15.000 | 107 g | Bajo pedido (3-5 días) |
| 6 | Rompecabezas de píxeles personalizado | Juguetes | PRÓXIMAMENTE | 70 g | Listo para retirar |
| 7 | Gancho organizador de cables x6 | Hogar | PRÓXIMAMENTE | 38 g | Listo para retirar |
| 8 | Llavero personalizado con nombre | Regalos | PRÓXIMAMENTE | 12 g | Extruyendo ahora |
| 9 | Portamate con manija | Hogar | PRÓXIMAMENTE | 150 g | Listo para retirar |
| 10 | Jarrón decorativo personalizado | Deco | PRÓXIMAMENTE | 130 g | Bajo pedido (3-5 días) |
| 11 | Fidget articulado (pulpo/dragón) | Juguetes | PRÓXIMAMENTE | 100 g | Listo para retirar |
| 12 | Cartel / logo para emprendimientos | Regalos | PRÓXIMAMENTE | 100 g | Bajo pedido (3-5 días) |
| 13 | Soporte elevador de smartphone con stand para auriculares | Regalos | $16.100 | 122 g | Bajo pedido (3-5 días) |
| 14 | Ala Nocturna — anillo lector sujeta páginas | Regalos | $3.500 | 13 g | Bajo pedido (3-5 días) |
| 15 | Now Playing — soporte para vinilo | Deco | $30.400 | 136 g | Listo para retirar |
| 16 | Soporte Universal Desmontable para Notebook | Hogar | $17.200 | 130 g | Bajo pedido (3-5 días) |
| 18 | MIXTURE | Juguetes | $12.000 | 90 g | Bajo pedido (3-5 días) |
| 20 | FUELLE | Deco | $78.000 | 328 g | Bajo pedido (3-5 días) |

---

## Qué está abierto, por impacto real

1. **Fotografía de producto.** Es el techo real del sitio, no el diseño: hoy
   las fotos no comparten fondo, luz ni encuadre entre sí. Martín va a armar
   un photo booth. Recomendado: **fondo gris medio neutro o negro mate, no
   blanco puro** (el sitio va sobre INK; los fondos blancos quedan como
   rectángulos brillantes que pelean con todo), alto útil de 70-80cm (la
   pieza más grande es KETIL, 270mm), y sobre todo **repetir siempre el
   mismo setup**: misma distancia, altura de cámara y encuadre.
2. **Reseñas / prueba social.** El sitio no tiene ninguna. Hacen falta 3-5
   reales (capturas de Instagram o WhatsApp) antes de construir la sección.
3. **Catálogo tabular en desktop.** Era parte del mockup de la Ruta A y
   quedó sin construir: se hizo con cards porque una tabla no funciona en
   mobile, y la mayor parte del tráfico llega de Instagram.
4. **Preview con foto al compartir por WhatsApp.** Sin resolver y parqueado
   por decisión de Martín.
5. **Google Analytics 4** y **captura de emails / newsletter.** Propuestos,
   no priorizados. No fueron rechazados.

---

## Errores ya cometidos (no repetir)

- La cuenta vieja de Instagram `@stickos3d` quedó inaccesible. **La activa
  es `@stickos3de`**, con "e" al final.
- Componer fotos de producto sobre fondos sintéticos por software da
  resultados mediocres — probado y rechazado por Martín. Para fotos hero
  reales conviene Photoshop / Firefly.
