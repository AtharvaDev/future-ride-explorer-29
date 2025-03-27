
import React, { useState, useEffect } from 'react';
import { cars as initialCars, Car } from '@/data/cars';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import gsap from 'gsap';

// Form validation schema
const carFormSchema = z.object({
  id: z.string().min(3, {
    message: "ID must be at least 3 characters.",
  }),
  model: z.string().min(1, {
    message: "Model is required.",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  pricePerDay: z.coerce.number().positive({
    message: "Price per day must be a positive number.",
  }),
  pricePerKm: z.coerce.number().positive({
    message: "Price per km must be a positive number.",
  }),
  image: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code.",
  }),
  video: z.string().url().optional(),
});

type CarFormValues = z.infer<typeof carFormSchema>;

const AdminPage = () => {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // Initialize form
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      id: "",
      model: "",
      title: "",
      description: "",
      pricePerDay: 0,
      pricePerKm: 0,
      image: "",
      color: "#3b82f6",
      video: "",
    },
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
    form.reset({
      id: "",
      model: "",
      title: "",
      description: "",
      pricePerDay: 0,
      pricePerKm: 0,
      image: "",
      color: "#3b82f6",
      video: "",
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing car
  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    form.reset({
      id: car.id,
      model: car.model,
      title: car.title,
      description: car.description,
      pricePerDay: car.pricePerDay,
      pricePerKm: car.pricePerKm,
      image: car.image,
      color: car.color,
      video: car.video || "",
    });
    setIsDialogOpen(true);
  };

  // Confirm deletion dialog
  const handleDeleteConfirm = (car: Car) => {
    setCarToDelete(car);
    setDeleteConfirmOpen(true);
  };

  // Actually delete the car
  const deleteCar = () => {
    if (carToDelete) {
      const updatedCars = cars.filter(car => car.id !== carToDelete.id);
      setCars(updatedCars);
      toast.success(`${carToDelete.title} deleted successfully`);
      setDeleteConfirmOpen(false);
      setCarToDelete(null);
      
      // In a real application, you would also save to database/localStorage here
      // localStorage.setItem('cars', JSON.stringify(updatedCars));
    }
  };

  // Handle form submission (create or update)
  const onSubmit = (data: CarFormValues) => {
    if (editingCar) {
      // Update existing car
      const updatedCars = cars.map(car => car.id === editingCar.id ? {
        ...car,
        ...data,
        features: car.features // Keep the original features
      } : car);
      
      setCars(updatedCars);
      toast.success(`${data.title} updated successfully`);
    } else {
      // Create new car with default features
      const newCar: Car = {
        ...data,
        features: [
          {
            icon: "zap",
            title: "Feature 1",
            description: "Description for feature 1"
          },
          {
            icon: "battery-charging",
            title: "Feature 2",
            description: "Description for feature 2"
          },
          {
            icon: "activity",
            title: "Feature 3",
            description: "Description for feature 3"
          },
          {
            icon: "cpu",
            title: "Feature 4",
            description: "Description for feature 4"
          }
        ]
      };
      
      setCars([...cars, newCar]);
      toast.success(`${data.title} created successfully`);
    }
    
    // Close dialog and reset form
    setIsDialogOpen(false);
    form.reset();
    
    // In a real application, you would also save to database/localStorage here
    // localStorage.setItem('cars', JSON.stringify(updatedCars));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold admin-title">Car Management</h1>
            <Button 
              onClick={handleAddCar} 
              className="flex items-center gap-2 admin-card"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Car
            </Button>
          </div>

          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Available Cars</CardTitle>
              <CardDescription>Manage your fleet of vehicles here. You can add, edit, or remove cars.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Price/Km</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <img 
                          src={car.image} 
                          alt={car.title} 
                          className="w-16 h-12 object-contain"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{car.id}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.title}</TableCell>
                      <TableCell>₹{car.pricePerDay}</TableCell>
                      <TableCell>₹{car.pricePerKm}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCar(car)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteConfirm(car)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Form Dialog for creating/editing cars */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
            <DialogDescription>
              {editingCar 
                ? "Make changes to the car details and click save when you're done." 
                : "Fill in the details to add a new car to your fleet."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. toyota-innova" 
                          {...field} 
                          disabled={!!editingCar} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Toyota Innova Hycross" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a detailed description of the car" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Day (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerKm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Km (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/car-image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the car image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Color</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="text" placeholder="#3b82f6" {...field} />
                        </FormControl>
                        <div 
                          className="w-10 h-10 rounded-md border" 
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                      <FormDescription>
                        Enter a hex color code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editingCar ? "Save Changes" : "Add Car"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{carToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteCar}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminPage;
