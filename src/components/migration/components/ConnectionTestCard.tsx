
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, TestTube, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProxyService } from '../services/ProxyService';

interface ConnectionTestCardProps {
  connectionString: string;
  onConnectionStringChange: (value: string) => void;
}

export const ConnectionTestCard: React.FC<ConnectionTestCardProps> = ({
  connectionString,
  onConnectionStringChange
}) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

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
    setConnectionStatus('idle');
    
    try {
      console.log('🔍 Testing connection via Railway proxy service');

      const data = await ProxyService.testConnection(connectionString);

      if (data.success) {
        const message = `Database connection successful! Found ${data.table_count} tables. Version: ${data.database_version?.substring(0, 50)}...`;
        
        setConnectionStatus('success');
        toast({
          title: 'Connection Successful! 🎉',
          description: message,
        });
        console.log('✅ Connection successful via Railway proxy');
      } else {
        throw new Error(data.error || 'Connection failed with unknown error');
      }
    } catch (error) {
      console.error('🚨 Connection test error:', error);
      setConnectionStatus('error');
      
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to database',
        variant: 'destructive',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Connection Configuration
          {connectionStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
          <strong>🚀 Railway Proxy Service Active</strong><br/>
          Direct connection with enhanced CORS handling and comprehensive error reporting. Service is running and ready for database connections.
        </div>

        <div>
          <Label htmlFor="connectionString">PostgreSQL Connection String</Label>
          <Textarea
            id="connectionString"
            placeholder="postgresql://username:password@host:port/database?sslmode=require"
            value={connectionString}
            onChange={(e) => onConnectionStringChange(e.target.value)}
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

        <Button
          onClick={testConnection}
          disabled={isTestingConnection}
          variant={connectionStatus === 'success' ? 'default' : 'outline'}
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
              {connectionStatus === 'success' ? 'Test Connection Again' : 'Test Database Connection'}
            </>
          )}
        </Button>

        {connectionStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
            ✅ Connection verified - Ready to proceed with migration!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
