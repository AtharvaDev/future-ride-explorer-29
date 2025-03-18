
import React from 'react';
import { ArrowLeft, CreditCard, IndianRupee } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const upiFormSchema = z.object({
  upiId: z.string().min(5, {
    message: "Please enter a valid UPI ID.",
  }),
});

export type UpiFormData = z.infer<typeof upiFormSchema>;

interface PaymentStepProps {
  tokenAmount: number;
  onSubmit: (data: UpiFormData) => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ tokenAmount, onSubmit, onBack }) => {
  const upiForm = useForm<UpiFormData>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: "",
    },
  });

  return (
    <div className="step-container space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Options</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select your preferred payment method to pay the token amount of ₹{tokenAmount.toLocaleString()}.
        </p>
      </div>
      
      <Tabs defaultValue="upi" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upi" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            UPI
          </TabsTrigger>
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upi" className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm">
              Pay using any UPI app like Google Pay, PhonePe, Paytm, or BHIM UPI.
            </p>
          </div>
          
          <Form {...upiForm}>
            <form onSubmit={upiForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={upiForm.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@bankname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full pay-btn">
                  Pay ₹{tokenAmount.toLocaleString()} with UPI
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="card" className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm">
              This is a demo. In a real application, this would integrate with a payment gateway.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full" 
              onClick={() => {
                toast("Card payment is not available in this demo. Please use UPI.");
              }}
            >
              Pay ₹{tokenAmount.toLocaleString()} with Card
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
