
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminErrorProps {
  onRetry: () => void;
}

const AdminError: React.FC<AdminErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Data</h2>
        <p className="mb-6">There was an error loading the car data. Please try again later.</p>
        <Button onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
};

export default AdminError;
