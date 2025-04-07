
import React from 'react';
import { Loader } from 'lucide-react';

const AdminLoading: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="text-gray-600 dark:text-gray-300">Loading car data...</p>
      </div>
    </div>
  );
};

export default AdminLoading;
