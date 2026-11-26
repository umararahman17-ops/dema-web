'use client';

import { useEffect, useRef, useState } from 'react';

const SWARM_COUNT = 20;
const IDLE_FADE_MS = 2200;
const LINK_DISTANCE = 48;

const THEME_PALETTES = {
  dark: {
    primary: [
      '52, 211, 153',  // #34d399
      '34, 197, 94',   // #22c55e
      '16, 185, 129',  // #10b981
    ],
    accent: '245, 126, 61', // #f57e3d
    coreAlpha: 0.78,
    trailAlpha: 0.36,
    linkAlpha: 0.14,
  },
  light: {
    primary: [
      '21, 128, 61',   // #15803d
      '30, 107, 55',   // #1e6b37
      '5, 150, 105',   // #059669
    ],
    accent: '224, 99, 31', // #e0631f
    coreAlpha: 0.72,
    trailAlpha: 0.34,
    linkAlpha: 0.14,
  },
};

const INTERACTIVE_SELECTOR =
  'a[href], button, input, select, textarea, [role="button"], [role="tab"], label[for]';

/**
 * Ambient canvas-based swarm cursor overlay for fine-pointer devices.
 * Uses damped orbital flocking, idles to sleep cleanly to save battery,
 * and disables itself on touch screens or prefers-reduced-motion: reduce.
 */
