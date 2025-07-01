
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MigrationStatus } from '../types';
import { ProxyService } from '../services/ProxyService';

interface LiveSyncCardProps {
  migrationStatus: MigrationStatus[];
  connectionString: string;
  onSyncComplete: () => void;
}

export const LiveSyncCard: React.FC<LiveSyncCardProps> = ({
  migrationStatus,
  connectionString,
  onSyncComplete
}) => {
  const { toast } = useToast();
  const [syncingTables, setSyncingTables] = useState<Set<string>>(new Set());

  const startSync = async (tableName: string) => {
    if (!connectionString.trim()) {
      toast({
        title: 'Error',
        description: 'Please configure and test your database connection first',
        variant: 'destructive',
      });
      return;
    }

    setSyncingTables(prev => new Set(prev).add(tableName));

    try {
      console.log(`🔄 Starting sync for ${tableName} via Railway proxy service`);

      const data = await ProxyService.syncData(connectionString, tableName);

      if (data.success) {
        toast({
          title: 'Sync Completed',
          description: `Successfully synced ${data.records_synced || 0} records from ${tableName}`,
        });

        onSyncComplete();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: error.message || `Failed to sync ${tableName}`,
        variant: 'destructive',
      });
    } finally {
      setSyncingTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(tableName);
        return newSet;
      });
    }
  };

  const completedMigrations = migrationStatus.filter(s => s.status === 'completed');

  if (completedMigrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Data Sync</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No completed migrations available for sync.</p>
            <p className="text-sm">Complete a migration first to enable live sync functionality.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Data Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <strong>ℹ️ Live Sync:</strong> Synchronizes recent changes from your legacy database to keep migrated data up-to-date.
        </div>

        <div className="grid gap-4">
          {completedMigrations.map((status) => {
            const isSync = syncingTables.has(status.table_name);
            
            return (
              <div key={status.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">{status.table_name}</h4>
                  <p className="text-sm text-gray-600">
                    Last migrated: {new Date(status.updated_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Total records: {status.total_records.toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => startSync(status.table_name)}
                  disabled={isSync}
                  variant="outline"
                  size="sm"
                >
                  {isSync ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
