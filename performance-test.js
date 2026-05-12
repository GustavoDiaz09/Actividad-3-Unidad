// ============================================================================
// performance-test.js - Script de Pruebas de Rendimiento
// ============================================================================
// Descripción: Realiza pruebas de carga en el servidor para evaluar su
// rendimiento y proporciona métricas detalladas como latencia, throughput,
// percentiles P95 y P99, junto con recomendaciones de optimización.
// ============================================================================

const http = require('http');

/**
 * Clase PerformanceTester
 * Realiza pruebas de rendimiento en el servidor HTTP
 */
class PerformanceTester {
  constructor(hostname = 'localhost', port = 3000) {
    this.hostname = hostname;
    this.port = port;
    this.baseUrl = `http://${hostname}:${port}`;
    this.routes = ['/', '/home', '/api/status', '/api/info'];
    this.results = {};
  }

  /**
   * Realizar una solicitud HTTP y medir el tiempo
   * @param {string} path - Ruta a solicitar
   * @returns {Promise} Objeto con tiempo y estado de la solicitud
   */
  makeRequest(path) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const req = http.get(`${this.baseUrl}${path}`, (res) => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        resolve({
          path,
          latency,
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
        
        // Consumir el stream de datos
        res.on('data', () => {});
      });

      // Manejar errores de conexión
      req.on('error', () => {
        const endTime = Date.now();
        resolve({
          path,
          latency: endTime - startTime,
          statusCode: 0,
          success: false
        });
      });

      // Timeout de 5 segundos
      req.setTimeout(5000, () => {
        req.destroy();
      });
    });
  }

  /**
   * Verificar si el servidor está disponible
   * @returns {Promise} true si el servidor responde
   */
  async checkServerAvailability() {
    try {
      const result = await this.makeRequest('/');
      return result.success;
    } catch (err) {
      return false;
    }
  }

  /**
   * Ejecutar pruebas en todas las rutas
   * @param {number} requestsPerRoute - Solicitudes por ruta
   */
  async runTests(requestsPerRoute = 5) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         🧪 INICIANDO PRUEBAS DE RENDIMIENTO              ║
╚════════════════════════════════════════════════════════════╝
🎯 Objetivo: Evaluar la latencia y rendimiento del servidor
📍 Servidor: ${this.baseUrl}
📊 Solicitudes por ruta: ${requestsPerRoute}
🔄 Rutas a probar: ${this.routes.length}
═════════════════════════════════════════════════════════════
    `);

    // Verificar disponibilidad del servidor
    console.log('🔍 Verificando disponibilidad del servidor...');
    const isAvailable = await this.checkServerAvailability();

    if (!isAvailable) {
      console.error(`
❌ ERROR: No se puede conectar al servidor en ${this.baseUrl}

Asegúrate de que:
1. El servidor está ejecutándose: npm start
2. El puerto ${this.port} es correcto
3. No hay un firewall bloqueando la conexión

