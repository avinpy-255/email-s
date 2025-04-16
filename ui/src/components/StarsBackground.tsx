
import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkling: number;
  twinkleSpeed: number;
};

const StarsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    const stars: Star[] = [];
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 3000); // Increased density
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.7, // Smaller stars
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.2 + 0.1, // Faster movement
        twinkling: Math.random() * Math.PI,
        twinkleSpeed: Math.random() * 0.05 + 0.02
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        // Update star position (faster movement)
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Calculate twinkling effect
        star.twinkling += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinkling) + 1) / 2 * 0.5 + 0.5;
        const currentOpacity = star.opacity * twinkle;
        
        // Draw the star
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
    />
  );
};

export default StarsBackground;
