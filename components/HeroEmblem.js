'use client';

import { useState, useRef } from 'react';
import { IconTrophy, IconZap } from '@/components/Icons';

export default function HeroEmblem({ programCount = 6 }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate values between -15deg and +15deg
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`,
      transition: 'transform 0.1s ease-out'
    });

    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
  };

  return (
    <div className="hero-emblem-centerpiece">
      <div className="hero-visual-card">
        {/* Dynamic Glow responding to mouse */}
        <div 
          className="hero-emblem-glow"
          style={{
            background: isHovered 
              ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(224, 99, 31, 0.35) 0%, rgba(30, 107, 55, 0.3) 50%, transparent 75%)`
              : undefined
          }}
        ></div>
        
        {/* Floating Badge Left / Top */}
        <div className="floating-badge badge-top interactive-badge">
          <div className="badge-icon green"><IconTrophy size={18} /></div>
          <div className="badge-content">
            <h4>{programCount}+ Program</h4>
            <p>Terlaksana &amp; Terekam</p>
          </div>
        </div>

        {/* Center Interactive Emblem Box */}
        <div 
          ref={cardRef}
          className="hero-emblem-wrapper interactive-tilt-card"
          style={style}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="emblem-shine-layer" style={{
            background: isHovered
              ? `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`
              : 'none'
          }}></div>
          <img src="/logo.png" alt="Emblem Resmi DEMA" className="hero-emblem-img" />
          <div className="hero-emblem-title">DEMA FST</div>
          <div className="hero-emblem-subtitle">Kabinet Wigyamerta Antasena</div>
          <div className="emblem-interactive-hint">Arahkan kursor &bull; 3D Interaktif</div>
        </div>

        {/* Floating Badge Right / Bottom */}
        <div className="floating-badge badge-bottom interactive-badge">
          <div className="badge-icon orange"><IconZap size={18} /></div>
          <div className="badge-content">
            <h4>100% Terbuka</h4>
            <p>Kanal Aspirasi Mahasiswa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
