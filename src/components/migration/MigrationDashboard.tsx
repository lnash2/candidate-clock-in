import React from 'react';
import { Upload } from 'lucide-react';
import { FileUploadImportCard } from './components/fileUpload';

const MigrationDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Upload className="h-6 w-6" />
        <h1 className="text-2xl font-bold">SQL File Import</h1>
      </div>
      
      <FileUploadImportCard />
    </div>
  );
};

export default MigrationDashboard;
