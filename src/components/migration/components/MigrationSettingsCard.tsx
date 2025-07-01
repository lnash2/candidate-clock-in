
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProxyService } from '../services/ProxyService';

interface MigrationSettingsCardProps {
  connectionString: string;
  onMigrationComplete: () => void;
}

export const MigrationSettingsCard: React.FC<MigrationSettingsCardProps> = ({
  connectionString,
  onMigrationComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tablesToMigrate, setTablesToMigrate] = useState('');
  const [batchSize, setBatchSize] = useState(1000);
  const { toast } = useToast();

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

      const data = await ProxyService.migrateData(connectionString, tables, batchSize);

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Migration started successfully',
        });

        // Refresh status
        setTimeout(onMigrationComplete, 2000);
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

  return (
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
  );
};
