
import { ArrowDown } from 'lucide-react';
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
  const decorationRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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

    if (decorationRef.current) {
      tl.add(scaleIn(decorationRef.current, 0.8, 1.2), "-=0.8");
    }

    // Glow animation
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // Floating animation for elements
    const floatingAnimation = () => {
      gsap.to(titleRef.current, {
        y: "+=10",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(badgeRef.current, {
        y: "+=5",
        x: "+=3",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    };
    
    floatingAnimation();

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
      {/* Premium background with overlay */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-black/70"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631382135106-9e6367caf534')] bg-cover bg-center opacity-60" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50" />
        
        {/* Glow effect */}
        <div 
          ref={glowRef} 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-[100px] opacity-50"
        ></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-500/20 blur-[80px] opacity-40"></div>
      </div>
      
      <div 
        ref={contentRef}
        className="relative h-full flex flex-col items-center justify-center text-center px-4"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        {/* Decorative elements - Removed all circles and decorative elements */}
        <div 
          ref={decorationRef}
          className="absolute inset-0 pointer-events-none opacity-30"
        >
          {/* Vertical lines are kept */}
          <div className="absolute top-1/4 left-20 w-1 h-20 bg-gradient-to-b from-white/0 via-white/30 to-white/0"></div>
          <div className="absolute top-1/3 right-40 w-1 h-40 bg-gradient-to-b from-white/0 via-white/20 to-white/0"></div>
        </div>

        <div className="max-w-5xl mx-auto z-10">
          <div 
            ref={badgeRef} 
            className="inline-block mb-8 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium opacity-0"
          >
            Luxury Transportation Redefined
          </div>
          
          <h1 
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight opacity-0 tracking-tighter"
          >
            Experience the Future of{" "}
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                Premium Mobility
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-70 rounded-full"></span>
            </span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto opacity-0"
          >
            Book luxurious vehicles with advanced features and unmatched comfort for your journey.
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 opacity-0"
          >
            <button className="rounded-lg px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:scale-105 duration-300">
              Explore Fleet
            </button>
            <button className="rounded-lg px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium transition-all hover:bg-white/20 hover:-translate-y-1 hover:scale-105 duration-300">
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
