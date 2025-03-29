
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, IndianRupee, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Script from "@/components/ui/script";

const upiFormSchema = z.object({
  upiId: z.string().min(5, {
    message: "Please enter a valid UPI ID.",
  }),
});

export type UpiFormData = z.infer<typeof upiFormSchema>;

interface PaymentStepProps {
  tokenAmount: number;
  onSubmit: (data: UpiFormData & { paymentMethod: string, paymentId?: string }) => void;
  onBack: () => void;
  isLoading?: boolean;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  tokenAmount, 
  onSubmit, 
  onBack,
  isLoading = false,
  contactInfo
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'card'>('upi');
  const [paymentId, setPaymentId] = useState<string>('');
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);

  const upiForm = useForm<UpiFormData>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: "",
    },
  });

  const handleUpiSubmit = (data: UpiFormData) => {
    onSubmit({
      ...data,
      paymentMethod: 'upi'
    });
  };

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoadingRazorpay(true);
    
    try {
      const loaded = await loadRazorpay();
      
      if (!loaded) {
        toast.error("Razorpay SDK failed to load. Please try again later.");
        setLoadingRazorpay(false);
        return;
      }
      
      // Razorpay options
      const options = {
        key: "rzp_test_YourTestKey", // Replace with your Razorpay key
        amount: tokenAmount * 100, // Amount in paise
        currency: "INR",
        name: "Future Ride",
        description: "Booking Token Amount",
        image: "/logo.png", // Replace with your logo
        prefill: {
          name: contactInfo?.name || "",
          email: contactInfo?.email || "",
          contact: contactInfo?.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: function (response: any) {
          // Handle success
          setPaymentId(response.razorpay_payment_id);
          toast.success("Payment successful!");
          
          // Submit the form with payment details
          onSubmit({
            upiId: "",
            paymentMethod: "razorpay",
            paymentId: response.razorpay_payment_id
          });
        },
      };
      
      // Create and open Razorpay
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.error(response.error);
      });
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoadingRazorpay(false);
    }
  };

  return (
    <div className="step-container space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Options</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select your preferred payment method to pay the token amount of ₹{tokenAmount.toLocaleString()}.
        </p>
      </div>
      
      <Tabs defaultValue="razorpay" className="w-full" onValueChange={(value) => setPaymentMethod(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="razorpay" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Razorpay
          </TabsTrigger>
          <TabsTrigger value="upi" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            UPI
          </TabsTrigger>
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="razorpay" className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm">
              Pay securely using Razorpay. You'll be redirected to the Razorpay payment page.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full" 
              onClick={handleRazorpayPayment}
              disabled={loadingRazorpay || isLoading}
            >
              {loadingRazorpay ? "Processing..." : `Pay ₹${tokenAmount.toLocaleString()} with Razorpay`}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="upi" className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <p className="text-sm">
              Pay using any UPI app like Google Pay, PhonePe, Paytm, or BHIM UPI.
            </p>
          </div>
          
          <Form {...upiForm}>
            <form onSubmit={upiForm.handleSubmit(handleUpiSubmit)} className="space-y-4">
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
                <Button 
                  type="submit" 
                  className="w-full pay-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Pay ₹${tokenAmount.toLocaleString()} with UPI`}
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
                toast("Card payment is not available in this demo. Please use UPI or Razorpay.");
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
