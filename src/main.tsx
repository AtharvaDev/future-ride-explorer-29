
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

createRoot(document.getElementById("root")!).render(<App />);
