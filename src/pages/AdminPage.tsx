
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';
import { useCarManagement } from '@/hooks/useCarManagement';
import CarList from '@/components/admin/CarList';
import CarForm from '@/components/admin/CarForm';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoading from '@/components/admin/AdminLoading';
import AdminError from '@/components/admin/AdminError';

const AdminPage = () => {
  const {
    cars,
    isLoading,
    isError,
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
  } = useCarManagement();

  // Scroll to top on page load - this ensures the page always starts at the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'instant' to ensure it scrolls without animation
    });
  }, []);

  useEffect(() => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <AdminLoading />
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <AdminError onRetry={() => refetch()} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <AdminHeader 
            onAddCar={handleAddCar}
            onResetCars={handleResetCars}
            isResetPending={resetCarsMutation.isPending}
            isSavePending={saveCarMutation.isPending}
          />

          <CarList 
            cars={cars}
            onEdit={handleEditCar}
            onDelete={handleDeleteConfirm}
            isLoading={saveCarMutation.isPending || deleteCarMutation.isPending}
          />
        </div>
      </main>

      <CarForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
        editingCar={editingCar}
        isSubmitting={saveCarMutation.isPending}
      />

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
