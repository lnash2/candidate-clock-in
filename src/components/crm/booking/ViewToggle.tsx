
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const ViewToggle = ({ activeView, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center border rounded-lg">
      <Button
        variant={activeView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
      >
        <List className="w-4 h-4 mr-1" />
        List
      </Button>
      <Button
        variant={activeView === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
      >
        <Grid className="w-4 h-4 mr-1" />
        Calendar
      </Button>
    </div>
  );
};

export default ViewToggle;
