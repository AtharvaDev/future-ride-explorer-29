
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Ensure we have an element to render to
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create the root and render the app
const root = createRoot(rootElement);
root.render(<App />);
