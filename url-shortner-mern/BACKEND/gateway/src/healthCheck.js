import { checkMultipleServices } from "./httpClient.js";
import { services } from "./services.js";

/**
 * Prepare service URLs for health checking
 * @returns {Array} - List of services with their URLs
 */
function prepareServiceChecks() {
  const serviceList = [];

  for (const service in services) {
    if (services.hasOwnProperty(service)) {
      serviceList.push({
        name: services[service].name,
        url: `${services[service].devUrl}/health`,
        timeout: 30000,
      });
    }
  }

  console.log(serviceList);

  return serviceList;
}

/**
 * Perform comprehensive health check of all services
 * @returns {Promise<{allHealthy: boolean, services: Object, timestamp: string}>}
 */
export async function performHealthCheck() {
  const servicesToCheck = prepareServiceChecks();
  const healthStatus = await checkMultipleServices(servicesToCheck);

  // Add gateway health
  const allServices = {
    gateway: {
      status: "up",
      details: {
        port: 3000,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().rss,
      },
    },
    ...healthStatus,
  };

  const allHealthy = Object.values(allServices).every((service) => service.status === "up");

  return {
    allHealthy,
    services: allServices,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate HTTP response based on health check results
 * @returns {Promise<{statusCode: number, body: Object}>}
 */
export async function getHealthResponse() {
  const healthData = await performHealthCheck();

  return {
    statusCode: healthData.allHealthy ? 200 : 503,
    body: {
      success: healthData.allHealthy,
      message: healthData.allHealthy
        ? "All services are operational"
        : "Some services are experiencing issues",
      timestamp: healthData.timestamp,
      services: healthData.services,
    },
  };
}
