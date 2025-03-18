
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Hero = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            The future of transportation awaits
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Experience the Future of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              Premium Mobility
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Book cutting-edge vehicles with advanced features and unmatched comfort for your journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="rounded-lg px-6 py-3 bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 hover:-translate-y-0.5">
              Explore Fleet
            </button>
            <button className="rounded-lg px-6 py-3 bg-white/10 backdrop-blur-sm border border-gray-200/30 font-medium transition-all hover:bg-white/20 hover:-translate-y-0.5">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <span className="sr-only">Scroll down</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
