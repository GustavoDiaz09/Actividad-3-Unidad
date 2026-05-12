────────────────────────────────────────────────────────────────────────────────

# 🚀 Servidor de Red Node.js

Aplicación de red simple que demuestra conceptos clave de Node.js incluidos en el 
módulo HTTP nativo, framework Express, EventEmitter personalizado, manejo de 
solicitudes/respuestas y pruebas de rendimiento.

────────────────────────────────────────────────────────────────────────────────

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas Disponibles](#rutas-disponibles)
- [EventEmitter](#eventemitter)
- [Pruebas de Rendimiento](#pruebas-de-rendimiento)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Troubleshooting](#troubleshooting)

────────────────────────────────────────────────────────────────────────────────

## ✨ Características

✅ **Servidor HTTP Nativo** - Implementado con módulo `http` de Node.js
✅ **Framework Express** - Para enrutamiento avanzado y middleware
✅ **EventEmitter Personalizado** - Clase `RequestTracker` con eventos específicos
✅ **4 Rutas HTTP** - Responden con HTML y JSON
✅ **Manejo de Errores** - Global y por ruta
✅ **Logging en Consola** - Con emojis descriptivos
✅ **Pruebas de Rendimiento** - Métricas P95/P99 y recomendaciones
✅ **Código Documentado** - Comentarios en español
✅ **Cierre Graceful** - Manejo correcto de señales SIGTERM y SIGINT

────────────────────────────────────────────────────────────────────────────────

## 📦 Requisitos

- **Node.js** ≥ 14.0.0
- **npm** (incluido con Node.js)

Para verificar tus versiones:

```bash
node --version
npm --version
```

────────────────────────────────────────────────────────────────────────────────

## 🔧 Instalación

### 1. Clonar o descargar el repositorio

```bash
git clone https://github.com/GustavoDiaz09/Actividad-3-Unidad.git
cd Actividad-3-Unidad
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instala Express 4.18.2 y otras dependencias necesarias.

### 3. Verificar instalación

```bash
npm list
```

Deberías ver algo como:
```
node-network-app@1.0.0
└── express@4.18.2
```

────────────────────────────────────────────────────────────────────────────────

## 🚀 Uso

### Iniciar el Servidor

```bash
npm start
```

O directamente:

```bash
node server.js
```

Deberías ver:

```
╔════════════════════════════════════════════════════════════╗
║         🚀 SERVIDOR NODE.JS INICIADO EXITOSAMENTE        ║
╚════════════════════════════════════════════════════════════╝
📍 Servidor: http://localhost:3000
...
```

### Acceder al Servidor

Abre tu navegador en: **http://localhost:3000**

O usa `curl` en otra terminal:

```bash
curl http://localhost:3000
```

### Modo Desarrollo (con reinicio automático)

Si tienes instalado `nodemon`:

```bash
npm install -g nodemon
npm run dev
```

O directamente:

```bash
nodemon server.js
```

### Detener el Servidor

Presiona **Ctrl+C** en la terminal donde se ejecuta el servidor.

────────────────────────────────────────────────────────────────────────────────

## 🛣️ Rutas Disponibles

### 1. GET `/`

**Descripción:** Página de inicio con interfaz HTML

**Respuesta:** HTML con información sobre la aplicación

**Ejemplo:**

```bash
curl http://localhost:3000/
```

### 2. GET `/home`

**Descripción:** Página de inicio (home page)

**Respuesta:** HTML con detalles sobre la aplicación

**Ejemplo:**

```bash
curl http://localhost:3000/home
```

### 3. GET `/api/status`

**Descripción:** Estado del servidor en formato JSON

**Respuesta JSON:**

```json
{
  "status": "✅ online",
  "timestamp": "2026-05-12T19:50:00.000Z",
  "uptime": {
    "seconds": 120,
    "minutes": 2,
    "hours": 0
  },
  "server": {
    "hostname": "localhost",
    "port": 3000,
    "environment": "development"
  },
  "memory": {
    "heapUsed": "45 MB",
    "heapTotal": "128 MB",
    "external": "2 MB"
  },
  "requests": {
    "totalRequests": 5,
    "uptime": {...},
    "requestsByPath": {...}
  }
}
```

**Ejemplo:**

```bash
curl http://localhost:3000/api/status
```

### 4. GET `/api/info`

**Descripción:** Información detallada de la aplicación

**Respuesta JSON:**

```json
{
  "application": "Servidor de Red Node.js",
  "version": "1.0.0",
  "description": "Aplicación que demuestra conceptos clave de Node.js",
  "nodeVersion": "v18.0.0",
  "platform": "linux",
  "architecture": "x64",
  "features": [
    "Servidor HTTP con módulo http",
    "Framework Express",
    "EventEmitter personalizado",
    "Manejo de errores robusto",
    "Logging en tiempo real",
    "APIs RESTful"
  ],
  "timestamp": "2026-05-12T19:50:00.000Z"
}
```

**Ejemplo:**

```bash
curl http://localhost:3000/api/info
```

### Ruta 404 (No encontrada)

Cualquier ruta no configurada retorna:

```json
{
  "error": "❌ Ruta no encontrada",
  "path": "/ruta/inexistente",
  "method": "GET",
  "timestamp": "2026-05-12T19:50:00.000Z",
  "availableRoutes": [
    "GET /",
    "GET /home",
    "GET /api/status",
    "GET /api/info"
  ]
}
```

────────────────────────────────────────────────────────────────────────────────

## 📡 EventEmitter

### Clase RequestTracker

La aplicación incluye una clase personalizada `RequestTracker` que extiende 
`EventEmitter` de Node.js para rastrear y reportar sobre las solicitudes HTTP.

### Eventos Emitidos

| Evento | Cuándo | Datos |
|--------|--------|-------|
| `request` | Cualquier solicitud HTTP | Ruta solicitada |
| `home-request` | Acceso a `/` | Ninguno |
| `home-page-request` | Acceso a `/home` | Ninguno |
| `api-request` | Acceso a `/api/*` | Ruta API |
| `other-request` | Ruta desconocida | Ruta solicitada |
| `reset` | Reset de estadísticas | Ninguno |

### Listeners

Cada evento tiene un listener configurado que imprime en consola con emojis 
descriptivos:

```
📨 Evento: request → Ruta: /api/status
🔌 Evento: api-request → Acceso a API: /api/status
```

### Uso en Código

```javascript
const { RequestTracker } = require('./eventEmitter');

const tracker = new RequestTracker();

// Rastrear una solicitud
tracker.trackRequest('/home');

// Obtener estadísticas
const stats = tracker.getStats();

// Obtener reporte formateado
console.log(tracker.getFormattedReport());
```

────────────────────────────────────────────────────────────────────────────────

## 🧪 Pruebas de Rendimiento

### Ejecutar Pruebas

```bash
npm test
```

O directamente:

```bash
node performance-test.js
```

**Nota:** El servidor debe estar ejecutándose en otra terminal.

### Qué Mide el Script

- **Latencia:** Tiempo en milisegundos por solicitud
- **Throughput:** Solicitudes por segundo
- **Percentiles:** P95 y P99 de latencias
- **Éxito:** Tasa de solicitudes exitosas
- **Estadísticas:** Min, max, promedio

### Ejemplo de Salida

```
╔════════════════════════════════════════════════════════════╗
║         🧪 INICIANDO PRUEBAS DE RENDIMIENTO              ║
╚════════════════════════════════════════════════════════════╝
🎯 Objetivo: Evaluar la latencia y rendimiento del servidor
📍 Servidor: http://localhost:3000
📊 Solicitudes por ruta: 5
🔄 Rutas a probar: 4
═════════════════════════════════════════════════════════════

✅ Servidor detectado. Iniciando pruebas...

📍 Probando ruta: /
   ✅ Solicitud 1/5: 45ms (HTTP 200)
   ✅ Solicitud 2/5: 38ms (HTTP 200)
   ✅ Solicitud 3/5: 42ms (HTTP 200)
   ✅ Solicitud 4/5: 41ms (HTTP 200)
   ✅ Solicitud 5/5: 39ms (HTTP 200)

...

📍 Ruta: /
   ✅ Exitosas: 5/5
   ⏱️  Latencia mínima:  38ms
   ⏱️  Latencia máxima:  45ms
   ⏱️  Latencia promedio: 41ms
   📊 P95: 45ms
   📊 P99: 45ms
   ✅ Excelente rendimiento
```

### Interpretación de Resultados

| Latencia Promedio | Interpretación | Recomendación |
|------------------|-----------------|------------------|
| < 30ms | Excelente | Mantener configuración |
| 30-50ms | Muy bueno | Monitora ocasionalmente |
| 50-100ms | Aceptable | Considera optimizaciones |
| > 100ms | Lento | Optimiza urgentemente |

────────────────────────────────────────────────────────────────────────────────

## 📁 Estructura del Proyecto

```
Actividad-3-Unidad/
├── package.json              # Configuración npm
├── server.js                 # Servidor principal
├── eventEmitter.js           # EventEmitter personalizado
├── performance-test.js       # Script de pruebas
├── README.md                 # Este archivo
└── .gitignore               # Archivos a ignorar en git
```

### Descripción de Archivos

**package.json**
- Nombre y versión del proyecto
- Scripts npm (start, dev, test)
- Dependencias (Express)
- Configuración de Node.js

**server.js** (~400 líneas)
- Importa módulos necesarios
- Configura Express y middlewares
- Define 4 rutas HTTP
- Manejo global de errores
- Cierre graceful del servidor

**eventEmitter.js** (~280 líneas)
- Clase `RequestTracker` que extiende `EventEmitter`
- 6 eventos personalizados
- Rastreo de estadísticas
- Métodos de reporte

**performance-test.js** (~350 líneas)
- Clase `PerformanceTester`
- Pruebas de carga automáticas
- Cálculo de métricas (P95, P99)
- Recomendaciones de optimización

────────────────────────────────────────────────────────────────────────────────

## 🔧 Configuración Personalizada

### Cambiar Puerto

En **server.js**, cambia:

```javascript
const PORT = 3000;  // Cambiar a otro puerto
```

### Cambiar Hostname

En **server.js**, cambia:

```javascript
const HOSTNAME = 'localhost';  // O 0.0.0.0 para red local
```

### Aumentar Solicitudes de Prueba

En **performance-test.js**, cambia:

```javascript
const REQUESTS_PER_ROUTE = 5;  // Aumenta para más datos
```

────────────────────────────────────────────────────────────────────────────────

## 📊 Optimizaciones Incluidas

1. **Middleware de Logging**
   - Registra todas las solicitudes
   - Incluye timestamp y método HTTP

2. **Rastreo de EventEmitter**
   - Emite eventos específicos por tipo de solicitud
   - Mantiene estadísticas en tiempo real

3. **Manejo de Errores**
   - Middleware global para excepciones
   - Respuestas consistentes en JSON

4. **Respuestas Optimizadas**
   - HTML minimalista para páginas
   - JSON para APIs
   - Compresión opcional con gzip

5. **Monitoreo de Memoria**
   - Reporte de heap usado/total
   - Detección de memory leaks

────────────────────────────────────────────────────────────────────────────────

## 📈 Tips de Optimización

### Para Producción

1. **Usar un Reverse Proxy (Nginx)**
   ```bash
   # Nginx frente a Node.js
   # Cachea respuestas estáticas
   # Balancea carga
   ```

2. **Implementar Clustering**
   ```javascript
   // Usar módulo cluster de Node.js
   // Para aprovechar múltiples CPU cores
   ```

3. **Comprimir Respuestas**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

4. **Usar CDN**
   - Para contenido estático
   - Reduce carga del servidor

5. **Implementar Cache**
   - Redis para datos frecuentes
   - Cache en navegador con headers

6. **Monitoreo Continuo**
   - PM2 para gestión de procesos
   - New Relic o DataDog para APM
   - Prometheus para métricas

### Para Desarrollo

1. **Usar Nodemon**
   ```bash
   npm install -g nodemon
   ```

2. **Debugger de Chrome**
   ```bash
   node --inspect server.js
   # Visita: chrome://inspect
   ```

3. **Logs Estructurados**
   ```javascript
   // Usa winston o bunyan
   // Para mejor análisis
   ```

────────────────────────────────────────────────────────────────────────────────

## 🐛 Troubleshooting

### Problema: "Port 3000 is already in use"

**Solución 1:** Cambiar puerto en server.js
```javascript
const PORT = 3001;  // Usar otro puerto
```

**Solución 2:** Liberar puerto 3000
```bash
# En Linux/Mac
lsof -i :3000
kill -9 <PID>

# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: "Cannot find module 'express'"

**Solución:** Reinstalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: "ECONNREFUSED" en pruebas

**Solución:** Verificar que el servidor está corriendo
```bash
# Terminal 1
npm start

# Terminal 2 (después de que el servidor inicie)
npm test
```

### Problema: Conexión lenta

**Verificar:**
1. Recursos de CPU/Memoria: `top` o Task Manager
2. Conexión de red: `ping localhost`
3. Logs del servidor: Busca errores

### Problema: "Cannot GET /ruta"

**Causa:** Ruta no configurada

**Solución:** Usar rutas válidas:
- `/` - Página principal
- `/home` - Página de inicio
- `/api/status` - Estado del servidor
- `/api/info` - Información de la app

────────────────────────────────────────────────────────────────────────────────

## 📚 Recursos Adicionales

- [Documentación Node.js](https://nodejs.org/docs/)
- [Documentación Express](https://expressjs.com/)
- [EventEmitter API](https://nodejs.org/api/events.html)
- [HTTP Module](https://nodejs.org/api/http.html)

────────────────────────────────────────────────────────────────────────────────

## 📝 Notas Importantes

1. **Desarrollo:** El servidor está configurado para desarrollo local
2. **Producción:** Requiere configuraciones adicionales de seguridad
3. **Performance:** Las pruebas son indicativas, no definitivas
4. **Escalabilidad:** Para más carga, implementar clustering o load balancing

────────────────────────────────────────────────────────────────────────────────

## 👤 Autor

**Gustavo Díaz** - GustavoDiaz09

## 📄 Licencia

MIT License - Ver LICENSE para más detalles

────────────────────────────────────────────────────────────────────────────────

## 🎯 Resumen de Requisitos Completados

| Actividad | Descripción | Estado |
|-----------|------------|--------|
| Archivo JavaScript | server.js como punto de entrada | ✅ |
| Servidor HTTP | Módulo http en puerto 3000 | ✅ |
| Solicitudes/Respuestas | Eventos del servidor HTTP | ✅ |
| Módulo Externo | Express importado y usado | ✅ |
| Rutas Básicas | / y /home configuradas | ✅ |
| EventEmitter | Clase personalizada con eventos | ✅ |
| Pruebas Rendimiento | Script con métricas completas | ✅ |
| Documentación | README completo en español | ✅ |
| Código Comentado | Todas las líneas documentadas | ✅ |

────────────────────────────────────────────────────────────────────────────────

**Última actualización:** 12 de Mayo de 2026
**Versión:** 1.0.0
**Estado:** ✅ Completo y Funcional

════════════════════════════════════════════════════════════════════════════════
