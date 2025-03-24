
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
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617650728469-c47a6aa69fc7')] bg-cover bg-center opacity-30" />
      </div>
      
      <div 
        ref={contentRef}
        className="relative h-full flex flex-col items-center justify-center text-center px-4"
        style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
      >
        <div className="max-w-5xl mx-auto">
          <div 
            ref={badgeRef} 
            className="inline-block mb-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium opacity-0"
          >
            The future of transportation awaits
          </div>
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight opacity-0"
          >
            Experience the Future of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              Premium Mobility
            </span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto opacity-0"
          >
            Book cutting-edge vehicles with advanced features and unmatched comfort for your journey.
          </p>
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0"
          >
            <button className="rounded-lg px-6 py-3 bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 hover:-translate-y-1 hover:scale-105 duration-300">
              Explore Fleet
            </button>
            <button className="rounded-lg px-6 py-3 bg-white/10 backdrop-blur-sm border border-gray-200/30 font-medium transition-all hover:bg-white/20 hover:-translate-y-1 hover:scale-105 duration-300">
              Learn More
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollIndicatorRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-0"
        >
          <ArrowDown className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="sr-only">Scroll down</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
