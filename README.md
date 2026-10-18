# ORZEN Energy · Mesa Comercial V1.0

Herramienta de relevamiento, precotización y preparación de fichas comerciales para **GLP a granel** y **diésel**. Uso interno e independiente de la web institucional.

## Qué funciona

- Formulario del establecimiento, sector, decisor y necesidad.
- Selector GLP de capacidad declarada: por definir, 500, 1000, 2000, 4000 o 7300 L. *No es un dimensionamiento calculado automáticamente*.
- Sección diésel con datos comerciales de consumo y modalidad de entrega.
- Conceptos económicos editables, inicialmente vacíos; totales visibles **solo cuando** hay precios completos y se confirma que fueron autorizados por el proveedor. IVA 21% opcional.
- Dos documentos imprimibles: **Ficha interna para el proveedor** y **Resumen preliminar para el cliente**. Usá «Imprimir → Guardar como PDF» en Chrome/Edge.
- Guardado de múltiples fichas en **localStorage** (solo en el navegador actual), recuperación y borrado. Exportar/importar copia de seguridad JSON.
- Posibilidad de cargar temporalmente imagen PNG/JPG/WebP de plano validado, que se incluye en la ficha del proveedor. **El adjunto no se guarda en localStorage ni se sincroniza**.
- Logo y estética ORZEN; diseño responsive. Sin base de datos, sin cuentas, sin credenciales ni cobros.

## Importante sobre los planos

Los planos ilustrativos originales de Extragas están embebidos en el monolito HTML original, y requieren una revisión de propiedad/autorización y validación por el equipo técnico antes de reutilizarse en documentos externos. Por ese motivo **no se copiaron a esta herramienta**. El esquema de la interfaz es solamente **conceptual, sin escala y sin medidas**. El usuario puede incorporar un plano que el proveedor haya autorizado expresamente para la operación.

## Precios y validez

- No se reutilizan tarifas ficticias ni materiales de demostración del proyecto anterior.
- La herramienta **no** promete tanque, precio, stock, plazos, garantías ni habilitaciones.
- El documento para cliente **no incluye importes por defecto**. Solo se pueden incluir cuando los conceptos están completos, el estado de precios se marca como confirmado y se activa expresamente la autorización de compartirlos. La cotización definitiva corresponde al proveedor habilitado.
- El IVA es solo una operación matemática opcional; su tratamiento fiscal debe confirmarse según la transacción.
- ORZEN **facilita relaciones comerciales**, no se presenta como distribuidora ni instaladora de combustible.

## Publicación en GitHub Pages sin gastar

1. Crear un **repositorio NUEVO** llamado `orzen-cotizador` (no subir a `orzen-energy`, para no reemplazar el sitio público actual).
2. Subir a la raíz `index.html`, `styles.css`, `app.js` y la carpeta `assets/`.
3. Activar **Settings → Pages → Deploy from branch → main / (root)**.
4. La app quedará en `https://AGENT-AUTHORITY.github.io/orzen-cotizador/` si se usa la cuenta AGENT-AUTHORITY, sin configuración extra de dominio.

### Seguridad y privacidad

**Advertencia:** GitHub Pages es público, incluso si el propósito del formulario es interno. No almacena datos en el servidor, pero cualquiera con la URL puede abrir el formulario; los datos rellenados se quedan localmente en ese navegador y no se comparten automáticamente. No publicar archivos JSON de clientes ni datos personales en el repositorio. Si necesitás usuarios, respaldos centrales, permisos, auditoría y documentación confidencial, requerimos un backend protegido (p. ej. Supabase con Auth y RLS) antes de escalar.

**Recomendación inicial:** abrir `index.html` localmente desde el equipo de trabajo y gestionar copias JSON protegidas, antes de desplegar la app pública. Esto evita poner formularios internos en un dominio público innecesariamente.

## Organización de archivos

```
index.html
styles.css
app.js
assets/
  logo-blanco.svg
  logo-azul.svg
  isotipo-blanco.svg
  favicon.svg
  hero-industrial.webp
```

## Prueba rápida

1. Completá empresa y localidad, seleccioná GLP, tanque por definir y agregá una observación.
2. Guardá ficha, actualizá el navegador y recuperala con «Abrir».
3. Generá ambos documentos e imprimí cada uno como PDF.
4. Seleccioná diésel; verificá que desaparezca el selector de tanque.
5. Confirmá que «Total orientativo» queda **A confirmar** si no se ingresaron importes aprobados.

Versión inicial independiente basada en los requerimientos funcionales del cotizador anterior; no altera la publicación ni el repositorio de Extragas.
