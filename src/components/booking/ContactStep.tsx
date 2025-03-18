
import React from 'react';
import { Check, Mail, Phone, User, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import gsap from 'gsap';
import { toast } from 'sonner';

// Define the form schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactStepProps {
  onSubmit: (data: ContactFormData) => void;
  defaultValues?: ContactFormData;
  googleSignedIn: boolean;
  onGoogleSignIn: () => void;
}

const ContactStep: React.FC<ContactStepProps> = ({ 
  onSubmit, 
  defaultValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
  googleSignedIn,
  onGoogleSignIn
}) => {
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues
  });

  return (
    <div className="step-container space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Contact Information</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please provide your contact details for booking confirmation.
        </p>
      </div>

      {!googleSignedIn && (
        <div className="mb-6">
          <Button 
            className="w-full google-btn flex items-center justify-center space-x-2" 
            variant="outline"
            onClick={onGoogleSignIn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            <span>Sign in with Google</span>
          </Button>
        </div>
      )}

      {googleSignedIn && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium">Signed in with Google</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Google account details have been pre-filled.</p>
            </div>
          </div>
        </div>
      )}

      <Form {...contactForm}>
        <form onSubmit={contactForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={contactForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="John Doe" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={contactForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="john@example.com" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={contactForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="9876543210" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={contactForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="next-btn">
              Continue to Dates
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactStep;
