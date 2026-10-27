# Suscribirte

Aplicación para Vercel y Neon. Incluye cuentas con Better Auth, almacenamiento por usuario, control de versiones para evitar sobrescrituras entre dispositivos, costo diario, valor restante, voz y exportación de calendario y respaldos. La vigencia, los avisos y el costo diario se deciden por fecha y hora, no solo por fecha.

## Configuración

1. Conectar Neon al proyecto `suscribirte` de Vercel. Verificar que exista `DATABASE_URL` en Production y Preview. No publicar esta variable.
2. Configurar `BETTER_AUTH_SECRET` (aleatorio, al menos 32 caracteres) en Vercel. Generarlo localmente con `openssl rand -base64 48` y guardarlo como variable sensible. No incluirlo en Git.
3. Configurar `BETTER_AUTH_URL` con el dominio de producción realmente asignado. Para probar antes de configurar DNS, usar primero el dominio de Vercel. Cambiarlo después a `https://suscribirte.arcdata.app`.
4. Instalar: `npm ci` (o `npm install` si todavía no hay lockfile).
5. Desde una terminal autenticada de Vercel: `vercel link`, luego `vercel env pull .env.local`. Verificar que las tres claves estén presentes sin imprimir sus valores.
6. Ejecutar migraciones con `node --env-file=.env.local scripts/migrate.mjs`. No hacer migraciones automáticas en cada build de Preview ni apuntar los previews a producción.
7. `npm test` y `npm run build`.
8. Desplegar en Vercel. Asignar el subdominio desde Settings → Domains y utilizar exactamente los registros DNS que indique Vercel.
9. Verificar crear cuenta → guardar → cerrar sesión → volver a entrar y comprobar persistencia. Crear otra cuenta y comprobar que no ve datos de la primera. Verificar acceso desde otro dispositivo.

## Migración de datos anteriores

Exportar respaldo en la app anterior. Iniciar sesión en la nueva e importar el JSON. La importación reemplaza los registros de la cuenta tras confirmación. No hay transferencia silenciosa entre dominios.

## Estado

Desplegado en producción el 26 de octubre de 2026 en https://suscribirte.arcdata.app (proyecto `suscribirte` del equipo Econolab en Vercel, con base de datos Neon).

Verificado en producción: crear cuenta, guardar, conflicto de versión entre dispositivos (409), cerrar sesión, volver a entrar con los datos intactos y aislamiento entre cuentas. Las migraciones se ejecutaron una sola vez; `vercel.json` no las ejecuta en cada build.

Neon crea las variables con el prefijo `SUSCRIBE_`. Por eso `lib/db.js` acepta `DATABASE_URL` o `SUSCRIBE_DATABASE_URL`, y `scripts/migrate.mjs` prefiere la conexión sin agrupar (`SUSCRIBE_DATABASE_URL_UNPOOLED`) para el DDL. Las variables están marcadas como sensibles y no se pueden leer desde la CLI: las migraciones se ejecutan desde el build de Vercel o con la cadena de conexión tomada del panel de Neon.

## Fecha y hora

Cada suscripción admite `startTime` y `endTime` en formato `HH:MM`. Son opcionales: si faltan se interpretan como `00:00`, de modo que los registros anteriores conservan exactamente el mismo comportamiento.

Con `endTime` en `00:00` el período termina al comenzar el día de vencimiento; con `23:59` incluye el día completo. Los días restantes, el estado (vigente, por vencer, vencida, por comenzar), el aviso anticipado, el costo diario y el valor restante se calculan al minuto, y la vista se actualiza cada minuto. Un período puede empezar y terminar el mismo día si la hora de vencimiento es posterior a la de inicio.

Al renovar, el nuevo período arranca en la fecha y hora exactas en que terminó el anterior. La exportación al calendario genera un evento con hora cuando `endTime` no es `00:00`, y un evento de día completo cuando lo es.

## Limitaciones


Los avisos del navegador funcionan con la página abierta. Para recordatorios con la app cerrada se exporta al calendario. El envío automático de correos y recuperación/verificación por correo todavía no están implementados; requieren configurar un proveedor y remitente. No presentar el correo como activo.

Las cuentas se crean con correo y contraseña (mínimo 12 caracteres), sin verificación de correo por ahora. No hay recuperación de contraseña todavía. No habilitar recordatorios por correo hasta verificar la propiedad del correo. Para lanzamiento público, añadir verificación y recuperación con proveedor de correo.
