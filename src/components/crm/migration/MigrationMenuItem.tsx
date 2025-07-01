
import React from 'react';
import { Database } from 'lucide-react';

const MigrationMenuItem = () => {
  return (
    <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
      <Database className="h-4 w-4" />
      <span>Data Migration</span>
    </div>
  );
};

export default MigrationMenuItem;
