
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UI_STRINGS } from '@/constants/uiStrings';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="glass-panel p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{UI_STRINGS.NOT_FOUND.TITLE}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {UI_STRINGS.NOT_FOUND.SUBTITLE}
        </p>
        <Button asChild className="inline-flex items-center">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {UI_STRINGS.NOT_FOUND.RETURN_HOME}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
