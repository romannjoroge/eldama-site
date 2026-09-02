"use client";

import { useEffect, useRef } from "react";

interface Vec {
  x: number;
  y: number;
}

interface OrganicFlowProps {
  /** Node positions as percentages (0–100) of the square canvas. */
  positions: Vec[];
  active?: number | null;
  className?: string;
}

/**
 * A living, organic "energy field" rendered on canvas:
 *  - soft water ripples radiating from the hub,
 *  - particles flowing along gently undulating bezier curves (per-node),
 *  - faint ambient drifters meandering like current in water.
 *
 * The curves wave over time (their control point breathes with a sine), and
 * each particle wobbles perpendicular to its path — a Sebastian-Lague-style
 * flowing field rather than a plotted diagram.
 */
export function OrganicFlow({
  positions,
  active = null,
  className = "",
}: OrganicFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const positionsRef = useRef(positions);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let time = 0;

    interface FlowParticle {
      edge: number;
      t: number;
      dir: number;
      speed: number;
      phase: number;
      size: number;
      px: number;
      py: number;
    }
    interface Ambient {
      x: number;
      y: number;
      phase: number;
      size: number;
    }

    let flow: FlowParticle[] = [];
    let ambient: Ambient[] = [];
    const ripples: { start: number; maxR: number }[] = [];
    let lastRipple = 0;

    const center = (): Vec => ({ x: width / 2, y: height / 2 });

    const nodePoints = (): Vec[] => {
      const pos = positionsRef.current;
      return pos.map((p) => ({ x: (p.x / 100) * width, y: (p.y / 100) * height }));
    };

    // Breathing bezier control point (the curve waves over time).
    const control = (p0: Vec, p1: Vec, i: number): Vec => {
      const mx = (p0.x + p1.x) / 2;
      const my = (p0.y + p1.y) / 2;
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const bend = (i % 2 === 0 ? 1 : -1) * width * 0.055;
      const wave = Math.sin(time * 0.7 + i * 1.3) * width * 0.02;
      return { x: mx + nx * (bend + wave), y: my + ny * (bend + wave) };
    };

    const bezier = (p0: Vec, c: Vec, p1: Vec, t: number): Vec => {
      const u = 1 - t;
      return {
        x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
        y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nodes = nodePoints();
      flow = [];
      nodes.forEach((_, i) => {
        for (let k = 0; k < 14; k++) {
          const dir = k % 3 === 0 ? -1 : 1;
          flow.push({
            edge: i,
            t: Math.random(),
            dir,
            speed: 0.00022 + Math.random() * 0.0003,
            phase: Math.random() * Math.PI * 2,
            size: 0.7 + Math.random() * 1.3,
            px: 0,
            py: 0,
          });
        }
      });
      ambient = Array.from({ length: 26 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        phase: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 1.2,
      }));

      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const c = center();
      const nodes = nodePoints();

      // Expanding water ripples from the hub
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const progress = (time - rp.start) / 2.4;
        if (progress > 1) {
          ripples.splice(i, 1);
          continue;
        }
        const eased = 1 - Math.pow(1 - progress, 2.2);
        const radius = rp.maxR * eased;
        const alpha = (1 - progress) * 0.32;
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(122,180,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.1 * (1 - progress) + 0.25;
        ctx.stroke();
      }

      // Flowing particles along the undulating curves
      for (const p of flow) {
        const n = nodes[p.edge];
        if (!n) continue;
        const ctrl = control(c, n, p.edge);
        const pos = bezier(c, ctrl, n, p.t);

        const dx = n.x - c.x;
        const dy = n.y - c.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const wobble = Math.sin(time * (1.4 + p.phase) + p.phase * 3) * 6;
        const px = pos.x + nx * wobble;
        const py = pos.y + ny * wobble;

        // Streak trail from previous position
        if (p.px || p.py) {
          const isActive = activeRef.current === p.edge;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(px, py);
          ctx.strokeStyle = isActive
            ? "rgba(180,214,255,0.9)"
            : "rgba(122,180,255,0.5)";
          ctx.lineWidth = p.size * 0.9;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        p.px = px;
        p.py = py;

        p.t += p.speed * p.dir;
        if (p.t > 1 || p.t < 0) {
          p.t = p.t > 1 ? p.t - 1 : p.t + 1;
          p.px = 0;
          p.py = 0;
        }
      }

      // Ambient drifters — meandering current, not a grid
      for (const a of ambient) {
        const ang =
          Math.sin(a.x * 0.004 + time * 0.4 + a.phase) * 3 +
          Math.sin(a.y * 0.003 - time * 0.3) * 2;
        a.x += Math.cos(ang) * 0.4;
        a.y += Math.sin(ang) * 0.4;
        if (a.x < -10) a.x = width + 10;
        if (a.x > width + 10) a.x = -10;
        if (a.y < -10) a.y = height + 10;
        if (a.y > height + 10) a.y = -10;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(122,180,255,0.35)";
        ctx.fill();
      }
    };

    const loop = () => {
      time += 0.016;
      if (time - lastRipple > 1.15) {
        ripples.push({ start: time, maxR: Math.max(width, height) * 0.55 });
        lastRipple = time;
      }
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };

    // Pause when off-screen or tab hidden — saves CPU when the diagram isn't visible.
    let running = false;
    let visible = true;
    const syncRun = () => {
      const shouldRun = visible && !document.hidden && !reduce;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        syncRun();
      },
      { threshold: 0.01 },
    );
    const onVis = () => syncRun();

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    io.observe(canvas);
    if (reduce) {
      draw();
    } else {
      syncRun();
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
