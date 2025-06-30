
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addSampleData } from '@/utils/sampleData';
import { Database, Check, AlertCircle } from 'lucide-react';

const DatabaseSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const { toast } = useToast();

  const handleSetupData = async () => {
    setIsLoading(true);
    try {
      const result = await addSampleData();
      
      if (result?.success) {
        setIsSetup(true);
        toast({
          title: 'Success',
          description: 'Sample data has been added to your database',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add sample data. Check console for details.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during setup',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
          {isSetup ? (
            <Check className="h-6 w-6 text-green-600" />
          ) : (
            <Database className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>
          {isSetup 
            ? 'Your database has been set up with sample data'
            : 'Initialize your database with sample data to get started'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSetup && (
          <div className="rounded-lg bg-amber-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Setup Required
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Click the button below to add sample customers, candidates, vehicles, and other data to your database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleSetupData} 
          disabled={isLoading || isSetup}
          className="w-full"
        >
          {isLoading ? 'Setting up...' : isSetup ? 'Setup Complete' : 'Setup Sample Data'}
        </Button>

        {isSetup && (
          <p className="text-sm text-muted-foreground text-center">
            You can now use all features of the CRM system. Navigate to different sections to explore the functionality.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSetup;
