
export class ProxyService {
  private static readonly PROXY_SERVICE_URL = 'https://candidate-clock-in-production.up.railway.app';

  static async makeRequest(endpoint: string, data: any) {
    const url = `${this.PROXY_SERVICE_URL}${endpoint}`;
    
    console.log(`🚀 Making request to: ${url}`);
    console.log(`📋 Request data:`, data);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
        credentials: 'omit'
      });

      console.log(`📥 Response status: ${response.status}`);
      console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log(`✅ Response data:`, responseData);
      return responseData;

    } catch (error) {
      console.error(`🚨 Request failed:`, error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to proxy service. Please check your internet connection and try again.');
      }
      
      throw error;
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
    });
  }

  static async syncData(connectionString: string, tableName: string, lastSyncTimestamp?: string) {
    return this.makeRequest('/sync-data', {
      connectionString,
      tableName,
      lastSyncTimestamp
    });
  }
}
