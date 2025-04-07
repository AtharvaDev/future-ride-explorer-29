import React, { useState, useEffect } from 'react';
import { Car } from '@/data/cars';
import { Loader, Settings, ImagesIcon, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import FeatureForm from './form/FeatureForm';
import ImagesForm from './form/ImagesForm';
import InsightsForm from './form/InsightsForm';
import CarFormFields from './form/CarFormFields';

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

const CarForm: React.FC<CarFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingCar,
  isSubmitting
}) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

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

  useEffect(() => {
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
  }, [editingCar, form, open]);

  const handleSubmit = (data: CarFormValues) => {
    if (data.video === "") {
      data.video = undefined;
    }
    
    const allImages = [data.image, ...additionalImages];
    
    onSubmit(data, features, allImages, insights);
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
              <CarFormFields form={form} editingCar={!!editingCar} />

              <Accordion type="multiple" className="w-full mt-6 border rounded-md">
                <AccordionItem value="additional-images">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <ImagesIcon className="h-5 w-5" />
                      <span>Additional Images (Carousel)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ImagesForm 
                      additionalImages={additionalImages} 
                      setAdditionalImages={setAdditionalImages} 
                    />
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
                    <InsightsForm 
                      insights={insights} 
                      setInsights={setInsights} 
                    />
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
                    <FeatureForm 
                      features={features} 
                      setFeatures={setFeatures} 
                    />
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
