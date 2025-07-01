
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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

  const startSync = async (tableName: string) => {
    try {
      console.log('🔄 Starting sync via Railway proxy service');

      const data = await ProxyService.syncData(connectionString, tableName);

      if (data.success) {
        toast({
          title: 'Success',
          description: `Sync completed for ${tableName}`,
        });

        onSyncComplete();
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

  const completedMigrations = migrationStatus.filter(s => s.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Data Sync</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {completedMigrations.map((status) => (
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
  );
};
