
export class ProxyService {
  private static readonly PROXY_SERVICE_URL = 'https://candidate-clock-in-production.up.railway.app';

  static async makeRequest(endpoint: string, data: any, options: { timeout?: number } = {}) {
    const url = `${this.PROXY_SERVICE_URL}${endpoint}`;
    const { timeout = 30000 } = options;
    
    console.log(`🚀 Making request to: ${url}`);
    console.log(`📋 Request data:`, data);
    console.log(`⏱️ Timeout: ${timeout}ms`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
        credentials: 'omit', // Fixed: Match server setting
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`📥 Response status: ${response.status}`);
      console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error ${response.status}:`, errorText);
        
        // Provide more specific error messages
        if (response.status === 404) {
          throw new Error(`Endpoint not found: ${endpoint}. Please check the proxy service configuration.`);
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorText}. Please check the proxy service logs.`);
        } else if (response.status === 0) {
          throw new Error(`Network error: Unable to reach proxy service. Please check if the service is running.`);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log(`✅ Response data:`, responseData);
      return responseData;

    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`🚨 Request failed:`, error);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout: The proxy service took longer than ${timeout/1000} seconds to respond. Please try again or check your connection.`);
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to proxy service at ${this.PROXY_SERVICE_URL}. Please verify:\n• The proxy service is running\n• Your internet connection is stable\n• No firewall is blocking the request`);
      }
      
      throw error;
    }
  }

  static async testBasicConnectivity() {
    try {
      console.log('🔍 Testing basic connectivity to proxy service...');
      const response = await fetch(this.PROXY_SERVICE_URL, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Service returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Basic connectivity test passed:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Basic connectivity test failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async testDebugEndpoint() {
    try {
      console.log('🔍 Testing debug endpoint...');
      const response = await fetch(`${this.PROXY_SERVICE_URL}/debug`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Debug endpoint returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Debug endpoint test passed:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Debug endpoint test failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async testConnection(connectionString: string) {
    return this.makeRequest('/test-connection', { connectionString });
  }

  static async migrateData(connectionString: string, tables: string[], batchSize: number) {
    return this.makeRequest('/migrate-data', {
      connectionString,
      tables,
      batchSize
    }, { timeout: 60000 }); // Longer timeout for migration
  }

  static async syncData(connectionString: string, tableName: string, lastSyncTimestamp?: string) {
    return this.makeRequest('/sync-data', {
      connectionString,
      tableName,
      lastSyncTimestamp
    });
  }
}
