
import React from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UI_STRINGS } from '@/constants/uiStrings';

interface AdminHeaderProps {
  onAddCar: () => void;
  onResetCars: () => void;
  isResetPending: boolean;
  isSavePending: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onAddCar,
  onResetCars,
  isResetPending,
  isSavePending
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold admin-title">Car Management</h1>
      <div className="flex gap-2 admin-card">
        <Button 
          onClick={onResetCars} 
          className="flex items-center gap-2"
          variant="outline"
          disabled={isResetPending}
        >
          <RefreshCw className={`h-4 w-4 ${isResetPending ? 'animate-spin' : ''}`} />
          {isResetPending 
            ? UI_STRINGS.ADMIN.REFRESH_CARS.LOADING 
            : UI_STRINGS.ADMIN.REFRESH_CARS.BUTTON}
        </Button>
        <Button 
          onClick={onAddCar} 
          className="flex items-center gap-2"
          disabled={isSavePending}
        >
          <PlusCircle className="h-4 w-4" />
          Add New Car
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
