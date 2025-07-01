import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, RefreshCw } from 'lucide-react';
import { MigrationStatus } from './types';
import { ConnectionTestCard } from './components/ConnectionTestCard';
import { MigrationSettingsCard } from './components/MigrationSettingsCard';
import { MigrationStatusList } from './components/MigrationStatusList';
import { LiveSyncCard } from './components/LiveSyncCard';
import { ConnectionDiagnostics } from './components/ConnectionDiagnostics';

const MigrationDashboard = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus[]>([]);
  const [connectionString, setConnectionString] = useState('');
  const { toast } = useToast();

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Legacy Data Migration Dashboard</h1>
      </div>

      <Tabs defaultValue="diagnostics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diagnostics">Connection Diagnostics</TabsTrigger>
          <TabsTrigger value="migrate">Start Migration</TabsTrigger>
          <TabsTrigger value="status">Migration Status</TabsTrigger>
          <TabsTrigger value="sync">Live Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostics" className="space-y-4">
          <ConnectionDiagnostics />
        </TabsContent>

        <TabsContent value="migrate" className="space-y-4">
          <ConnectionTestCard
            connectionString={connectionString}
            onConnectionStringChange={setConnectionString}
          />
          <MigrationSettingsCard
            connectionString={connectionString}
            onMigrationComplete={fetchMigrationStatus}
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Migration Status</h2>
            <Button onClick={fetchMigrationStatus} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <MigrationStatusList migrationStatus={migrationStatus} />
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <LiveSyncCard
            migrationStatus={migrationStatus}
            connectionString={connectionString}
            onSyncComplete={fetchMigrationStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MigrationDashboard;
