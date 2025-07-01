
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ProxyService } from '../services/ProxyService';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
  details?: any;
}

export const ConnectionDiagnostics: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const tests: Omit<TestResult, 'status'>[] = [
    { name: 'Basic Connectivity', message: 'Testing if proxy service is reachable' },
    { name: 'Debug Endpoint', message: 'Testing debug endpoint functionality' },
    { name: 'CORS Configuration', message: 'Testing cross-origin resource sharing' },
    { name: 'JSON Parsing', message: 'Testing request/response parsing' },
  ];

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTestResults(tests.map(test => ({ ...test, status: 'pending' })));

    const results: TestResult[] = [];

    // Test 1: Basic Connectivity
    try {
      console.log('🔍 Running Test 1: Basic Connectivity');
      const basicTest = await ProxyService.testBasicConnectivity();
      results.push({
        name: 'Basic Connectivity',
        status: basicTest.success ? 'success' : 'failed',
        message: basicTest.success 
          ? 'Proxy service is reachable and responding'
          : `Failed: ${basicTest.error}`,
        details: basicTest.data
      });
    } catch (error) {
      results.push({
        name: 'Basic Connectivity',
        status: 'failed',
        message: `Error: ${error.message}`,
        details: error
      });
    }

    setTestResults([...results]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Debug Endpoint
    try {
      console.log('🔍 Running Test 2: Debug Endpoint');
      const debugTest = await ProxyService.testDebugEndpoint();
      results.push({
        name: 'Debug Endpoint',
        status: debugTest.success ? 'success' : 'failed',
        message: debugTest.success 
          ? 'Debug endpoint working correctly'
          : `Failed: ${debugTest.error}`,
        details: debugTest.data
      });
    } catch (error) {
      results.push({
        name: 'Debug Endpoint',
        status: 'failed',
        message: `Error: ${error.message}`,
        details: error
      });
    }

    setTestResults([...results]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: CORS Configuration
    try {
      console.log('🔍 Running Test 3: CORS Configuration');
      const corsTest = await fetch(`${ProxyService['PROXY_SERVICE_URL']}/debug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'cors' }),
        mode: 'cors',
        credentials: 'omit'
      });

      const corsData = await corsTest.json();
      results.push({
        name: 'CORS Configuration',
        status: corsTest.ok ? 'success' : 'failed',
        message: corsTest.ok 
          ? 'CORS headers properly configured'
          : 'CORS configuration issue detected',
        details: corsData
      });
    } catch (error) {
      results.push({
        name: 'CORS Configuration',
        status: 'failed',
        message: `CORS Error: ${error.message}`,
        details: error
      });
    }

    setTestResults([...results]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 4: JSON Parsing
    try {
      console.log('🔍 Running Test 4: JSON Parsing');
      const testData = { 
        test: true, 
        timestamp: new Date().toISOString(),
        data: { nested: 'value' }
      };
      
      const jsonTest = await ProxyService.makeRequest('/debug', testData);
      results.push({
        name: 'JSON Parsing',
        status: 'success',
        message: 'Request/response JSON parsing working correctly',
        details: jsonTest
      });
    } catch (error) {
      results.push({
        name: 'JSON Parsing',
        status: 'failed',
        message: `JSON Error: ${error.message}`,
        details: error
      });
    }

    setTestResults([...results]);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Running...</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Connection Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <strong>🔧 Diagnostic Tests:</strong> Run these tests to identify exactly where the connection is failing.
        </div>

        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Connection Diagnostics'
          )}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h5 className="font-medium">{result.name}</h5>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>
        )}

        {testResults.length > 0 && testResults.every(r => r.status !== 'pending') && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <h5 className="font-medium mb-2">Next Steps:</h5>
            {testResults.every(r => r.status === 'success') ? (
              <p className="text-green-800">✅ All tests passed! Your connection should work properly.</p>
            ) : (
              <div className="space-y-1 text-sm">
                {testResults.filter(r => r.status === 'failed').map((failedTest, index) => (
                  <p key={index} className="text-red-800">
                    • Fix {failedTest.name}: {failedTest.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
