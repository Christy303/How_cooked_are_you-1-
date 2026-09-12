import React, { useEffect, useRef } from 'react';

export default function FireParticleCanvas({ intensity = 50 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle count scales with intensity (20 particles at low, 120 at high)
    const normalizedIntensity = Math.min(100, Math.max(10, intensity));
    const particleCount = Math.floor(25 + (normalizedIntensity / 100) * 100);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      size: Math.random() * 4 + 1.5,
      speedY: (Math.random() * 2 + 1) * (0.8 + normalizedIntensity / 50),
      speedX: (Math.random() - 0.5) * 1.5,
      alpha: Math.random() * 0.8 + 0.2,
      decay: Math.random() * 0.008 + 0.003,
      // Color shifts from yellow/orange to deep red/purple at max intensity
      hue: normalizedIntensity > 85 ? (Math.random() > 0.5 ? 280 : 15) : (Math.random() * 35 + 10)
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
        p.alpha -= p.decay;

        if (p.y < -20 || p.alpha <= 0) {
          p.x = Math.random() * width;
          p.y = height + Math.random() * 50;
          p.alpha = Math.random() * 0.7 + 0.3;
          p.size = Math.random() * 4 + 1.5;
          p.speedY = (Math.random() * 2 + 1) * (0.8 + normalizedIntensity / 50);
          p.hue = normalizedIntensity > 85 ? (Math.random() > 0.5 ? 280 : 15) : (Math.random() * 35 + 10);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65
      }}
    />
  );
}
