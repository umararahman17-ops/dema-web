'use client';

import { useState, useRef, useEffect } from 'react';

// Soft audio chime for dimensional shift
function playDimensionalChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc2.frequency.setValueAtTime(783.99, now); // G5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch {
    // Silent fallback
  }
}

export default function LogoPhilosophy3D({ defaultExploded = true }) {
  const [isExploded, setIsExploded] = useState(defaultExploded);
  const [rotX, setRotX] = useState(14);
  const [rotY, setRotY] = useState(-20);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  // 3D Pointer Drag
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    didDragRef.current = false;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleLogoClick = () => {
    if (!didDragRef.current) {
      setIsExploded((prev) => !prev);
      playDimensionalChime();
    }
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
      setRotY((prev) => (prev + dx * 0.5) % 360);
      setRotX((prev) => Math.max(-50, Math.min(50, prev - dy * 0.4)));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Gentle idle orbit floating loop
  useEffect(() => {
    let lastTime = performance.now();
    const updateLoop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isDraggingRef.current) {
        setRotY((prev) => (prev + 12 * dt) % 360);
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="philo-3d-box">
      {/* 3D Viewport - Click to explode or assemble */}
      <div
        className="philo-3d-viewport"
        onPointerDown={handlePointerDown}
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        aria-label="Lambang 3D DEMA FST - Klik untuk memisahkan atau menyatukan lapisan"
        title="Klik lambang untuk memisahkan atau menyatukan lapisan dimensi"
      >
        {/* Holographic Orbit Rings */}
        <div
          className="philo-3d-rings"
          style={{
            transform: `perspective(1000px) rotateX(${rotX * 0.3}deg) rotateY(${rotY * 0.3}deg)`
          }}
        >
          <div className="orbit-ring orbit-x"></div>
          <div className="orbit-ring orbit-y"></div>
        </div>

        {/* Rotatable Gimbal Stage */}
        <div
          className="philo-3d-gimbal"
          style={{
            transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
          }}
        >
          {/* Ground Shadow */}
          <div
            className="stage-3d-shadow"
            style={{
              transform: `translateZ(-85px) rotateX(90deg) translate(${rotY * 0.4}px, ${rotX * 0.3}px) scale(${isExploded ? 1.05 : 0.95})`,
              transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          />

          {/* Unified 3D Layer Rig with Continuous Smooth Interpolation */}
          <div className="emblem-3d-exploded-rig">
            {/* Layer 1: Bingkai Segi Delapan Teranyam */}
            <div
              className="exploded-layer layer-frame"
              style={{
                transform: `translateZ(${isExploded ? 25 : 2}px)`,
                transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              onMouseEnter={() => setHoveredLayer('Bingkai Segi Delapan: Nilai Islam, Moral & Harmoni Sinergi')}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <img
                src="/logo-elements/bingkai-segi-delapan.png"
                alt="Bingkai Segi Delapan"
                className="exploded-img"
              />
              <div
                className="layer-tag tag-frame"
                style={{
                  opacity: isExploded ? 1 : 0,
                  transform: isExploded ? 'scale(1)' : 'scale(0.6)',
                  pointerEvents: isExploded ? 'auto' : 'none',
                  transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                1. Bingkai Nilai
              </div>
            </div>

            {/* Layer 2: Roda Bergerigi */}
            <div
              className={`exploded-layer layer-gear ${isExploded ? 'gear-spin-motion' : ''}`}
              style={{
                transform: `translateZ(${isExploded ? 75 : 4}px)`,
                transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              onMouseEnter={() => setHoveredLayer('Roda Bergerigi: Teknologi, Rekayasa & Aksi Nyata')}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <img
                src="/logo-elements/roda-bergerigi.png"
                alt="Roda Bergerigi"
                className="exploded-img"
              />
              <div
                className="layer-tag tag-gear"
                style={{
                  opacity: isExploded ? 1 : 0,
                  transform: isExploded ? 'scale(1)' : 'scale(0.6)',
                  pointerEvents: isExploded ? 'auto' : 'none',
                  transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                2. Roda Teknologi
              </div>
            </div>

            {/* Layer 3: Pilar Oranye & Sudut Maju */}
            <div
              className="exploded-layer layer-pillar"
              style={{
                transform: `translateZ(${isExploded ? 120 : 6}px)`,
                transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              onMouseEnter={() => setHoveredLayer('Pilar Sudut Maju: Kepemimpinan Progresif & Akselerasi')}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <img
                src="/logo-elements/pilar-sudut-maju.png"
                alt="Pilar Sudut Maju"
                className="exploded-img"
              />
              <div
                className="layer-tag tag-pillar"
                style={{
                  opacity: isExploded ? 1 : 0,
                  transform: isExploded ? 'scale(1)' : 'scale(0.6)',
                  pointerEvents: isExploded ? 'auto' : 'none',
                  transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                3. Pilar Progresif
              </div>
            </div>

            {/* Layer 4: Inti Atom */}
            <div
              className={`exploded-layer layer-atom ${isExploded ? 'atom-pulse-motion' : ''}`}
              style={{
                transform: `translateZ(${isExploded ? 165 : 8}px)`,
                transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              onMouseEnter={() => setHoveredLayer('Inti Atom: Sains, Riset Ilmiah & Akal Analitis')}
              onMouseLeave={() => setHoveredLayer(null)}
            >
              <div className="atom-energy-field"></div>
              <img
                src="/logo-elements/inti-atom.png"
                alt="Inti Atom"
                className="exploded-img"
              />
              <div
                className="layer-tag tag-atom"
                style={{
                  opacity: isExploded ? 1 : 0,
                  transform: isExploded ? 'scale(1)' : 'scale(0.6)',
                  pointerEvents: isExploded ? 'auto' : 'none',
                  transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                4. Inti Sains
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Information Banner */}
      {hoveredLayer && (
        <div className="philo-hover-info">
          <span>💡</span> {hoveredLayer}
        </div>
      )}
    </div>
  );
}
