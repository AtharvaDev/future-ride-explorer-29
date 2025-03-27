import React, { useState } from 'react';
import { Car } from '@/data/cars';
import { Loader, Plus, Trash, PencilLine } from 'lucide-react';
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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

// Feature type definition
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface CarFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CarFormValues, features: Feature[]) => void;
  editingCar: Car | null;
  isSubmitting: boolean;
}

const AVAILABLE_ICONS = [
  "zap", "bolt", "battery-charging", "cpu", "activity", 
  "shield", "sun", "bluetooth", "command", "maximize",
  "package", "wind", "layout", "mountain", "fuel", "settings", "monitor"
];

const CarForm: React.FC<CarFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingCar,
  isSubmitting
}) => {
  // State for features
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeatureIcon, setNewFeatureIcon] = useState("zap");
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDesc, setNewFeatureDesc] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);

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
      setFeatures(editingCar.features || []);
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
      setFeatures([]);
    }
    setNewFeatureIcon("zap");
    setNewFeatureTitle("");
    setNewFeatureDesc("");
    setEditingFeatureIndex(null);
  }, [editingCar, form, open]);

  // Submit handler
  const handleSubmit = (data: CarFormValues) => {
    onSubmit(data, features);
  };

  // Feature handlers
  const addFeature = () => {
    if (newFeatureTitle.trim() === "") return;
    
    const newFeature: Feature = {
      icon: newFeatureIcon,
      title: newFeatureTitle.trim(),
      description: newFeatureDesc.trim()
    };
    
    if (editingFeatureIndex !== null) {
      const updatedFeatures = [...features];
      updatedFeatures[editingFeatureIndex] = newFeature;
      setFeatures(updatedFeatures);
      setEditingFeatureIndex(null);
    } else {
      setFeatures([...features, newFeature]);
    }
    
    setNewFeatureIcon("zap");
    setNewFeatureTitle("");
    setNewFeatureDesc("");
  };

  const editFeature = (index: number) => {
    const feature = features[index];
    setNewFeatureIcon(feature.icon);
    setNewFeatureTitle(feature.title);
    setNewFeatureDesc(feature.description);
    setEditingFeatureIndex(index);
  };

  const deleteFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    
    if (editingFeatureIndex === index) {
      setEditingFeatureIndex(null);
      setNewFeatureIcon("zap");
      setNewFeatureTitle("");
      setNewFeatureDesc("");
    }
  };

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            <Accordion type="single" collapsible className="w-full mt-6 border rounded-md">
              <AccordionItem value="features">
                <AccordionTrigger className="px-4">Car Features</AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {features.length > 0 ? (
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md text-primary">
                                {feature.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => editFeature(index)}
                              >
                                <PencilLine className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteFeature(index)}
                                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No features added yet. Add some features below.</p>
                    )}

                    <div className="space-y-3 pt-3 border-t">
                      <h4 className="text-sm font-medium">
                        {editingFeatureIndex !== null ? "Edit Feature" : "Add New Feature"}
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="featureIcon">Icon Name</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="featureIcon"
                              value={newFeatureIcon}
                              onChange={(e) => setNewFeatureIcon(e.target.value)}
                              placeholder="Icon name (e.g. zap, bolt)"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Available icons: {AVAILABLE_ICONS.join(", ")}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="featureTitle">Title</Label>
                          <Input
                            id="featureTitle"
                            value={newFeatureTitle}
                            onChange={(e) => setNewFeatureTitle(e.target.value)}
                            placeholder="e.g. 750 HP Overboost"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="featureDesc">Description</Label>
                          <Input
                            id="featureDesc"
                            value={newFeatureDesc}
                            onChange={(e) => setNewFeatureDesc(e.target.value)}
                            placeholder="e.g. Porsche performance"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={addFeature}
                        variant="outline"
                        className="w-full"
                      >
                        {editingFeatureIndex !== null ? (
                          <>Update Feature</>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Feature
                          </>
                        )}
                      </Button>
                      
                      {editingFeatureIndex !== null && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setEditingFeatureIndex(null);
                            setNewFeatureIcon("zap");
                            setNewFeatureTitle("");
                            setNewFeatureDesc("");
                          }}
                          className="w-full text-muted-foreground"
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
