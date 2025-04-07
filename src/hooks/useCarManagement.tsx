
import { useState } from 'react';
import { Car } from '@/data/cars';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllCars, 
  saveCar, 
  deleteCar as deleteCarService,
  resetCarsData
} from '@/services/carService';
import { cars as defaultCars } from '@/data/cars';
import { UI_STRINGS } from '@/constants/uiStrings';
import { CarFormValues } from '@/components/admin/CarForm';

export const useCarManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const queryClient = useQueryClient();

  const { 
    data: cars = [], 
    isLoading, 
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['cars'],
    queryFn: getAllCars
  });

  const saveCarMutation = useMutation({
    mutationFn: saveCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error saving car:', error);
      toast.error('Failed to save car');
    }
  });

  const deleteCarMutation = useMutation({
    mutationFn: (id: string) => deleteCarService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setDeleteConfirmOpen(false);
      setCarToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  });

  const resetCarsMutation = useMutation({
    mutationFn: () => resetCarsData(defaultCars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success(UI_STRINGS.ADMIN.REFRESH_CARS.SUCCESS);
    },
    onError: (error) => {
      console.error('Error resetting cars:', error);
      toast.error(UI_STRINGS.ADMIN.REFRESH_CARS.ERROR);
    }
  });

  const handleAddCar = () => {
    setEditingCar(null);
    setIsDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (car: Car) => {
    setCarToDelete(car);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCar = () => {
    if (carToDelete) {
      deleteCarMutation.mutate(carToDelete.id);
      toast.success(`${carToDelete.title} deleted successfully`);
    }
  };

  const handleResetCars = () => {
    resetCarsMutation.mutate();
  };

  const onSubmit = (
    data: CarFormValues, 
    features: { icon: string; title: string; description: string }[],
    additionalImages: string[],
    insights: string[]
  ) => {
    if (editingCar) {
      const updatedCar: Car = {
        ...editingCar,
        ...data,
        features: features,
        images: additionalImages.length > 0 ? additionalImages : undefined,
        insights: insights.length > 0 ? insights : undefined
      };
      
      if (!data.video) {
        delete updatedCar.video;
      }
      
      saveCarMutation.mutate(updatedCar);
      toast.success(`${data.title} updated successfully`);
    } else {
      const newCar: Car = {
        id: data.id,
        model: data.model,
        title: data.title,
        description: data.description,
        pricePerDay: data.pricePerDay,
        pricePerKm: data.pricePerKm,
        image: data.image,
        color: data.color,
        features: features
      };
      
      // Add optional fields only if they have values
      if (additionalImages.length > 0) {
        newCar.images = additionalImages;
      }
      
      if (insights.length > 0) {
        newCar.insights = insights;
      }
      
      if (data.video) {
        newCar.video = data.video;
      }
      
      saveCarMutation.mutate(newCar);
      toast.success(`${data.title} created successfully`);
    }
  };

  return {
    cars,
    isLoading,
    isError,
    error,
    refetch,
    isDialogOpen,
    setIsDialogOpen,
    editingCar,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    carToDelete,
    saveCarMutation,
    deleteCarMutation,
    resetCarsMutation,
    handleAddCar,
    handleEditCar,
    handleDeleteConfirm,
    handleDeleteCar,
    handleResetCars,
    onSubmit
  };
};
