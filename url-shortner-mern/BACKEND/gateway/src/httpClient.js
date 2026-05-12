import axios from "axios";

/**
 * Make HTTP GET request to check service health
 * @param {string} url - Full URL to check
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<{status: string, data?: any, error?: string}>}
 */
export async function checkServiceHealth(url, timeout = 3000) {
  try {
    const response = await axios.get(url, { timeout });
    return {
      status: "up",
      data: response.data,
      statusCode: response.status,
    };
  } catch (error) {
    let errorMessage = error.message;

    if (error.code === "ECONNREFUSED") {
      errorMessage = "Service not reachable";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = "Connection timeout";
    } else if (error.response) {
      errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
    }

    return {
      status: "down",
      error: errorMessage,
      statusCode: error.response?.status || null,
    };
  }
}

/**
 * Check multiple services in parallel
 * @param {Array<{url: string, timeout: number, name: string}>} services
 * @returns {Promise<Object>} - Map of service names to health status
 */
export async function checkMultipleServices(services) {
  const checks = services.map(async (service) => {
    const result = await checkServiceHealth(service.url, service.timeout);
    return { [service.name]: result };
  });

  const results = await Promise.all(checks);
  return Object.assign({}, ...results);
}
