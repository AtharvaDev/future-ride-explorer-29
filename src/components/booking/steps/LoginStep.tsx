
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface LoginStepProps {
  onLoginWithGoogle: () => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean;
  onContinue: () => void;
}

const LoginStep: React.FC<LoginStepProps> = ({
  onLoginWithGoogle,
  isLoading,
  isLoggedIn,
  onContinue
}) => {
  console.log("Rendering LoginStep, isLoggedIn:", isLoggedIn);
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h2 className="text-2xl font-bold mb-6">Login to Continue</h2>
      
      {isLoggedIn ? (
        <div className="text-center mb-6">
          <p className="mb-4">You're already logged in! You can continue to the next step.</p>
          <Button onClick={onContinue} className="w-full">
            Continue
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <Button 
            onClick={onLoginWithGoogle}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}
            Continue with Google
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Login to manage your bookings and access exclusive features
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginStep;
