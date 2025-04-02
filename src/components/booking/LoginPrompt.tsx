
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn } from "lucide-react";
import { UI_STRINGS } from '@/constants/uiStrings';

interface LoginPromptProps {
  onLogin?: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login', { state: { returnUrl: window.location.pathname } });
    }
  };

  return (
    <Alert className="mt-6 border-blue-400 bg-blue-50 dark:bg-blue-900/20">
      <LogIn className="h-5 w-5 text-blue-500" />
      <AlertTitle className="text-blue-700 dark:text-blue-300">
        {UI_STRINGS.BOOKING.LOGIN_PROMPT.TITLE}
      </AlertTitle>
      <AlertDescription className="text-blue-600 dark:text-blue-400">
        <p className="mb-4">
          {UI_STRINGS.BOOKING.LOGIN_PROMPT.MESSAGE}
        </p>
        <Button 
          onClick={handleLoginClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <LogIn className="h-4 w-4 mr-2" />
          {UI_STRINGS.BOOKING.BUTTONS.SIGN_IN_TO_CONTINUE}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LoginPrompt;
