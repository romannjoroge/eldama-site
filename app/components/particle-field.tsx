"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  className?: string;
  /** Base particle budget (scaled by area + adaptive quality). */
  density?: number;
  maxDistance?: number;
  glowColor?: string;
  coreColor?: string;
  lineColor?: string;
  activeLineColor?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number; // 0..1 — near particles are bigger/faster and react more
  phase: number;
}

interface Packet {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  t: number;
  speed: number;
}

interface Shock {
  x: number;
  y: number;
  start: number;
  dur: number;
  maxR: number;
}

/**
 * Cutting-edge but GPU-friendly hero backdrop:
 *  - pre-rendered glow sprites + additive blending (no shadowBlur)
 *  - spatial-hash links (near-O(n) instead of O(n²))
 *  - layered-sine flow-field drift, cursor swirl, click shockwaves,
 *    signalling "data packets" travelling node → node
 *  - two depth classes for parallax (near reacts more to the cursor)
 *  - scroll-velocity "wind"
 *  - adaptive quality (FPS watchdog), visibility pause, reduced-motion frame
 */
export function ParticleField({
  className = "",
  density = 110,
  maxDistance = 150,
  glowColor = "rgba(41,110,249,0.5)",
  coreColor = "rgba(228,238,255,0.95)",
  lineColor = "rgba(41,110,249,0.4)",
  activeLineColor = "rgba(150,195,255,0.9)",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: -9999, y: -9999 };
    const isMouse = { value: false };

    let width = 0;
    let height = 0;
    let raf = 0;
    let time = 0;
    let degraded = false;
    let wind = 0;
    let lastScrollY = window.scrollY;

    // ---- cached glow sprites (drawn once, re-used every frame) ----
    const spriteCache = new Map<string, HTMLCanvasElement>();
    const getSprite = (color: string, size = 48) => {
      let s = spriteCache.get(color);
      if (!s) {
        s = document.createElement("canvas");
        s.width = size;
        s.height = size;
        const c = s.getContext("2d")!;
        const toAlpha = (a: number) => color.replace(/[\d.]+\)$/, `${a})`);
        const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        g.addColorStop(0, toAlpha(0.9));
        g.addColorStop(0.35, toAlpha(0.32));
        g.addColorStop(1, toAlpha(0));
        c.fillStyle = g;
        c.fillRect(0, 0, size, size);
        spriteCache.set(color, s);
      }
      return s;
    };
    const glowSprite = getSprite(glowColor);
    const coreSprite = getSprite(coreColor);
    const hotSprite = getSprite(activeLineColor);

    const alphaOf = (color: string, a: number) => color.replace(/[\d.]+\)$/, `${a})`);

    // ---- nodes + spatial hash ----
    let nodes: Node[] = [];
    let cellSize = maxDistance;
    const hash = new Map<number, number[]>();
    const scratch: number[] = [];

    const buildNodes = (count: number) => {
      nodes = Array.from({ length: count }, () => {
        const depth = Math.random() < 0.3 ? 1 : 0.45 + Math.random() * 0.55;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: (0.8 + Math.random() * 1.5) * (0.7 + depth * 0.7),
          depth,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const targetCount = () => {
      const count = Math.max(
        24,
        Math.round(((width * height) / 15000) * (density / 110)),
      );
      return degraded ? Math.round(count * 0.55) : count;
    };

    const rebuild = () => {
      buildNodes(targetCount());
    };

    const keyOf = (kx: number, ky: number) => kx * 73856093 ^ ky * 19349663;

    const reindex = () => {
      hash.clear();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const key = keyOf(Math.floor(n.x / cellSize), Math.floor(n.y / cellSize));
        const arr = hash.get(key);
        if (arr) arr.push(i);
        else hash.set(key, [i]);
      }
    };

    const nearIndices = (n: Node) => {
      scratch.length = 0;
      const kx = Math.floor(n.x / cellSize);
      const ky = Math.floor(n.y / cellSize);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const arr = hash.get(keyOf(kx + dx, ky + dy));
          if (arr) for (let i = 0; i < arr.length; i++) scratch.push(arr[i]);
        }
      }
      return scratch;
    };

    // ---- packets + shockwaves ----
    const packets: Packet[] = [];
    const shocks: Shock[] = [];
    let nextPacketAt = 0;

    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const a = nodes[(Math.random() * nodes.length) | 0];
      const cand = nearIndices(a);
      if (cand.length < 2) return;
      const b = nodes[cand[(Math.random() * cand.length) | 0]];
      if (b === a) return;
      packets.push({
        ax: a.x,
        ay: a.y,
        bx: b.x,
        by: b.y,
        t: 0,
        speed: 0.9 + Math.random() * 0.9,
      });
    };

    const addShock = (x: number, y: number) => {
      // initial scatter keeps the ring crisp while it expands
      shocks.push({
        x,
        y,
        start: time,
        dur: 0.55 + Math.random() * 0.15,
        maxR: 300 + Math.random() * 90,
      });
      for (const n of nodes) {
        const dx = n.x - x;
        const dy = n.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 90) {
          const f = (1 - d / 90) * 2.2;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // scroll "wind" (downward push proportional to scroll velocity)
      const sy = window.scrollY;
      const dy = sy - lastScrollY;
      lastScrollY = sy;
      wind += (Math.max(-2.4, Math.min(2.4, dy * 0.045)) - wind) * 0.1;

      reindex();

      // ---- links ----
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const near = nearIndices(n);
        let links = 0;
        for (let j = 0; j < near.length; j++) {
          const k = near[j];
          if (k <= i) continue;
          const m = nodes[k];
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDistance) {
            const a = (1 - dist / maxDistance) * 0.5;
            ctx.strokeStyle = alphaOf(lineColor, a);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
            if (++links >= 5) break;
          }
        }
      }

      // ---- cursor link lines: nearby nodes visibly connect to the pointer ----
      if (isMouse.value) {
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 200) {
            const a = (1 - d / 200) * 0.55;
            ctx.strokeStyle = alphaOf(activeLineColor, a);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // ---- flow field + cursor field + integrate ----
      for (const n of nodes) {
        const flow =
          Math.sin(n.x * 0.0016 + time * 0.55 + n.y * 0.0011) * 2.1 +
          Math.sin(n.y * 0.0013 - time * 0.42 + n.x * 0.0009) * 1.7;
        n.vx += Math.cos(flow) * 0.006 * n.depth;
        n.vy += Math.sin(flow) * 0.006 * n.depth;
        n.vy += wind * n.depth * 0.06;

        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym) || 1;
        // Strong cling: near the cursor particles stream in and gather around it
        if (dm < 320 && isMouse.value) {
          const strength = n.depth * (dm < 150 ? 0.05 : 0.028 + 0.022 * (1 - dm / 320));
          n.vx += (dxm / dm) * strength * 1.6;
          n.vy += (dym / dm) * strength * 1.6;
          // gentle swirl only very close — keeps them clinging, not orbiting away
          if (dm < 70) {
            const curl = Math.sin(time * 2 + n.phase) * 0.007 * n.depth;
            n.vx += (-dym / dm) * curl;
            n.vy += (dxm / dm) * curl;
          }
        }

        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 1.1) {
          n.vx = (n.vx / sp) * 1.1;
          n.vy = (n.vy / sp) * 1.1;
        }
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -24) n.x = width + 24;
        if (n.x > width + 24) n.x = -24;
        if (n.y < -24) n.y = height + 24;
        if (n.y > height + 24) n.y = -24;
      }

      // ---- draw nodes (additive glow) ----
      ctx.globalCompositeOperation = "lighter";
      for (const n of nodes) {
        const halo = n.r * (degraded ? 3 : 5) * (0.6 + n.depth * 0.6);
        ctx.drawImage(glowSprite, n.x - halo, n.y - halo, halo * 2, halo * 2);
        const core = n.r * (degraded ? 1.4 : 1.9);
        ctx.drawImage(coreSprite, n.x - core, n.y - core, core * 2, core * 2);
      }
      ctx.globalCompositeOperation = "source-over";

      // ---- cursor energy ring ----
      if (isMouse.value) {
        ctx.strokeStyle = alphaOf(activeLineColor, 0.25);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 24 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- shockwave ripples (realistic expanding wavefront) ----
      ctx.globalCompositeOperation = "lighter";
      for (let i = shocks.length - 1; i >= 0; i--) {
        const s = shocks[i];
        const p = Math.min(1, (time - s.start) / s.dur);
        if (p >= 1) {
          shocks.splice(i, 1);
          continue;
        }
        // ease-out expansion
        const e = 1 - Math.pow(1 - p, 3);
        const R = 26 + e * s.maxR;
        const fade = 1 - p;

        // volumetric glow disc behind the wavefront
        ctx.globalAlpha = fade * 0.55;
        const g = R * 1.7;
        ctx.drawImage(glowSprite, s.x - g, s.y - g, g * 2, g * 2);
        ctx.globalAlpha = 1;

        // three crests — bright leading edge, decaying trailing wavelets
        for (let k = 0; k < 3; k++) {
          const rr = R - k * 6.5;
          if (rr < 4) continue;
          const a = Math.max(0, fade * (0.55 - k * 0.14));
          ctx.strokeStyle = alphaOf(activeLineColor, a);
          ctx.lineWidth = Math.max(0.4, (2.6 - k * 0.6) * fade);
          ctx.beginPath();
          ctx.arc(s.x, s.y, rr, 0, Math.PI * 2);
          ctx.stroke();
        }

        // traveling pressure: particles at the wavefront get shoved outward
        const band = 70;
        for (const n of nodes) {
          const dx = n.x - s.x;
          const dy = n.y - s.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d > R && d < R + band) {
            const f = (1 - Math.abs(d - R) / band) * 0.55 * fade * 1.6;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }
      }

      // ---- signalling packets ----
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += 0.016 * p.speed * 1.6;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const e = p.t * p.t * (3 - 2 * p.t);
        const px = p.ax + (p.bx - p.ax) * e;
        const py = p.ay + (p.by - p.ay) * e;
        const s = 8;
        ctx.drawImage(hotSprite, px - s, py - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // ---- main loop (delta-time) ----
    let running = false;
    let last = performance.now();
    let emaMs = 16;
    let checkAcc = 0;
    let visible = true;

    const loop = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      time += dt / 1000;
      emaMs = emaMs * 0.92 + dt * 0.08;
      checkAcc += dt;
      if (checkAcc > 3000) {
        checkAcc = 0;
        if (emaMs > 23 && !degraded) {
          degraded = true;
          rebuild();
        }
      }
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };

    const syncRun = () => {
      const shouldRun = visible && !document.hidden && !reduce;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    // ---- events (window-level so hero overlay divs can't block them) ----
    // Cached canvas rect — the canvas is only visible at the top of the page,
    // so the rect is stable while it runs (updated on resize).
    const rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    const updateRect = () => {
      const r = canvas.getBoundingClientRect();
      rect.left = r.left;
      rect.top = r.top;
      rect.right = r.right;
      rect.bottom = r.bottom;
      rect.width = r.width;
      rect.height = r.height;
    };
    const isInside = (clientX: number, clientY: number) =>
      clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    const onMove = (e: PointerEvent) => {
      if (!isInside(e.clientX, e.clientY)) {
        mouse.x = -9999;
        mouse.y = -9999;
        isMouse.value = false;
        return;
      }
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isMouse.value = true;
    };
    const onDown = (e: PointerEvent) => {
      if (!isInside(e.clientX, e.clientY)) return;
      addShock(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onResize = () => {
      updateRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuild();
      if (reduce) draw();
    };

    // While the hero is partially on screen, scrolling moves the canvas —
    // keep the cached rect in sync (rAF-throttled) so the cursor ring and
    // shockwaves stay glued to the pointer.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateRect();
      });
    };

    // packet spawner tick handled inside draw via time check
    const spawnTick = () => {
      if (time > nextPacketAt && packets.length < 3) {
        spawnPacket();
        nextPacketAt = time + 0.9 + Math.random() * 1.7;
      }
    };

    onResize();

    // hook packet spawning into the loop
    const baseLoop = loop;
    const loopWithPackets = (now: number) => {
      spawnTick();
      baseLoop(now);
    };

    running = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        syncRun();
      },
      { threshold: 0.01 },
    );
    const onVis = () => syncRun();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVis);
    io.observe(canvas);
    if (reduce) {
      draw();
    } else {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loopWithPackets);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      spriteCache.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