export default function SwarmCursor() {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateEligibility = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    evaluateEligibility();

    pointerQuery.addEventListener?.('change', evaluateEligibility);
    motionQuery.addEventListener?.('change', evaluateEligibility);

    return () => {
      pointerQuery.removeEventListener?.('change', evaluateEligibility);
      motionQuery.removeEventListener?.('change', evaluateEligibility);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(viewportW * dpr));
      canvas.height = Math.max(1, Math.floor(viewportH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    let currentTheme =
      document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

    const themeObserver = new MutationObserver(() => {
      currentTheme =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const boids = Array.from({ length: SWARM_COUNT }, (_, i) => {
      const isAccent = i % 5 === 0;
      const tier = i % 3;
      return {
        x: viewportW * 0.5,
        y: viewportH * 0.5,
        prevX: viewportW * 0.5,
        prevY: viewportH * 0.5,
        vx: 0,
        vy: 0,
        angle: (Math.PI * 2 * i) / SWARM_COUNT,
        orbitSpeed: (0.018 + (i % 4) * 0.006) * (i % 2 === 0 ? 1 : -1),
        orbitRadius: 11 + tier * 10 + (i % 5) * 3.5,
        stiffness: 0.055 + (i % 4) * 0.015,
        damping: 0.78 + (i % 3) * 0.025,
        radius: 1.55 + (tier === 0 ? 1.15 : tier === 1 ? 0.55 : 0),
        isAccent,
        colorIndex: i % 3,
      };
    });

    const pointer = {
      x: viewportW * 0.5,
      y: viewportH * 0.5,
      initialized: false,
      inside: false,
      hoveringInteractive: false,
      lastActiveAt: 0,
    };

    let masterOpacity = 0;
    let burstScale = 1;
    let rafId = null;

    const startLoop = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(tick);
    };

    const tick = (now) => {
      rafId = null;

      const idleElapsed = now - pointer.lastActiveAt;
      const shouldBeVisible = pointer.initialized && pointer.inside && idleElapsed < IDLE_FADE_MS;
      const targetOpacity = shouldBeVisible ? 1 : 0;

      masterOpacity += (targetOpacity - masterOpacity) * (shouldBeVisible ? 0.18 : 0.07);
      burstScale += (1 - burstScale) * 0.1;

      ctx.clearRect(0, 0, viewportW, viewportH);

      if (!shouldBeVisible && masterOpacity < 0.008) {
        masterOpacity = 0;
        return;
      }

      const palette = THEME_PALETTES[currentTheme];
      const orbitMultiplier = (pointer.hoveringInteractive ? 0.68 : 1) * burstScale;
      const maxLinkSq = LINK_DISTANCE * LINK_DISTANCE;

      // Update positions & orbital spring forces
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        b.prevX = b.x;
        b.prevY = b.y;
        b.angle += b.orbitSpeed;

        const targetX = pointer.x + Math.cos(b.angle) * b.orbitRadius * orbitMultiplier;
        const targetY = pointer.y + Math.sin(b.angle) * b.orbitRadius * orbitMultiplier;

        b.vx += (targetX - b.x) * b.stiffness;
        b.vy += (targetY - b.y) * b.stiffness;

        // Gentle pairwise separation so swarm stays distinct
        for (let j = i + 1; j < boids.length; j++) {
          const other = boids[j];
          const dx = b.x - other.x;
          const dy = b.y - other.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0.01 && distSq < 256) {
            const dist = Math.sqrt(distSq);
            const push = ((16 - dist) / 16) * 0.24;
            const nx = dx / dist;
            const ny = dy / dist;
            b.vx += nx * push;
            b.vy += ny * push;
            other.vx -= nx * push;
            other.vy -= ny * push;
          }
        }

        b.vx *= b.damping;
        b.vy *= b.damping;
        b.x += b.vx;
        b.y += b.vy;
      }

      // Draw fine synaptic connections between adjacent swarm particles
      ctx.lineWidth = 0.85;
      for (let i = 0; i < boids.length; i++) {
        const a = boids[i];
        const rgbA = a.isAccent ? palette.accent : palette.primary[a.colorIndex];
        for (let j = i + 1; j < boids.length; j++) {
          const b = boids[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxLinkSq) {
            const strength = 1 - Math.sqrt(distSq) / LINK_DISTANCE;
            ctx.strokeStyle = `rgba(${rgbA}, ${(strength * palette.linkAlpha * masterOpacity).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw motion wakes & glowing micro-particles
      ctx.lineCap = 'round';
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const rgb = b.isAccent ? palette.accent : palette.primary[b.colorIndex];

        ctx.strokeStyle = `rgba(${rgb}, ${(palette.trailAlpha * masterOpacity).toFixed(3)})`;
        ctx.lineWidth = b.radius * 1.1;
        ctx.beginPath();
        ctx.moveTo(b.prevX, b.prevY);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(${rgb}, ${(palette.coreAlpha * masterOpacity).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') return;

      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      pointer.lastActiveAt = performance.now();

      const targetEl = e.target;
      pointer.hoveringInteractive = Boolean(
        targetEl && typeof targetEl.closest === 'function' && targetEl.closest(INTERACTIVE_SELECTOR)
      );

      if (!pointer.initialized) {
        pointer.initialized = true;
        for (let i = 0; i < boids.length; i++) {
          const b = boids[i];
          const sx = pointer.x + Math.cos(b.angle) * b.orbitRadius;
          const sy = pointer.y + Math.sin(b.angle) * b.orbitRadius;
          b.x = sx;
          b.y = sy;
          b.prevX = sx;
          b.prevY = sy;
        }
      }

      startLoop();
    };

    const handlePointerDown = (e) => {
      if (e.pointerType === 'touch' || !pointer.initialized) return;

      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      pointer.lastActiveAt = performance.now();
      burstScale = 1.48;

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const dx = b.x - pointer.x;
        const dy = b.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        b.vx += (dx / dist) * 3.4;
        b.vy += (dy / dist) * 3.4;
      }

      startLoop();
    };

    const handleLeaveOrHide = () => {
      pointer.inside = false;
      startLoop();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pointer.inside = false;
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        ctx.clearRect(0, 0, viewportW, viewportH);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('blur', handleLeaveOrHide);
    document.addEventListener('mouseleave', handleLeaveOrHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('blur', handleLeaveOrHide);
      document.removeEventListener('mouseleave', handleLeaveOrHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="swarm-cursor-canvas" aria-hidden="true" />;
}
