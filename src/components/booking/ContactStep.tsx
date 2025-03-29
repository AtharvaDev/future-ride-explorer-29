
import React, { useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingContactInfo } from '@/types/booking';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  startCity: z.string().min(2, {
    message: "Starting city must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  specialRequests: z.string().optional(),
});

export type ContactFormData = z.infer<typeof formSchema>;

interface ContactStepProps {
  initialValues?: Partial<ContactFormData>;
  onSubmit: (data: BookingContactInfo) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const ContactStep: React.FC<ContactStepProps> = ({ initialValues, onSubmit, onBack, isLoading = false }) => {
  const { user, updateUserPhone } = useAuth();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      startCity: "",
      address: "",
      specialRequests: "",
    },
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof ContactFormData, value);
        }
      });
      
      if (initialValues.name && initialValues.email) {
        toast.info("Contact information auto-populated from your account");
      }
    }
  }, [initialValues, form]);
  
  // Fetch additional user data if needed
  useEffect(() => {
    if (user && !initialValues?.phone && user.phone) {
      form.setValue('phone', user.phone);
    }
  }, [user, form, initialValues]);

  const handleSubmit = async (data: ContactFormData) => {
    // If user is logged in and phone number has changed, update it in their profile
    if (user && user.phone !== data.phone) {
      try {
        await updateUserPhone(data.phone);
      } catch (error) {
        console.error("Failed to update phone number:", error);
        // Continue with submission even if profile update fails
      }
    }
    
    onSubmit(data as BookingContactInfo);
  };

  return (
    <div className="step-container space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Contact Information</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please provide your details for the booking.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="startCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting City</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requirements or instructions?" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className={onBack ? "" : "ml-auto"}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactStep;
