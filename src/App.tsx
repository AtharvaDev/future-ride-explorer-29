
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import { cars as defaultCars } from "./data/cars";
import { initializeDefaultCars } from "./services/carService";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase with default car data
    const setupFirebase = async () => {
      try {
        console.log("Setting up Firebase with default data...");
        await initializeDefaultCars(defaultCars);
        setIsInitialized(true);
        console.log("Firebase setup complete!");
      } catch (error) {
        console.error("Error initializing Firebase data:", error);
        toast.error("Failed to initialize default car data. Please refresh the page.");
        // Set initialized anyway to show the UI even if there was an error
        setIsInitialized(true);
      }
    };
    
    setupFirebase();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p>Loading car information...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking/:carId?" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
