'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Topbar Announcement */}
      <div className="topbar">
        <div className="container topbar-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="topbar-badge">Kabinet 2026/2027</span>
            <span>Selamat Datang di Portal Resmi Dewan Eksekutif Mahasiswa (DEMA)</span>
          </div>
          <div className="topbar-links">
            <a href="mailto:sekretariat@dema-univ.ac.id">
              <span>✉️</span> sekretariat@dema-univ.ac.id
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <span>📸</span> @dema.official
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Glassmorphism Header */}
      <header className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link href="/" className="brand-link" onClick={closeMenu}>
            <div className="brand-logo-wrap">
              <img src="/logo.png" alt="Logo DEMA" className="brand-logo-img" />
            </div>
            <div>
              <div className="brand-title">DEMA <span>FST</span></div>
              <div className="brand-subtitle">Kabinet Sinergi Inovasi</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Beranda
            </Link>
            <Link 
              href="/profil" 
              className={`nav-link ${pathname.startsWith('/profil') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Profil &amp; Filosofi
            </Link>
            <Link 
              href="/portofolio" 
              className={`nav-link ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Portofolio &amp; Proker
            </Link>
            <Link 
              href="/program-kerja/kelola" 
              className={`nav-link ${pathname.startsWith('/program-kerja/kelola') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Kelola Database
            </Link>
            <Link 
              href="/kontak" 
              className={`nav-link ${pathname.startsWith('/kontak') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Kontak
            </Link>
          </nav>

          {/* Action Button */}
          <div className="nav-actions">
            <Link href="/kontak#aspirasi" className="btn btn-orange btn-sm">
              <span>💬</span> Kirim Aspirasi
            </Link>
            <button 
              className="mobile-nav-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
