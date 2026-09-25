'use client';

import { useState, useRef, useEffect } from 'react';

export default function LogoPhilosophy3D({ defaultExploded = true }) {
  const [isExploded, setIsExploded] = useState(defaultExploded);
  const [rotX, setRotX] = useState(16);
  const [rotY, setRotY] = useState(-24);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // 3D Pointer Drag
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      setRotY((prev) => (prev + dx * 0.5) % 360);
      setRotX((prev) => Math.max(-55, Math.min(55, prev - dy * 0.45)));
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

  return (
    <div className="philo-3d-box">
      {/* 3D Viewport */}
      <div
        className="philo-3d-viewport"
        onPointerDown={handlePointerDown}
        title="Geser / Drag untuk memutar perspektif 3D"
      >
        {/* Holographic Orbit Ring */}
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
              transform: `translateZ(-80px) rotateX(90deg) translate(${rotY * 0.4}px, ${rotX * 0.3}px)`
            }}
          />

          {!isExploded ? (
            /* Mode Solid */
            <div className="philo-solid-rig">
              <img src="/logo.png" alt="Logo Resmi DEMA" className="philo-solid-img" />
            </div>
          ) : (
            /* Mode Exploded 3D */
            <div className="emblem-3d-exploded-rig">
              {/* Layer 1: Bingkai Segi Delapan */}
              <div
                className="exploded-layer layer-frame"
                style={{ transform: 'translateZ(20px)' }}
                onMouseEnter={() => setHoveredLayer('Bingkai Segi Delapan: Nilai Islam, Moral & Harmoni Sinergi')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                <img
                  src="/logo-elements/bingkai-segi-delapan.png"
                  alt="Bingkai Segi Delapan"
                  className="exploded-img"
                />
                <div className="layer-tag tag-frame">1. Bingkai Nilai</div>
              </div>

              {/* Layer 2: Roda Bergerigi */}
              <div
                className="exploded-layer layer-gear gear-spin-motion"
                style={{ transform: 'translateZ(65px)' }}
                onMouseEnter={() => setHoveredLayer('Roda Bergerigi: Teknologi, Rekayasa & Aksi Nyata')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                <img
                  src="/logo-elements/roda-bergerigi.png"
                  alt="Roda Bergerigi"
                  className="exploded-img"
                />
                <div className="layer-tag tag-gear">2. Roda Teknologi</div>
              </div>

              {/* Layer 3: Pilar Oranye & Sudut Maju */}
              <div
                className="exploded-layer layer-pillar"
                style={{ transform: 'translateZ(105px)' }}
                onMouseEnter={() => setHoveredLayer('Pilar Sudut Maju: Kepemimpinan Progresif & Akselerasi')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                <img
                  src="/logo-elements/pilar-sudut-maju.png"
                  alt="Pilar Sudut Maju"
                  className="exploded-img"
                />
                <div className="layer-tag tag-pillar">3. Pilar Progresif</div>
              </div>

              {/* Layer 4: Inti Atom */}
              <div
                className="exploded-layer layer-atom atom-pulse-motion"
                style={{ transform: 'translateZ(150px)' }}
                onMouseEnter={() => setHoveredLayer('Inti Atom: Sains, Riset Ilmiah & Akal Analitis')}
                onMouseLeave={() => setHoveredLayer(null)}
              >
                <div className="atom-energy-field"></div>
                <img
                  src="/logo-elements/inti-atom.png"
                  alt="Inti Atom"
                  className="exploded-img"
                />
                <div className="layer-tag tag-atom">4. Inti Sains</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Information Banner */}
      {hoveredLayer && (
        <div className="philo-hover-info">
          <span>💡</span> {hoveredLayer}
        </div>
      )}

      {/* Mode Toggle Button */}
      <div className="philo-toggle-actions">
        <button
          type="button"
          className="btn-toggle-explode"
          onClick={() => setIsExploded(!isExploded)}
        >
          {isExploded ? '🧩 Satukan Lambang' : '💥 Pisahkan Dimensi 3D'}
        </button>
        <span className="philo-drag-hint">👆 Drag kursor untuk putar 3D</span>
      </div>
    </div>
  );
}