⏹️  Abortando pruebas...
      `);
      return;
    }

    console.log('✅ Servidor detectado. Iniciando pruebas...\n');

    // Ejecutar pruebas para cada ruta
    for (const route of this.routes) {
      this.results[route] = {
        latencies: [],
        successCount: 0,
        failureCount: 0
      };

      console.log(`📍 Probando ruta: ${route}`);

      for (let i = 1; i <= requestsPerRoute; i++) {
        const result = await this.makeRequest(route);
        
        if (result.success) {
          this.results[route].successCount++;
          this.results[route].latencies.push(result.latency);
          console.log(
            `   ✅ Solicitud ${i}/${requestsPerRoute}: ${result.latency}ms (HTTP ${result.statusCode})`
          );
        } else {
          this.results[route].failureCount++;
          console.log(
            `   ❌ Solicitud ${i}/${requestsPerRoute}: Error (HTTP ${result.statusCode})`
          );
        }
      }

      console.log('');
    }
  }

  /**
   * Calcular percentil de un array
   * @param {number[]} arr - Array de números
   * @param {number} p - Percentil (0-100)
   * @returns {number} Valor del percentil
   */
  calculatePercentile(arr, p) {
    if (arr.length === 0) return 0;
    
    const sorted = arr.sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Generar reporte detallado de las pruebas
   */
  generateReport() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║              📊 RESULTADOS DE LAS PRUEBAS                ║
╚════════════════════════════════════════════════════════════╝
    `);

    let totalLatencies = [];
    let totalSuccessful = 0;
    let totalRequests = 0;

    for (const route of this.routes) {
      const data = this.results[route];
      const latencies = data.latencies;
      
      totalLatencies = totalLatencies.concat(latencies);
      totalSuccessful += data.successCount;
      totalRequests += data.successCount + data.failureCount;

      if (latencies.length === 0) {
        console.log(`\n📍 Ruta: ${route}`);
        console.log('   ❌ Sin resultados exitosos\n');
        continue;
      }

      const minLatency = Math.min(...latencies);
      const maxLatency = Math.max(...latencies);
      const avgLatency = Math.round(
        latencies.reduce((a, b) => a + b, 0) / latencies.length
      );
      const p95 = this.calculatePercentile(latencies, 95);
      const p99 = this.calculatePercentile(latencies, 99);
      const successRate = (
        (data.successCount / (data.successCount + data.failureCount)) * 100
      ).toFixed(2);

      // Determinar estado
      let status = '✅ Excelente rendimiento';
      if (avgLatency > 100) status = '⚠️  Rendimiento lento';
      else if (avgLatency > 50) status = '⚡ Rendimiento aceptable';

      console.log(`📍 Ruta: ${route}`);
      console.log(`   ✅ Exitosas: ${data.successCount}/${data.successCount + data.failureCount}`);
      console.log(`   ⏱️  Latencia mínima:  ${minLatency}ms`);
      console.log(`   ⏱️  Latencia máxima:  ${maxLatency}ms`);
      console.log(`   ⏱️  Latencia promedio: ${avgLatency}ms`);
      console.log(`   📊 P95: ${p95}ms`);
      console.log(`   📊 P99: ${p99}ms`);
      console.log(`   ${status}`);
      console.log(`   📈 Tasa de éxito: ${successRate}%\n`);
    }

    // Resumen general
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    📈 RESUMEN GENERAL                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    
    if (totalLatencies.length > 0) {
      const minLatency = Math.min(...totalLatencies);
      const maxLatency = Math.max(...totalLatencies);
      const avgLatency = Math.round(
        totalLatencies.reduce((a, b) => a + b, 0) / totalLatencies.length
      );
      const p95 = this.calculatePercentile(totalLatencies, 95);
      const p99 = this.calculatePercentile(totalLatencies, 99);
      const throughput = (totalSuccessful / (totalLatencies.length * 0.05)).toFixed(2);
      const successRate = ((totalSuccessful / totalRequests) * 100).toFixed(2);

      console.log(`
Total de solicitudes: ${totalRequests}
Solicitudes exitosas: ${totalSuccessful}
Tasa de éxito general: ${successRate}%

⏱️  Latencia mínima:    ${minLatency}ms
⏱️  Latencia máxima:    ${maxLatency}ms
⏱️  Latencia promedio:  ${avgLatency}ms
📊 P95:                ${p95}ms
📊 P99:                ${p99}ms
🚀 Throughput:         ${throughput} req/s

      `);

      // Recomendaciones
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║              💡 RECOMENDACIONES DE OPTIMIZACIÓN            ║');
      console.log('╚════════════════════════════════════════════════════════════╝');

      const recommendations = this.getRecommendations(avgLatency, successRate);
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      console.log(`
═════════════════════════════════════════════════════════════
🏁 Pruebas completadas: ${new Date().toISOString()}
═════════════════════════════════════════════════════════════
      `);
    } else {
      console.log(`
❌ No se obtuvieron resultados de las pruebas.
   Verifica que el servidor esté en ejecución.
      `);
    }
  }

  /**
   * Obtener recomendaciones basadas en resultados
   * @param {number} avgLatency - Latencia promedio
   * @param {number} successRate - Tasa de éxito
   * @returns {string[]} Array de recomendaciones
   */
  getRecommendations(avgLatency, successRate) {
    const recommendations = [];

    if (successRate < 100) {
      recommendations.push(
        '❌ Investigar causas de fallos en las solicitudes'
      );
    }

    if (avgLatency < 30) {
      recommendations.push(
        '✅ Rendimiento excelente. Mantén la configuración actual'
      );
    } else if (avgLatency < 50) {
      recommendations.push(
        '✅ Buen rendimiento. Considera implementar caché'
      );
    } else if (avgLatency < 100) {
      recommendations.push(
        '⚠️  Latencia moderada. Implementa clustering de Node.js'
      );
    } else {
      recommendations.push(
        '❌ Latencia alta. Implementa load balancing con Nginx'
      );
    }

    if (avgLatency > 50) {
      recommendations.push(
        '💾 Considera usar compresión gzip para respuestas'
      );
      recommendations.push(
        '⚙️  Implementa caché HTTP con headers Cache-Control'
      );
      recommendations.push(
        '🗄️  Usa Redis para caché de datos frecuentes'
      );
    }

    if (this.routes.length > 5) {
      recommendations.push(
        '📊 Implementa monitoreo con Prometheus o New Relic'
      );
    }

    recommendations.push(
      '🔍 Realiza profiling con Node.js Inspector'
    );

    return recommendations;
  }

  /**
   * Exportar resultados en JSON
   * @returns {object} Objeto con todos los resultados
   */
  exportResults() {
    const results = {};
    
    for (const route of this.routes) {
      const data = this.results[route];
      const latencies = data.latencies;

      results[route] = {
        successCount: data.successCount,
        failureCount: data.failureCount,
        latencies: latencies,
        statistics: {
          min: Math.min(...latencies) || 0,
          max: Math.max(...latencies) || 0,
          avg: Math.round(
            latencies.reduce((a, b) => a + b, 0) / latencies.length
          ) || 0,
          p95: this.calculatePercentile(latencies, 95) || 0,
          p99: this.calculatePercentile(latencies, 99) || 0
        }
      };
    }

    return {
      timestamp: new Date().toISOString(),
      server: this.baseUrl,
      routes: results
    };
  }
}

// ============================================================================
// EJECUTAR PRUEBAS
// ============================================================================

(async () => {
  try {
    const tester = new PerformanceTester('localhost', 3000);
    
    // Ejecutar pruebas (5 solicitudes por ruta)
    await tester.runTests(5);
    
    // Generar y mostrar reporte
    tester.generateReport();
    
    // Exportar resultados
    const results = tester.exportResults();
    console.log('\n📄 Resultados en JSON:');
    console.log(JSON.stringify(results, null, 2));
    
  } catch (err) {
    console.error('❌ Error durante las pruebas:', err.message);
    process.exit(1);
  }
})();

module.exports = { PerformanceTester };
