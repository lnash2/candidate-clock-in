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

      const response = await fetch(`${PROXY_SERVICE_URL}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionString })
      });

      console.log('📋 Proxy response status:', response.status);

      const data = await response.json();
      console.log('📋 Proxy response data:', data);

      if (!response.ok) {
        console.error('❌ Proxy service error:', data);
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      if (data.success) {
        const message = `Database connection successful! Found ${data.table_count} tables.`;
          
        toast({
          title: 'Success! 🎉',
          description: message,
        });
        console.log('✅ Connection successful via Railway proxy');
      } else {
        console.error('❌ Connection failed:', data);
        throw new Error(data.error || 'Connection failed with unknown error');
      }
    } catch (error) {
      console.error('🚨 Connection test error:', error);
      
      let errorMessage = 'Failed to connect to database';
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Connection Failed',
        description: errorMessage,
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

      const response = await fetch(`${PROXY_SERVICE_URL}/migrate-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionString,
          tables: tables.length > 0 ? tables : [],
          batchSize
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Migration failed:', data);
        throw new Error(data.error || 'Migration failed');
      }

      toast({
        title: 'Success',
        description: 'Migration started successfully',
      });

      // Refresh status
      setTimeout(fetchMigrationStatus, 2000);
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start migration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startSync = async (tableName: string) => {
    try {
      console.log('🔄 Starting sync via Railway proxy service');

      const response = await fetch(`${PROXY_SERVICE_URL}/sync-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionString,
          tableName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Sync failed:', data);
        throw new Error(data.error || 'Sync failed');
      }

      toast({
        title: 'Success',
        description: `Sync completed for ${tableName}`,
      });

      fetchMigrationStatus();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Error',
        description: `Failed to sync ${tableName}`,
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
                <strong>🚀 Now Using Railway Proxy Service</strong><br/>
                Direct connection to the Node.js proxy service running on Railway. This bypasses Supabase Edge Function issues and provides reliable database connectivity.
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
                <strong>✅ Railway Proxy Service Benefits:</strong><br/>
                • Handles expired SSL certificates automatically<br/>
                • Better error handling and debugging<br/>
                • No timeout issues for large datasets<br/>
                • Reliable PostgreSQL connection management<br/>
                • Direct HTTP calls, no Edge Function limitations
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
                    Testing Connection via Railway Proxy...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Database Connection (Railway)
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
                    Starting Migration via Railway...
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
