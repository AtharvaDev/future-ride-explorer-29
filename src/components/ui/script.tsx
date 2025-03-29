
import React, { useEffect } from 'react';

interface ScriptProps {
  src: string;
  id?: string;
  async?: boolean;
  defer?: boolean;
}

const Script: React.FC<ScriptProps> = ({ src, id, async = true, defer = false }) => {
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.getElementById(id || src);
    if (existingScript) return;

    // Create script element
    const script = document.createElement('script');
    script.src = src;
    if (id) script.id = id;
    script.async = async;
    script.defer = defer;
    
    // Append to document head
    document.head.appendChild(script);

    // Clean up
    return () => {
      if (id) {
        const scriptToRemove = document.getElementById(id);
        if (scriptToRemove) document.head.removeChild(scriptToRemove);
      }
    };
  }, [src, id, async, defer]);

  return null;
};

export default Script;
