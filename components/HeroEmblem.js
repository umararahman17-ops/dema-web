'use client';

import { useState, useRef, useEffect } from 'react';

// Gentle futuristic chime when toggling (Web Audio API, zero dependencies)
function playChime(enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.35);
    });
  } catch {
    // Graceful silent fallback
  }
}

export default function HeroEmblem() {
  const [is3D, setIs3D] = useState(false);
  const [rotX, setRotX] = useState(10);
  const [rotY, setRotY] = useState(0);

  // 2D Preview Tilt States
  const cardRef = useRef(null);
  const [previewTilt, setPreviewTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const [previewHover, setPreviewHover] = useState(false);

  // 3D Dragging & Momentum
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle 2D Preview Hover
  const handlePreviewMouseMove = (e) => {
    if (is3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setPreviewTilt({
      x: rotateX,
      y: rotateY,
      glowX: (x / rect.width) * 100,
      glowY: (y / rect.height) * 100
    });
  };

  const handlePreviewMouseEnter = () => setPreviewHover(true);
  const handlePreviewMouseLeave = () => {
    setPreviewHover(false);
    setPreviewTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });
  };

  // Toggle 3D on click
  const handleCardClick = () => {
    if (!is3D) {
      setIs3D(true);
      setRotX(12);
      playChime();
    }
  };

  const handle3DContainerClick = () => {
    if (!didDragRef.current) {
      setIs3D(false);
    }
  };

  // Pointer drag for 3D rotation
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    didDragRef.current = false;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;

      const totalDist = Math.hypot(
        e.clientX - pointerStartRef.current.x,
        e.clientY - pointerStartRef.current.y
      );
      if (totalDist > 8) {
        didDragRef.current = true;
      }

      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: dx * 0.4, y: dy * 0.4 };

      setRotY((prev) => (prev + dx * 0.5) % 360);
      setRotX((prev) => Math.max(-60, Math.min(60, prev - dy * 0.4)));
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Continuous Auto-Orbit Loop (Smooth 360 rotation)
  useEffect(() => {
    if (!is3D) return;

    let lastTime = performance.now();
    const updateLoop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isDraggingRef.current) {
        // Continuous graceful auto-orbit speed
        setRotY((prev) => (prev + 24 * dt) % 360);

        // Gentle momentum dampening if released after flick
        if (Math.abs(velocityRef.current.x) > 0.05 || Math.abs(velocityRef.current.y) > 0.05) {
          setRotY((prev) => (prev + velocityRef.current.x) % 360);
          setRotX((prev) => Math.max(-60, Math.min(60, prev - velocityRef.current.y)));
          velocityRef.current.x *= 0.94;
          velocityRef.current.y *= 0.94;
        }
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [is3D]);

  // Subtle stardust background for 3D stage
  useEffect(() => {
    if (!is3D) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#1e6b37' : '#e0631f',
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2
    }));

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [is3D]);

  // Extruded 3D slices for thickness
  const extrudeSlices = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="hero-emblem-centerpiece">
      <div className="hero-visual-card">
        {/* Dynamic Glow */}
        <div
          className="hero-emblem-glow"
          style={{
            background: is3D
              ? 'radial-gradient(circle, rgba(224, 99, 31, 0.35) 0%, rgba(30, 107, 55, 0.3) 50%, transparent 75%)'
              : previewHover
              ? `radial-gradient(circle at ${previewTilt.glowX}% ${previewTilt.glowY}%, rgba(224, 99, 31, 0.4) 0%, rgba(30, 107, 55, 0.35) 50%, transparent 75%)`
              : undefined
          }}
        />

        {!is3D ? (
          /* ================= TAMPILAN AWAL (2D ELEGAN + TILT) ================= */
          <div
            ref={cardRef}
            className="hero-emblem-wrapper interactive-tilt-card hero-emblem-clean-card"
            style={{
              transform: `perspective(1000px) rotateX(${previewTilt.x}deg) rotateY(${previewTilt.y}deg) scale3d(${previewHover ? 1.05 : 1}, ${previewHover ? 1.05 : 1}, 1)`,
              transition: previewHover ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            onMouseMove={handlePreviewMouseMove}
            onMouseEnter={handlePreviewMouseEnter}
            onMouseLeave={handlePreviewMouseLeave}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            aria-label="Lambang DEMA FST - Kabinet Wigyamerta Antasena"
          >
            {/* Specular Shine Overlay */}
            <div
              className="emblem-shine-layer"
              style={{
                background: previewHover
                  ? `radial-gradient(circle at ${previewTilt.glowX}% ${previewTilt.glowY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
                  : 'none'
              }}
            />

            {/* Logo Image */}
            <div className="emblem-img-container">
              <img src="/logo.png" alt="Emblem Resmi DEMA" className="hero-emblem-img" />
              <div className="emblem-energy-ring"></div>
            </div>

            {/* Nama Kabinet */}
            <div className="hero-emblem-title">DEMA FST</div>
            <div className="hero-emblem-subtitle">Kabinet Wigyamerta Antasena</div>
          </div>
        ) : (
          /* ================= TAMPILAN 3D MURNI (AUTO-ORBIT, TANPA BUTTON & TANPA TULISAN) ================= */
          <div
            className="hero-emblem-wrapper hero-emblem-3d-pure"
            onPointerDown={handlePointerDown}
            onClick={handle3DContainerClick}
            role="button"
            tabIndex={0}
            aria-label="Mode 3D Lambang DEMA FST (Klik untuk kembali)"
          >
            {/* Canvas Particle Ambient Background */}
            <canvas ref={canvasRef} className="hero-3d-canvas" />

            {/* 3D Holographic Orbit Rings */}
            <div
              className="pure-3d-orbit-system"
              style={{
                transform: `perspective(1200px) rotateX(${rotX * 0.4}deg) rotateY(${rotY * 0.4}deg)`
              }}
            >
              <div className="orbit-ring orbit-x"></div>
              <div className="orbit-ring orbit-y"></div>
              <div className="orbit-ring orbit-z"></div>
            </div>

            {/* 3D Rotatable Core Gimbal with Auto-Orbit */}
            <div
              className="pure-3d-gimbal"
              style={{
                transform: `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
              }}
            >
              {/* Dynamic 3D Ground Shadow */}
              <div
                className="stage-3d-shadow"
                style={{
                  transform: `translateZ(-90px) rotateX(90deg) translate(${rotY * 0.5}px, ${rotX * 0.4}px) scale(${1 - Math.abs(rotX) * 0.003})`
                }}
              />

              {/* 3D Extruded Solid Rig */}
              <div className="emblem-3d-solid-rig">
                {extrudeSlices.map((layer) => (
                  <div
                    key={layer}
                    className="emblem-extrude-layer"
                    style={{
                      transform: `translateZ(${-layer * 3.5}px)`,
                      filter: `brightness(${0.5 + layer * 0.06}) drop-shadow(0 0 1px rgba(0,0,0,0.6))`
                    }}
                  >
                    <img src="/logo.png" alt="" className="extrude-img" />
                  </div>
                ))}

                <div className="emblem-front-layer" style={{ transform: 'translateZ(1px)' }}>
                  <img src="/logo.png" alt="DEMA Logo 3D" className="emblem-3d-main-img" />
                  <div
                    className="emblem-3d-specular"
                    style={{
                      background: `radial-gradient(circle at ${50 - rotY * 0.8}% ${50 - rotX * 0.8}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
