'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  IconMail, 
  IconInstagram, 
  IconChat, 
  IconMenu, 
  IconClose, 
  IconHome, 
  IconBook, 
  IconRocket, 
  IconShield, 
  IconLock 
} from '@/components/Icons';

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMobileMenuOpen(false);

  const openCabinetModal = () => {
    closeMenu();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dema:open-cabinet'));
    }
  };

  return (
    <>
      {/* Topbar Announcement */}
      <div className="topbar">
        <div className="container topbar-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button"
              className="topbar-badge topbar-badge-clickable"
              onClick={openCabinetModal}
              title="Klik untuk melihat detail & struktur Kabinet Saat Ini"
            >
              <span className="dot-live"></span> Kabinet 2026/2027
            </button>
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
            <div className="brand-text-block">
              <div className="brand-title">DEMA <span>FST</span></div>
              <div className="brand-subtitle">Kabinet Wigyamerta Antasena</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-menu desktop-only">
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              Beranda
            </Link>
            <Link 
              href="/profil" 
              className={`nav-link ${pathname.startsWith('/profil') ? 'active' : ''}`}
            >
              Profil &amp; Filosofi
            </Link>
            <Link 
              href="/portofolio" 
              className={`nav-link ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
            >
              Portofolio &amp; Proker
            </Link>

            <Link 
              href="/kontak" 
              className={`nav-link ${pathname.startsWith('/kontak') ? 'active' : ''}`}
            >
              Kontak
            </Link>

            {/* Quick Cabinet trigger in desktop menu */}
            <button 
              type="button"
              className="nav-link nav-cabinet-btn"
              onClick={openCabinetModal}
              title="Lihat Struktur & Profil Kabinet Wigyamerta Antasena"
            >
              <span className="dot-live"></span> Kabinet Saat Ini
            </button>
          </nav>

          {/* Action Button & Mobile Burger Toggle */}
          <div className="nav-actions">
            <ThemeToggle />

            {/* Desktop CTA Button */}
            <Link href="/kontak#aspirasi" className="btn btn-orange btn-sm nav-cta-btn">
              <IconChat size={16} /> Kirim Aspirasi
            </Link>

            {/* Mobile Hamburger Button */}
            <button 
              type="button"
              className={`mobile-nav-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Offcanvas Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div className="drawer-brand">
            <div className="drawer-logo-wrap">
              <img src="/logo.png" alt="Logo DEMA" className="brand-logo-img" />
            </div>
            <div>
              <div className="drawer-title">DEMA <span>FST</span></div>
              <div className="drawer-subtitle">UIN Sunan Ampel Surabaya</div>
            </div>
          </div>
          <button 
            type="button" 
            className="drawer-close-btn" 
            onClick={closeMenu}
            aria-label="Tutup Menu"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Interactive Cabinet Card Inside Drawer */}
        <div className="drawer-cabinet-banner" onClick={openCabinetModal}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div className="drawer-cabinet-logo-thumb">
              <img src="/logo-kabinet.png" alt="Logo Kabinet Wigyamerta Antasena" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div className="drawer-cabinet-badge">
                <span className="dot-live"></span> KABINET SAAT INI • 2026/2027
              </div>
              <h4 className="drawer-cabinet-name">Kabinet Wigyamerta Antasena</h4>
            </div>
          </div>
          <p className="drawer-cabinet-desc">Sentuh untuk melihat filosofi, visi misi, &amp; struktur 8 departemen</p>
          <div className="drawer-cabinet-action">
            <span>Buka Detail Kabinet</span>
            <span className="arrow-right">&rarr;</span>
          </div>
        </div>

        {/* Drawer Links */}
        <div className="mobile-drawer-links">
          <Link 
            href="/" 
            className={`drawer-link ${pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="drawer-link-icon"><IconHome size={18} /></span>
            <span>Beranda</span>
          </Link>

          <Link 
            href="/profil" 
            className={`drawer-link ${pathname.startsWith('/profil') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="drawer-link-icon"><IconBook size={18} /></span>
            <span>Profil &amp; Filosofi Lambang</span>
          </Link>

          <Link 
            href="/portofolio" 
            className={`drawer-link ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="drawer-link-icon"><IconRocket size={18} /></span>
            <span>Portofolio &amp; Program Kerja</span>
          </Link>

          <Link 
            href="/kontak" 
            className={`drawer-link ${pathname.startsWith('/kontak') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span className="drawer-link-icon"><IconChat size={18} /></span>
            <span>Kontak &amp; Sekretariat</span>
          </Link>

          <Link 
            href="/program-kerja/kelola" 
            className="drawer-link admin-link"
            onClick={closeMenu}
          >
            <span className="drawer-link-icon"><IconLock size={18} /></span>
            <span>Akses Pengurus Kabinet</span>
          </Link>
        </div>

        {/* Drawer CTA Action */}
        <div className="mobile-drawer-action">
          <Link 
            href="/kontak#aspirasi" 
            className="btn btn-orange btn-block"
            onClick={closeMenu}
          >
            <IconChat size={18} /> Kirim Aspirasi Mahasiswa
          </Link>
        </div>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <div className="drawer-socials">
            <a href="https://www.instagram.com/demafstuinsa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram size={18} />
            </a>
            <a href="mailto:sekretariat@dema-univ.ac.id" aria-label="Email">
              <IconMail size={18} />
            </a>
          </div>
          <div className="drawer-tagline">
            Sinergi Sains &amp; Teknologi Mahasiswa FST
          </div>
        </div>
      </div>
    </>
  );
}
