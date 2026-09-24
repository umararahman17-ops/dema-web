'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { IconMail, IconInstagram, IconChat, IconMenu, IconClose } from '@/components/Icons';

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
            <a href="mailto:sekretariat@dema-univ.ac.id" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconMail size={13} /> sekretariat@dema-univ.ac.id
            </a>
            <a href="https://www.instagram.com/demafstuinsa/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconInstagram size={13} /> @demafstuinsa
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
              <div className="brand-subtitle">Kabinet Wigyamerta Antasena</div>
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
              href="/kontak" 
              className={`nav-link ${pathname.startsWith('/kontak') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Kontak
            </Link>
          </nav>

          {/* Action Button & Theme Toggle */}
          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/kontak#aspirasi" className="btn btn-orange btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <IconChat size={16} /> Kirim Aspirasi
            </Link>
            <button 
              className="mobile-nav-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {mobileMenuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
