
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MigrationStatus } from '../types';
import { getStatusIcon, getStatusColor } from '../utils/statusUtils';

interface MigrationStatusListProps {
  migrationStatus: MigrationStatus[];
}

export const MigrationStatusList: React.FC<MigrationStatusListProps> = ({
  migrationStatus
}) => {
  return (
    <div className="grid gap-4">
      {migrationStatus.map((status) => {
        const StatusIcon = getStatusIcon(status.status);
        
        return (
          <Card key={status.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <StatusIcon className="h-4 w-4 text-current" />
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
        );
      })}
    </div>
  );
};
