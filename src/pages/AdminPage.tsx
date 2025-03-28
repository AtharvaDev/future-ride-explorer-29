
import React, { useState, useEffect } from 'react';
import { Car } from '@/data/cars';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PlusCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { getAllCars, saveCar, deleteCar as deleteCarService } from '@/services/carService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CarList from '@/components/admin/CarList';
import CarForm, { CarFormValues } from '@/components/admin/CarForm';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

const AdminPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const queryClient = useQueryClient();

  // Fetch cars data
  const { 
    data: cars = [], 
    isLoading, 
    isError,
    error
  } = useQuery({
    queryKey: ['cars'],
    queryFn: getAllCars
  });

  // Mutations for car operations
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

  // Animation on component mount
  useEffect(() => {
    // Animate the content in
    const tl = gsap.timeline();
    tl.from('.admin-title', {
      y: -50,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    })
    .from('.admin-card', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, []);

  // Open dialog for creating a new car
  const handleAddCar = () => {
    setEditingCar(null);
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing car
  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  // Confirm deletion dialog
  const handleDeleteConfirm = (car: Car) => {
    setCarToDelete(car);
    setDeleteConfirmOpen(true);
  };

  // Actually delete the car
  const handleDeleteCar = () => {
    if (carToDelete) {
      deleteCarMutation.mutate(carToDelete.id);
      toast.success(`${carToDelete.title} deleted successfully`);
    }
  };

  // Handle form submission (create or update)
  const onSubmit = (data: CarFormValues, features: { icon: string; title: string; description: string }[]) => {
    if (editingCar) {
      // Update existing car
      const updatedCar: Car = {
        ...editingCar,
        ...data,
        features: features // Now using the features passed from the form
      };
      
      saveCarMutation.mutate(updatedCar);
      toast.success(`${data.title} updated successfully`);
    } else {
      // Create new car with features from the form
      const newCar: Car = {
        id: data.id,
        model: data.model,
        title: data.title,
        description: data.description,
        pricePerDay: data.pricePerDay,
        pricePerKm: data.pricePerKm,
        image: data.image,
        color: data.color,
        video: data.video,
        features: features // Now using the features passed from the form
      };
      
      saveCarMutation.mutate(newCar);
      toast.success(`${data.title} created successfully`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <p>Loading car data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching cars:", error);
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Data</h2>
            <p className="mb-6">There was an error loading the car data. Please try again later.</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['cars'] })}>
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24"> {/* Added padding-top to prevent overlap with navbar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold admin-title">Car Management</h1>
            <Button 
              onClick={handleAddCar} 
              className="flex items-center gap-2 admin-card"
              disabled={saveCarMutation.isPending}
            >
              <PlusCircle className="h-4 w-4" />
              Add New Car
            </Button>
          </div>

          <CarList 
            cars={cars}
            onEdit={handleEditCar}
            onDelete={handleDeleteConfirm}
            isLoading={saveCarMutation.isPending || deleteCarMutation.isPending}
          />
        </div>
      </main>

      {/* Car Form Dialog */}
      <CarForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
        editingCar={editingCar}
        isSubmitting={saveCarMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        car={carToDelete}
        onConfirm={handleDeleteCar}
        isDeleting={deleteCarMutation.isPending}
      />

      <Footer />
    </div>
  );
};

export default AdminPage;
