"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  className?: string;
  density?: number;
  maxDistance?: number;
  dotColor?: string;
  lineColor?: string;
}

/**
 * Animated network-of-nodes canvas. Nodes drift slowly and connect to nearby
 * neighbours (and the cursor) with fading lines — a subtle "live network"
 * backdrop for the hero. Renders a single static frame under reduced motion.
 */
export function ParticleField({
  className = "",
  density = 45,
  maxDistance = 130,
  dotColor = "rgba(255,255,255,0.5)",
  lineColor = "rgba(41,110,249,0.35)",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 160) {
          p.vx += (dxm / dm) * 0.025;
          p.vy += (dym / dm) * 0.025;
        }
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = 0.8;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = (1 - d / maxDistance) * 0.7;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 180) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "rgba(41,110,249,0.55)";
          ctx.globalAlpha = (1 - dm / 180) * 0.6;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(12, Math.min(density, Math.round((width * height) / 20000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
      }));
      if (reduce) draw();
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [density, maxDistance, dotColor, lineColor]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
