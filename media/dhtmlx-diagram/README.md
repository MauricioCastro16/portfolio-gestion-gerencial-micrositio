# DHTMLX Diagram (archivos del componente)

Este micrositio carga **DHTMLX JavaScript Diagram** en el navegador para las vistas de mapa conceptual.

1. Descargá el paquete desde [DHTMLX Diagram](https://dhtmlx.com/docs/products/dhtmlxDiagram/download.shtml) (trial o licencia).
2. Copiá desde la carpeta `codebase/` del ZIP al menos uno de cada par:
   - `diagram.js` o `diagram.min.js`
   - `diagram.css` o `diagram.min.css`
3. Pegalos **aquí** (`media/dhtmlx-diagram/`).

Con Vite, `publicDir` apunta a `../media`, así que se sirven como `/dhtmlx-diagram/...`.

**Si no copiás estos archivos**, el mapa conceptual igual se muestra como **vista previa en SVG** (mismos datos que en `src/mapaConceptual/*.ts`). El visor DHTMLX completo es opcional.
