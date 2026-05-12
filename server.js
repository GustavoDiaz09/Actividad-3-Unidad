// ============================================================================
// server.js - Servidor HTTP con Node.js y Express
// ============================================================================
// Descripción: Aplicación de red que demuestra conceptos clave de Node.js
// incluyendo: servidor HTTP, Express, EventEmitter, manejo de solicitudes
// y respuestas, manejo de errores y logging.
// ============================================================================

// Importar módulos necesarios
const express = require('express');
const http = require('http');
const { EventEmitter } = require('events');
const { RequestTracker } = require('./eventEmitter');

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

const app = express();
const PORT = 3000;
const HOSTNAME = 'localhost';

// Crear instancia del rastreador de solicitudes (EventEmitter personalizado)
const requestTracker = new RequestTracker();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logging personalizado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n📨 ${timestamp} - ${req.method} ${req.path}`);
  
  // Emitir evento de solicitud personalizado
  requestTracker.trackRequest(req.path);
  
  next();
});

// ============================================================================
// RUTAS
// ============================================================================

/**
 * Ruta raíz (/)
 * Responde con un mensaje de bienvenida en HTML
 */
app.get('/', (req, res) => {
  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Servidor Node.js</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 50px auto; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 { color: #667eea; }
        .nav { margin: 20px 0; }
        a { 
          display: inline-block;
          margin: 5px;
          padding: 10px 15px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
        }
        a:hover { background: #764ba2; }
        .info { 
          background: #f0f0f0; 
          padding: 15px; 
          border-left: 4px solid #667eea;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Bienvenido a Servidor Node.js</h1>
        <p>Aplicación de red simple que demuestra conceptos clave de Node.js</p>
        
        <div class="info">
          <strong>📍 Estado:</strong> ✅ Servidor activo y funcionando
        </div>
        
        <h2>📌 Rutas Disponibles:</h2>
        <div class="nav">
          <a href="/home">🏠 /home</a>
          <a href="/api/status">📊 /api/status</a>
          <a href="/api/info">ℹ️ /api/info</a>
        </div>
        
        <div class="info">
          <h3>Características:</h3>
          <ul>
            <li>✅ Servidor HTTP con módulo http de Node.js</li>
            <li>✅ Framework Express para gestión de rutas</li>
            <li>✅ EventEmitter personalizado para rastreo de solicitudes</li>
            <li>✅ Manejo robusto de errores</li>
            <li>✅ Logging en tiempo real de solicitudes</li>
            <li>✅ Respuestas JSON en APIs</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(htmlResponse);
});

/**
 * Ruta /home
 * Responde con información sobre la aplicación
 */
app.get('/home', (req, res) => {
  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página de Inicio</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 50px auto; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 { color: #667eea; }
        .back { 
          display: inline-block;
          margin: 20px 0;
          padding: 10px 15px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
        .back:hover { background: #764ba2; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏠 Página de Inicio</h1>
        <p>Esta es la ruta /home de la aplicación Node.js</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
          <h3>Sobre esta aplicación:</h3>
          <p>
            Esta aplicación demuestra conceptos clave de Node.js como:
          </p>
          <ul>
            <li>Servidores HTTP nativos</li>
            <li>Frameworks como Express</li>
            <li>Manejo de eventos con EventEmitter</li>
            <li>Solicitudes y respuestas HTTP</li>
            <li>Enrutamiento de aplicaciones</li>
          </ul>
        </div>
        
        <a href="/" class="back">← Volver al inicio</a>
      </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(htmlResponse);
});

/**
 * Ruta /api/status
 * Responde con información de estado en formato JSON
 */
app.get('/api/status', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  const status = {
    status: '✅ online',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.round(uptime),
      minutes: Math.round(uptime / 60),
      hours: Math.round(uptime / 3600)
    },
    server: {
      hostname: HOSTNAME,
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    },
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
    },
    requests: requestTracker.getStats()
  };
  
  res.status(200).json(status);
});

/**
 * Ruta /api/info
 * Proporciona información detallada sobre la aplicación
 */
app.get('/api/info', (req, res) => {
  const info = {
    application: 'Servidor de Red Node.js',
    version: '1.0.0',
    description: 'Aplicación que demuestra conceptos clave de Node.js',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    features: [
      'Servidor HTTP con módulo http',
      'Framework Express',
      'EventEmitter personalizado',
      'Manejo de errores robusto',
      'Logging en tiempo real',
      'APIs RESTful'
    ],
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(info);
});

// ============================================================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    error: '❌ Ruta no encontrada',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /',
      'GET /home',
      'GET /api/status',
      'GET /api/info'
    ]
  });
});

// ============================================================================
// MANEJO GLOBAL DE ERRORES
// ============================================================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    error: '⚠️ Error en el servidor',
    message: err.message,
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// CREAR E INICIAR SERVIDOR
// ============================================================================

const server = http.createServer(app);

server.listen(PORT, HOSTNAME, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         🚀 SERVIDOR NODE.JS INICIADO EXITOSAMENTE        ║
╚════════════════════════════════════════════════════════════╝
📍 Servidor: http://${HOSTNAME}:${PORT}
🕐 Inicio: ${new Date().toISOString()}
📌 Rutas disponibles:
   • GET  http://${HOSTNAME}:${PORT}/
   • GET  http://${HOSTNAME}:${PORT}/home
   • GET  http://${HOSTNAME}:${PORT}/api/status
   • GET  http://${HOSTNAME}:${PORT}/api/info
⏹️  Para detener: Presiona Ctrl+C
════════════════════════════════════════════════════════════
  `);
});

// ============================================================================
// MANEJO DE CIERRE GRACEFUL
// ============================================================================

// Evento para SIGTERM (terminación normal)
process.on('SIGTERM', () => {
  console.log('\n\n📢 Señal SIGTERM recibida. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Evento para SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n\n📢 Servidor interrumpido por el usuario');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    console.log('👋 ¡Hasta luego!');
    process.exit(0);
  });
});

// Evento para excepciones no capturadas
process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
  process.exit(1);
});

// Exportar app para testing si es necesario
module.exports = { app, server };
