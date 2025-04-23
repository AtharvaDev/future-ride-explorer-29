
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Vehicle, getAllVehicles, addVehicle, updateVehicle, deleteVehicle } from '@/services/vehicleService';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';

const VehiclesTab: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    nickName: string;
    model: string;
    registrationNumber: string;
  }>({
    nickName: '',
    model: '',
    registrationNumber: ''
  });

  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles
  });

  const addMutation = useMutation({
    mutationFn: addVehicle,
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add vehicle: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) => 
      updateVehicle(id, data),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update vehicle: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete vehicle: ${error.message}`);
    }
  });

  const resetForm = () => {
    setForm({
      nickName: '',
      model: '',
      registrationNumber: ''
    });
    setCurrentId(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setCurrentId(null);
    setForm({
      nickName: '',
      model: '',
      registrationNumber: ''
    });
    setShowForm(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    if (!vehicle.id) return;
    
    setCurrentId(vehicle.id);
    setForm({
      nickName: vehicle.nickName,
      model: vehicle.model,
      registrationNumber: vehicle.registrationNumber
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nickName || !form.model || !form.registrationNumber) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (currentId) {
      updateMutation.mutate({ id: currentId, data: form });
    } else {
      addMutation.mutate(form);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Vehicles</h2>
        <Button onClick={handleAdd} className="bg-primary text-white">
          + Add Vehicle
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6 shadow-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nickName">Vehicle Nickname</Label>
                <Input
                  id="nickName"
                  value={form.nickName}
                  onChange={(e) => setForm({ ...form, nickName: e.target.value })}
                  placeholder="Unique nickname for this vehicle"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="Vehicle model"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                  placeholder="Vehicle registration number"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <Button type="submit" variant="default">
                {currentId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Loading vehicles...</span>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No vehicles added yet</p>
          <p className="text-sm text-gray-500">Add your first vehicle using the button above</p>
        </div>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Nickname</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Registration Number</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.nickName}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.registrationNumber}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(vehicle)}
                      className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-700"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(vehicle.id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default VehiclesTab;
