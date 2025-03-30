
import { ArrowDown, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fadeInUp, scaleIn } from '@/utils/animations';

const Hero = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations timeline
    const tl = gsap.timeline();
    
    if (badgeRef.current) {
      tl.add(fadeInUp(badgeRef.current, 0, 0.8));
    }
    
    if (titleRef.current) {
      tl.add(fadeInUp(titleRef.current, 0.2, 0.8), "-=0.5");
    }
    
    if (subtitleRef.current) {
      tl.add(fadeInUp(subtitleRef.current, 0.4, 0.8), "-=0.5");
    }
    
    if (buttonsRef.current) {
      tl.add(fadeInUp(buttonsRef.current, 0.6, 0.8), "-=0.5");
    }
    
    if (scrollIndicatorRef.current) {
      tl.add(fadeInUp(scrollIndicatorRef.current, 1, 0.8), "-=0.3");
    }

    if (decorRef.current) {
      tl.add(scaleIn(decorRef.current, 0.8, 1), "-=0.7");
    }

    // Parallax scroll effect
    const handleScroll = () => {
      if (!backgroundRef.current || !contentRef.current) return;
      
      const scrollY = window.scrollY;
      const opacity = Math.max(1 - scrollY / 700, 0);
      const translateY = scrollY * 0.5;
      
      backgroundRef.current.style.opacity = opacity.toString();
      backgroundRef.current.style.transform = `translateY(${translateY}px)`;
      contentRef.current.style.opacity = opacity.toString();
      contentRef.current.style.transform = `translateY(${-translateY * 0.3}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Premium gradient background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-indigo-900/80"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        {/* Premium luxury car background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536700503543-1e56e5c3a1e6')] bg-cover bg-center opacity-40" />
        
        {/* Overlay with subtle grain texture */}
        <div className="absolute inset-0 bg-black/20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/%3E%3C/svg%3E")'}} />
        
        {/* Decorative elements */}
        <div ref={decorRef} className="absolute w-[800px] h-[800px] top-[-200px] right-[-200px] rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl opacity-0" />
        <div ref={decorRef} className="absolute w-[600px] h-[600px] bottom-[-200px] left-[-200px] rounded-full bg-gradient-to-tr from-amber-500/10 to-rose-500/10 blur-3xl opacity-0" />
      </div>
      
      <div 
        ref={contentRef}
        className="relative h-full flex flex-col items-center justify-center text-center px-4"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        <div className="max-w-5xl mx-auto">
          <div 
            ref={badgeRef} 
            className="inline-flex items-center mb-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium opacity-0"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
            Luxury Transportation Redefined
          </div>
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight opacity-0 tracking-tight"
          >
            Experience the Epitome of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400">
              Luxury Travel
            </span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto opacity-0"
          >
            Indulge in extraordinary journeys with our curated collection of premium vehicles, offering unparalleled comfort and sophistication.
          </p>
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0"
          >
            <button className="rounded-md px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium transition-all hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 hover:scale-105 duration-300">
              Explore Our Fleet
            </button>
            <button className="rounded-md px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 font-medium text-white transition-all hover:bg-white/20 hover:-translate-y-1 hover:scale-105 duration-300">
              Learn More
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollIndicatorRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-0"
        >
          <ArrowDown className="h-6 w-6 text-white" />
          <span className="sr-only">Scroll down</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
