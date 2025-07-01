
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, TestTube } from 'lucide-react';
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
    
    try {
      console.log('🔍 Testing connection via Railway proxy service');

      const data = await ProxyService.testConnection(connectionString);

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

  return (
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
  );
};
