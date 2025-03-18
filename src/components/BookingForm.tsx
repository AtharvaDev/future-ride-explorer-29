
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Car } from '@/data/cars';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, CreditCard, ChevronRight, IndianRupee, Mail, Phone, User, ArrowLeft, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, differenceInDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import gsap from 'gsap';
import { Badge } from "@/components/ui/badge";

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

const upiFormSchema = z.object({
  upiId: z.string().min(5, {
    message: "Please enter a valid UPI ID.",
  }),
});

type BookingStep = 'contact' | 'dates' | 'payment' | 'confirmation';

interface BookingFormProps {
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>('contact');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [totalCost, setTotalCost] = useState(car.pricePerDay);
  const [tokenAmount, setTokenAmount] = useState(1000);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Contact form
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // UPI form
  const upiForm = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: "",
    },
  });

  // Calculate the number of days and total cost
  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.max(differenceInDays(endDate, startDate) + 1, 1);
      setNumberOfDays(days);
      setTotalCost(car.pricePerDay * days);
      setTokenAmount(1000 * days);
    }
  }, [startDate, endDate, car.pricePerDay]);

  // Animate step transitions
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        '.step-container',
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }
  }, [currentStep]);

  // Mock Google Sign In
  const handleGoogleSignIn = () => {
    // Animate button
    gsap.to('.google-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    // Simulate loading
    toast.loading('Connecting to Google...');
    
    // Simulate Google auth
    setTimeout(() => {
      setGoogleSignedIn(true);
      toast.success('Signed in with Google');
      
      // Pre-fill the form with mock data
      contactForm.setValue('name', 'John Doe');
      contactForm.setValue('email', 'john.doe@gmail.com');
      contactForm.setValue('phone', '9876543210');
    }, 1500);
  };

  // Handle contact form submission
  const onContactSubmit = (data: z.infer<typeof contactFormSchema>) => {
    // Animate button
    gsap.to('.next-btn', {
      x: 10,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    // Save contact details and move to next step
    setBookingDetails(prev => ({ ...prev, contact: data }));
    setCurrentStep('dates');
  };

  // Handle UPI form submission
  const onUpiSubmit = (data: z.infer<typeof upiFormSchema>) => {
    // Animate button
    gsap.to('.pay-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    // Show payment processing
    toast.loading('Processing payment...');
    
    // Simulate payment processing
    setTimeout(() => {
      setBookingDetails(prev => ({ 
        ...prev, 
        payment: {
          method: 'UPI',
          details: data.upiId,
          amount: tokenAmount,
          transactionId: 'UPI' + Math.random().toString(36).substr(2, 9).toUpperCase()
        },
        booking: {
          carId: car.id,
          carModel: car.model,
          carTitle: car.title,
          startDate: startDate,
          endDate: endDate,
          numberOfDays: numberOfDays,
          totalCost: totalCost,
          tokenAmount: tokenAmount
        }
      }));
      setBookingConfirmed(true);
      setCurrentStep('confirmation');
      toast.success('Payment successful!');

      // Create confetti effect on payment success
      const container = formRef.current;
      if (container) {
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'absolute rounded-full pointer-events-none';
          confetti.style.width = `${Math.random() * 10 + 5}px`;
          confetti.style.height = `${Math.random() * 10 + 5}px`;
          confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
          confetti.style.position = 'absolute';
          confetti.style.zIndex = '50';
          container.appendChild(confetti);
          
          gsap.fromTo(
            confetti,
            {
              x: container.clientWidth / 2,
              y: container.clientHeight / 2,
              opacity: 1
            },
            {
              x: `random(${-container.clientWidth/2}, ${container.clientWidth/2})`,
              y: `random(${-container.clientHeight/2}, ${container.clientHeight/2})`,
              opacity: 0,
              duration: 2,
              ease: 'power2.out',
              onComplete: () => {
                container.removeChild(confetti);
              }
            }
          );
        }
      }
    }, 2000);
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    // Animate button
    gsap.to('.download-btn', {
      y: -5,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    toast.success('Receipt downloaded successfully!');
  };

  // Generate booking reference
  const generateBookingReference = () => {
    const prefix = car.model.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().substring(7);
    return `${prefix}${timestamp}`;
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case 'contact':
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
                  onClick={handleGoogleSignIn}
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
              <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
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
        
      case 'dates':
        return (
          <div className="step-container space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Select Dates</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please select your pickup and return dates.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Select pickup date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date && endDate && date > endDate) {
                            setEndDate(addDays(date, 1));
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Return Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!startDate}
                      >
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Select return date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Booking Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                    <span>{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Daily rate:</span>
                    <span>₹{car.pricePerDay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Token amount:</span>
                    <span>₹{tokenAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total:</span>
                    <span>₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  * A token amount of ₹1,000 per day will be charged at the time of booking.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('contact')}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep('payment')}>
                Continue to Payment
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        );
        
      case 'payment':
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
                  <form onSubmit={upiForm.handleSubmit(onUpiSubmit)} className="space-y-4">
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
              <Button variant="outline" onClick={() => setCurrentStep('dates')}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          </div>
        );
        
      case 'confirmation':
        return (
          <div className="step-container space-y-6">
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your booking has been successfully confirmed. Below is your booking receipt.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold">FutureRide</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Premium Car Rental Service</p>
                </div>
                <Badge className="text-xs">Receipt</Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Booking Reference:</span>
                  <span className="font-medium">{generateBookingReference()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
                  <span className="font-medium">{bookingDetails?.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                  <span>UPI - {bookingDetails?.payment.details}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Payment Date:</span>
                  <span>{format(new Date(), "PPP")}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Vehicle:</span>
                  <span>{car.model} {car.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Pickup Date:</span>
                  <span>{startDate ? format(startDate, "PPP") : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Return Date:</span>
                  <span>{endDate ? format(endDate, "PPP") : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                  <span>{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Daily Rate:</span>
                  <span>₹{car.pricePerDay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Token Amount Paid:</span>
                  <span className="font-medium">₹{tokenAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Balance Due at Pickup:</span>
                  <span>₹{(totalCost - tokenAmount).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
                <Button variant="outline" className="download-btn flex items-center gap-2" onClick={handleDownloadReceipt}>
                  <BookOpen className="h-4 w-4" />
                  Download Receipt
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={formRef} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(['contact', 'dates', 'payment', 'confirmation'] as BookingStep[]).map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep === step 
                      ? "bg-primary text-white" 
                      : (
                        index <= ['contact', 'dates', 'payment', 'confirmation'].indexOf(currentStep) 
                          ? "bg-primary/20 text-primary" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      )
                  )}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-2 hidden sm:block">{
                  step === 'contact' ? 'Contact' : 
                  step === 'dates' ? 'Dates' : 
                  step === 'payment' ? 'Payment' : 
                  'Confirmation'
                }</span>
              </div>
              
              {index < 3 && (
                <div 
                  className={cn(
                    "flex-1 h-1 mx-2",
                    index < ['contact', 'dates', 'payment', 'confirmation'].indexOf(currentStep) 
                      ? "bg-primary" 
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      {renderStep()}
    </div>
  );
};

export default BookingForm;
