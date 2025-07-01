import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, Upload, RefreshCw, CheckCircle, XCircle, Clock, TestTube } from 'lucide-react';

interface MigrationStatus {
  id: string;
  table_name: string;
  status: string;
  total_records: number;
  migrated_records: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

const MigrationDashboard = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [tablesToMigrate, setTablesToMigrate] = useState('');
  const [batchSize, setBatchSize] = useState(1000);
  const [connectionString, setConnectionString] = useState('');
  const { toast } = useToast();

  // Railway proxy service URL
  const PROXY_SERVICE_URL = 'https://candidate-clock-in-production.up.railway.app';

  useEffect(() => {
    fetchMigrationStatus();
  }, []);

  const fetchMigrationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('migration_status')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMigrationStatus(data || []);
    } catch (error) {
      console.error('Error fetching migration status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch migration status',
        variant: 'destructive',
      });
    }
  };

  const makeProxyRequest = async (endpoint: string, data: any) => {
    const url = `${PROXY_SERVICE_URL}${endpoint}`;
    
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
  };

  const testConnection = async () => {
    if (!connectionString.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a connection string',
        variant: 'destructive',
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      console.log('🔍 Testing connection via Railway proxy service');

      const data = await makeProxyRequest('/test-connection', { connectionString });

      if (data.success) {
        const message = `Database connection successful! Found ${data.table_count} tables.`;
          
        toast({
          title: 'Success! 🎉',
          description: message,
        });
        console.log('✅ Connection successful via Railway proxy');
      } else {
        throw new Error(data.error || 'Connection failed with unknown error');
      }
    } catch (error) {
      console.error('🚨 Connection test error:', error);
      
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to database',
        variant: 'destructive',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const startMigration = async () => {
    if (!connectionString.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a connection string',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const tables = tablesToMigrate
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      console.log('🚀 Starting migration via Railway proxy service');

      const data = await makeProxyRequest('/migrate-data', {
        connectionString,
        tables: tables.length > 0 ? tables : [],
        batchSize
      });

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Migration started successfully',
        });

        // Refresh status
        setTimeout(fetchMigrationStatus, 2000);
      } else {
        throw new Error(data.error || 'Migration failed');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start migration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startSync = async (tableName: string) => {
    try {
      console.log('🔄 Starting sync via Railway proxy service');

      const data = await makeProxyRequest('/sync-data', {
        connectionString,
        tableName
      });

      if (data.success) {
        toast({
          title: 'Success',
          description: `Sync completed for ${tableName}`,
        });

        fetchMigrationStatus();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to sync ${tableName}`,
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Legacy Data Migration Dashboard</h1>
      </div>

      <Tabs defaultValue="migrate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="migrate">Start Migration</TabsTrigger>
          <TabsTrigger value="status">Migration Status</TabsTrigger>
          <TabsTrigger value="sync">Live Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="migrate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                <strong>🚀 Enhanced Railway Proxy Service</strong><br/>
                Direct connection with improved CORS handling and error reporting. This service bypasses browser limitations and provides reliable database connectivity.
              </div>

              <div>
                <Label htmlFor="connectionString">PostgreSQL Connection String</Label>
                <Textarea
                  id="connectionString"
                  placeholder="postgresql://username:password@host:port/database?sslmode=require"
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                <strong>📋 Connection String Examples:</strong><br/>
                <div className="mt-2 space-y-2 font-mono text-xs">
                  <div><strong>Standard Connection:</strong><br/>
                  <code>postgresql://user:pass@host:5432/db</code></div>
                  
                  <div><strong>With SSL (recommended):</strong><br/>
                  <code>postgresql://user:pass@host:5432/db?sslmode=require</code></div>
                  
                  <div><strong>SSL with specific mode:</strong><br/>
                  <code>postgresql://user:pass@host:5432/db?sslmode=prefer</code></div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                <strong>✅ Enhanced Proxy Service Features:</strong><br/>
                • Comprehensive CORS configuration<br/>
                • Better error handling and logging<br/>
                • Enhanced SSL certificate handling<br/>
                • Improved network timeout management<br/>
                • Direct HTTP calls with detailed debugging
              </div>

              <Button
                onClick={testConnection}
                disabled={isTestingConnection}
                variant="outline"
                className="w-full"
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection via Enhanced Proxy...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Database Connection (Enhanced)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Migration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tables">Tables to Migrate (optional - leave empty for all)</Label>
                <Textarea
                  id="tables"
                  placeholder="Enter table names, one per line"
                  value={tablesToMigrate}
                  onChange={(e) => setTablesToMigrate(e.target.value)}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  min={100}
                  max={10000}
                />
              </div>

              <Button
                onClick={startMigration}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Starting Migration via Enhanced Proxy...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Start Migration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Migration Status</h2>
            <Button onClick={fetchMigrationStatus} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {migrationStatus.map((status) => (
              <Card key={status.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status.status)}
                      <h3 className="font-medium">{status.table_name}</h3>
                    </div>
                    <Badge className={getStatusColor(status.status)}>
                      {status.status}
                    </Badge>
                  </div>

                  {status.total_records > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{status.migrated_records} / {status.total_records}</span>
                      </div>
                      <Progress 
                        value={(status.migrated_records / status.total_records) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {status.error_message && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      {status.error_message}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-gray-500">
                    {status.started_at && (
                      <div>Started: {new Date(status.started_at).toLocaleString()}</div>
                    )}
                    {status.completed_at && (
                      <div>Completed: {new Date(status.completed_at).toLocaleString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Data Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {migrationStatus
                  .filter(s => s.status === 'completed')
                  .map((status) => (
                    <div key={status.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{status.table_name}</h4>
                        <p className="text-sm text-gray-600">
                          Last migrated: {new Date(status.updated_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => startSync(status.table_name)}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MigrationDashboard;
