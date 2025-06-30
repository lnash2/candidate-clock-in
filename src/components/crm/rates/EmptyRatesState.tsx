
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus } from 'lucide-react';

interface EmptyRatesStateProps {
  onAddRate: () => void;
}

const EmptyRatesState = ({ onAddRate }: EmptyRatesStateProps) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No rates set</h3>
        <p className="text-muted-foreground mb-4">
          Add company-specific rates for different driver classes and time periods
        </p>
        <Button onClick={onAddRate}>
          <Plus className="w-4 h-4 mr-2" />
          Add First Rate
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyRatesState;
