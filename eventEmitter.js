// ============================================================================
// eventEmitter.js - Módulo con EventEmitter Personalizado
// ============================================================================
// Descripción: Define una clase RequestTracker que extiende EventEmitter
// para rastrear y emitir eventos sobre las solicitudes HTTP recibidas
// ============================================================================

const { EventEmitter } = require('events');

/**
 * Clase RequestTracker
 * Extiende EventEmitter para crear un rastreador de solicitudes personalizado
 */
class RequestTracker extends EventEmitter {
  constructor() {
    super();
    
    // Estadísticas iniciales
    this.stats = {
      totalRequests: 0,
      requestsByPath: {},
      lastRequestTime: null,
      startTime: new Date()
    };
    
    // Configurar listeners para los eventos personalizados
    this.setupListeners();
  }

  /**
   * Configurar listeners para los eventos personalizados
   * Estos listeners se disparan automáticamente cuando se emiten eventos
   */
  setupListeners() {
    // Listener para solicitud general
    this.on('request', (path) => {
      console.log(`  📨 Evento: request → Ruta: ${path}`);
    });

    // Listener para acceso a ruta raíz
    this.on('home-request', () => {
      console.log(`  🏠 Evento: home-request → Acceso a ruta raíz /`);
    });

    // Listener para acceso a /home
    this.on('home-page-request', () => {
      console.log(`  📄 Evento: home-page-request → Acceso a ruta /home`);
    });

    // Listener para acceso a rutas API
    this.on('api-request', (path) => {
      console.log(`  🔌 Evento: api-request → Acceso a API: ${path}`);
    });

    // Listener para rutas no encontradas
    this.on('other-request', (path) => {
      console.log(`  ⚠️  Evento: other-request → Ruta desconocida: ${path}`);
    });

    // Listener para reset de estadísticas
    this.on('reset', () => {
      console.log(`  🔄 Evento: reset → Estadísticas reiniciadas`);
    });
  }

  /**
   * Rastrear una solicitud y emitir eventos apropiados
   * @param {string} path - La ruta solicitada
   */
  trackRequest(path) {
    // Incrementar contador total
    this.stats.totalRequests++;
    this.stats.lastRequestTime = new Date();

    // Inicializar contador para la ruta si no existe
    if (!this.stats.requestsByPath[path]) {
      this.stats.requestsByPath[path] = 0;
    }
    this.stats.requestsByPath[path]++;

    // Emitir evento general
    this.emit('request', path);

    // Emitir eventos específicos según la ruta
    if (path === '/') {
      this.emit('home-request');
    } else if (path === '/home') {
      this.emit('home-page-request');
    } else if (path.startsWith('/api')) {
      this.emit('api-request', path);
    } else {
      this.emit('other-request', path);
    }
  }

  /**
   * Obtener las estadísticas actuales
   * @returns {object} Objeto con estadísticas de solicitudes
   */
  getStats() {
    const uptime = new Date() - this.stats.startTime;
    
    return {
      totalRequests: this.stats.totalRequests,
      uptime: {
        milliseconds: Math.round(uptime),
        seconds: Math.round(uptime / 1000),
        minutes: Math.round(uptime / 1000 / 60)
      },
      requestsByPath: this.stats.requestsByPath,
      lastRequest: this.stats.lastRequestTime ? this.stats.lastRequestTime.toISOString() : null,
      startTime: this.stats.startTime.toISOString()
    };
  }

  /**
   * Reiniciar las estadísticas
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      requestsByPath: {},
      lastRequestTime: null,
      startTime: new Date()
    };
    
    // Emitir evento de reset
    this.emit('reset');
  }

  /**
   * Obtener el número de solicitudes para una ruta específica
   * @param {string} path - La ruta a consultar
   * @returns {number} Número de solicitudes para esa ruta
   */
  getRequestCount(path) {
    return this.stats.requestsByPath[path] || 0;
  }

  /**
   * Obtener el promedio de solicitudes por ruta
   * @returns {number} Promedio de solicitudes por ruta
   */
  getAverageRequestsPerRoute() {
    const routes = Object.keys(this.stats.requestsByPath).length;
    if (routes === 0) return 0;
    return Math.round(this.stats.totalRequests / routes);
  }

  /**
   * Obtener la ruta más solicitada
   * @returns {object} Objeto con la ruta más solicitada y su conteo
   */
  getMostRequestedRoute() {
    let mostRequested = null;
    let maxCount = 0;

    for (const [path, count] of Object.entries(this.stats.requestsByPath)) {
      if (count > maxCount) {
        maxCount = count;
        mostRequested = path;
      }
    }

    return {
      path: mostRequested,
      requests: maxCount
    };
  }

  /**
   * Obtener reporte completo con formato
   * @returns {string} Reporte formateado para consola
   */
  getFormattedReport() {
    const stats = this.getStats();
    const mostRequested = this.getMostRequestedRoute();
    const avgPerRoute = this.getAverageRequestsPerRoute();

    let report = '\n╔════════════════════════════════════════════════════════════╗\n';
    report += '║             📊 REPORTE DE SOLICITUDES HTTP                 ║\n';
    report += '╚════════════════════════════════════════════════════════════╝\n';
    report += `Total de solicitudes: ${stats.totalRequests}\n`;
    report += `Rutas distintas: ${Object.keys(stats.requestsByPath).length}\n`;
    report += `Promedio por ruta: ${avgPerRoute}\n`;
    report += `Ruta más solicitada: ${mostRequested.path} (${mostRequested.requests} veces)\n`;
    report += `Última solicitud: ${stats.lastRequest || 'N/A'}\n`;
    report += `Tiempo activo: ${stats.uptime.seconds}s\n\n`;
    report += 'Desglose por ruta:\n';
    report += '─────────────────────────────────────────────────────────────\n';

    for (const [path, count] of Object.entries(stats.requestsByPath)) {
      const percentage = ((count / stats.totalRequests) * 100).toFixed(2);
      report += `  ${path.padEnd(20)} → ${count.toString().padStart(3)} solicitudes (${percentage}%)\n`;
    }

    report += '═════════════════════════════════════════════════════════════\n';

    return report;
  }
}

// Exportar la clase
module.exports = { RequestTracker };
