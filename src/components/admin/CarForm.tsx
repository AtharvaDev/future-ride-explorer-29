
import React from 'react';
import { Car } from '@/data/cars';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

export type CarFormValues = z.infer<typeof carFormSchema>;

interface CarFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CarFormValues) => void;
  editingCar: Car | null;
  isSubmitting: boolean;
}

const CarForm: React.FC<CarFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingCar,
  isSubmitting
}) => {
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

  // Reset form when editingCar changes
  React.useEffect(() => {
    if (editingCar) {
      form.reset({
        id: editingCar.id,
        model: editingCar.model,
        title: editingCar.title,
        description: editingCar.description,
        pricePerDay: editingCar.pricePerDay,
        pricePerKm: editingCar.pricePerKm,
        image: editingCar.image,
        color: editingCar.color,
        video: editingCar.video || "",
      });
    } else {
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
    }
  }, [editingCar, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    {editingCar ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  editingCar ? "Save Changes" : "Add Car"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CarForm;
