
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllVehicles } from '@/services/vehicleService';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface VehicleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ 
  value, 
  onChange,
  includeAll = true
}) => {
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles
  });

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Loading vehicles..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select 
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a vehicle" />
      </SelectTrigger>
      <SelectContent>
        {includeAll && (
          <SelectItem value="all">All Vehicles</SelectItem>
        )}
        {vehicles.map(vehicle => (
          <SelectItem key={vehicle.id} value={vehicle.id || ''}>
            {vehicle.nickName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VehicleSelector;
