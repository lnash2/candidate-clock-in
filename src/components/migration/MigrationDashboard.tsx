import React from 'react';
import { Github } from 'lucide-react';
import { GitHubImportCard } from './components/GitHubImportCard';

const MigrationDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Github className="h-6 w-6" />
        <h1 className="text-2xl font-bold">GitHub Data Import</h1>
      </div>
      
      <GitHubImportCard />
    </div>
  );
};

export default MigrationDashboard;
