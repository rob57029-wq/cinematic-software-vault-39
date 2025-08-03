
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const initParticles = () => {
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      particlesRef.current = [];

      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3.5 + 0.5,
          color: getRandomColor(),
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1,
          opacity: 0.1 + Math.random() * 0.3,
          pulse: 0,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    };

    const getRandomColor = () => {
      const colors = [
        `rgba(30, 100, 200, 0.5)`,  // Blue
        `rgba(60, 80, 220, 0.5)`,   // Indigo
        `rgba(120, 60, 220, 0.5)`,  // Purple
        `rgba(30, 180, 220, 0.5)`,  // Light blue
        `rgba(70, 150, 230, 0.5)`   // Sky blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouseX = mousePositionRef.current.x;
      const mouseY = mousePositionRef.current.y;
      const mouseRadius = 100;
      
      particlesRef.current.forEach(particle => {
        // Update pulse effect
        particle.pulse += particle.pulseSpeed;
        if (particle.pulse > Math.PI * 2) {
          particle.pulse = 0;
        }
        
        // Apply pulse to radius and opacity
        const pulseEffect = Math.sin(particle.pulse) * 0.5 + 0.5;
        const radiusPulse = particle.radius * (1 + 0.2 * pulseEffect);
        const opacityPulse = particle.opacity * (0.7 + 0.3 * pulseEffect);
        
        // Interaction with mouse
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If mouse is close, gently push particles away
        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          particle.vx -= dx * force * 0.01;
          particle.vy -= dy * force * 0.01;
        }
        
        // Speed limit
        const maxSpeed = 0.7;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }
        
        // Draw particle with pulse effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radiusPulse, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.5', opacityPulse.toString());
        ctx.fill();
        
        // Add a subtle glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radiusPulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.5', (opacityPulse * 0.3).toString());
        ctx.fill();
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges with dampening
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = particle.x < 0 ? 0 : canvas.width;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = particle.y < 0 ? 0 : canvas.height;
        }
        
        // Small random movement for more natural flow
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default ParticleBackground;
