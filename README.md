# ORZEN Energy — Mesa comercial V2.0

Aplicación estática, sin servidor, diseñada para detectar y registrar oportunidades de GLP a granel o diésel. Es una herramienta de **intermediación comercial**, no un sistema de ingeniería ni una cotización aprobada por un distribuidor.

## Qué cambió en V2

- Guía de seis preguntas para prospectar por teléfono, WhatsApp o LinkedIn.
- Formulario general con consumo declarado, fuente del dato (factura / cliente / técnico / desconocido) y estacionalidad.
- Preguntas específicas para granjas avícolas (galpones, aves, ciclos, calefacción), secadoras y acopios (secadoras, toneladas/hora, horas y campaña), industria (equipos y horas) o diésel (equipos, frecuencia de reposición y almacenamiento).
- Documentación diferenciada:
  - **Ficha para Brian/proveedor:** identificación del contacto, datos operativos, consumo, estado, preguntas del sector y notas internas.
  - **Constancia para el cliente:** confirmación de la consulta con resumen de la necesidad, sin notas internas, sin detalles del contacto y sin precios pendientes.
- Requiere constancia de autorización de la persona antes de imprimir la ficha del proveedor o copiar su contacto para WhatsApp. Registrar esta casilla no sustituye obtener permiso real.
- Botón “Copiar resumen para WhatsApp” para pasar a Brian sin transcribir todo.
- Se conservaron los borradores creados en V1 si se utiliza el mismo navegador y origen: la clave `orzen_energy_fichas_v1` no cambió.
- Se conserva la tabla de conceptos opcional, **sin precios precargados**, y solo se muestran montos al cliente cuando se marcan como confirmados y autorizados.

## Preguntas útiles por sector

### Granjas avícolas

1. ¿Cuántos galpones tiene y cuántos usa actualmente?
2. ¿Cuántas aves aloja por galpón aproximadamente?
3. ¿Cuántas crianzas/ciclos hace por año?
4. ¿Con qué calefacciona y durante cuántos días de cada crianza?
5. ¿Tiene facturas o registros de compras por crianza / mes? ¿Qué combustible usa?
6. ¿Quién recibiría al técnico? ¿Cuándo necesita resolverlo?

### Secadoras / acopios

1. ¿Cuántas secadoras/quemadores operan?
2. ¿Qué capacidad de procesamiento tienen (t/h) si la conoce?
3. ¿Cuántas horas por día y días por campaña trabajan?
4. ¿Con qué combustible funcionan actualmente?
5. ¿Tienen comprobantes de consumo de campañas anteriores?
6. ¿Qué problema quieren resolver (abastecimiento, costos, nueva planta, conversión)?

### Diésel / otras industrias

1. ¿Qué equipos, flotas, calderas o grupos electrógenos abastecen?
2. ¿Cuántos equipos o vehículos son y cuántas horas funcionan?
3. ¿Cuántos litros compran y cada cuánto? Pedir referencias de facturas, si las tienen.
4. ¿Cómo almacenan y reciben las entregas?
5. ¿Quién aprueba compras y recibe al proveedor?
6. ¿Cuál es el plazo y el motivo de la búsqueda?

**No transformar cantidad de galpones, aves, t/h o cantidad de equipos en kg de GLP ni en capacidad de tanque por cuenta propia:** para ello se requiere potencia y datos técnicos reales, estacionalidad, autonomía requerida y evaluación del proveedor.

## Publicación en GitHub Pages

Subir a la raíz del **mismo repositorio donde está publicada V1** estos elementos:

- `index.html`
- `styles.css`
- `app.js`
- carpeta `assets/`

Esperar la publicación y forzar recarga (`Ctrl+F5`). No reemplazar la web corporativa `orzen-energy`. La aplicación no solicita conexiones nuevas ni tiene suscripción.

## Prueba manual recomendada (antes de uso real)

1. Completar una empresa ficticia, localidad, responsable y teléfono.
2. Seleccionar **Avicultura** y verificar que aparezcan las preguntas de galpones, aves y ciclos.
3. Dejar consumo vacío para comprobar que se muestre **A determinar**, no un valor inventado.
4. Antes de marcar consentimiento, intentar imprimir ficha para Brian y comprobar que se bloquee.
5. Marcar autorización ficticia para la prueba e imprimir/guardar como PDF la ficha para Brian.
6. Imprimir/guardar como PDF la constancia para el cliente y comprobar que **no aparezcan** notas internas ni importes no confirmados.
7. Alternar a **Diésel** y verificar los campos de equipos, reposición y almacenamiento. Guardar ficha y reabrirla en el mismo navegador.

## Privacidad y operación

- **GitHub Pages no es un backend privado ni tiene autenticación.** La herramienta publicada se puede abrir si alguien conoce su enlace. Cada usuario solo ve su almacenamiento local; eso no convierte la app en un sistema seguro para datos sensibles.
- Los datos de fichas se guardan en el `localStorage` del navegador de cada dispositivo, no se sincronizan ni se envían a GitHub. Si se limpia la caché o cambia el origen, pueden perderse.
- Los respaldos JSON incluyen los datos del cliente en texto plano: mantenerlos fuera de repositorios públicos, evitar compartirlos y proteger el dispositivo.
- Pedir permiso para compartir datos antes de derivar; no publicar prospectos ni detalles de instalaciones privadas.
- La capacidad del tanque y cualquier material visual son **referencias, no planos de ingeniería ni aprobaciones**. No interpretar el consumo sin fuente como cifra verificada.
- La ficha comercial de ORZEN no compromete precios, visitas, plazos de instalación ni disponibilidad de GLP o diésel del proveedor.

Este paquete no modifica el proyecto de Extragas ni incorpora su información comercial privada.
