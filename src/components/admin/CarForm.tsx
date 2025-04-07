import React, { useState } from 'react';
import { Car } from '@/data/cars';
import { Loader, Plus, Trash, PencilLine, ImageIcon, ImagesIcon, Settings } from 'lucide-react';
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  video: z.string().optional().transform(val => val === "" ? undefined : val),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface CarFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CarFormValues, features: Feature[], additionalImages: string[], insights: string[]) => void;
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
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeatureIcon, setNewFeatureIcon] = useState("zap");
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDesc, setNewFeatureDesc] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
  
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  
  const [insights, setInsights] = useState<string[]>([]);
  const [newInsight, setNewInsight] = useState("");

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
      setAdditionalImages(editingCar.images?.slice(1) || []);
      setInsights(editingCar.insights || []);
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
      setAdditionalImages([]);
      setInsights([]);
    }
    setNewFeatureIcon("zap");
    setNewFeatureTitle("");
    setNewFeatureDesc("");
    setEditingFeatureIndex(null);
    setNewImageUrl("");
    setNewInsight("");
  }, [editingCar, form, open]);

  const handleSubmit = (data: CarFormValues) => {
    if (data.video === "") {
      data.video = undefined;
    }
    
    const allImages = [data.image, ...additionalImages];
    
    onSubmit(data, features, allImages, insights);
  };

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
  
  const addImage = () => {
    if (newImageUrl.trim() === "") return;
    setAdditionalImages([...additionalImages, newImageUrl.trim()]);
    setNewImageUrl("");
  };
  
  const deleteImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
  };
  
  const addInsight = () => {
    if (newInsight.trim() === "") return;
    setInsights([...insights, newInsight.trim()]);
    setNewInsight("");
  };
  
  const deleteInsight = (index: number) => {
    const newInsights = insights.filter((_, i) => i !== index);
    setInsights(newInsights);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{editingCar ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>
            {editingCar 
              ? "Make changes to the car details and click save when you're done." 
              : "Fill in the details to add a new car to your fleet."}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4 max-h-[60vh]">
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
                    <FormLabel>Main Image URL (transparent background)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/car-image.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the main car image (with transparent background)
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
                        <Input 
                          placeholder="https://youtube.com/watch?v=..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Accordion type="multiple" className="w-full mt-6 border rounded-md">
                <AccordionItem value="additional-images">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <ImagesIcon className="h-5 w-5" />
                      <span>Additional Images (Carousel)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {additionalImages.length > 0 ? (
                        <div className="space-y-2">
                          {additionalImages.map((image, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                  <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-contain" />
                                </div>
                                <div className="truncate">
                                  <p className="text-sm truncate">{image}</p>
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteImage(index)}
                                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No additional images added yet. Add some images below.</p>
                      )}

                      <div className="flex items-end gap-2">
                        <div className="flex-grow">
                          <Label htmlFor="newImageUrl">Image URL</Label>
                          <Input
                            id="newImageUrl"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/car-image.jpg"
                          />
                        </div>
                        <Button 
                          type="button" 
                          onClick={addImage}
                          variant="outline"
                          className="mb-0.5"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Note: These images will appear in the carousel on the car details page
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rental-insights">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      <span>Rental Insights</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      {insights.length > 0 ? (
                        <div className="space-y-2">
                          {insights.map((insight, index) => (
                            <div key={index} className="flex items-start justify-between p-3 border rounded-md bg-muted/30">
                              <div className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold">{index + 1}</span>
                                </div>
                                <p className="text-sm">{insight}</p>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteInsight(index)}
                                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No rental insights added yet. Add some insights below.</p>
                      )}

                      <div className="flex items-end gap-2">
                        <div className="flex-grow">
                          <Label htmlFor="newInsight">Insight</Label>
                          <Input
                            id="newInsight"
                            value={newInsight}
                            onChange={(e) => setNewInsight(e.target.value)}
                            placeholder="e.g. Perfect for family trips with up to 8 passengers"
                          />
                        </div>
                        <Button 
                          type="button" 
                          onClick={addInsight}
                          variant="outline"
                          className="mb-0.5"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        These insights will be displayed on the booking page to help customers choose the right car
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      <span>Car Features</span>
                    </div>
                  </AccordionTrigger>
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
              <div className="h-4"></div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-2 border-t">
          <Button 
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
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
      </DialogContent>
    </Dialog>
  );
};

export default CarForm;
