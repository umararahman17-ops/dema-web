'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import CabinetModal from '@/components/CabinetModal';
import { 
  IconMail, 
  IconInstagram, 
  IconChat, 
  IconMenu, 
  IconClose, 
  IconHome, 
  IconBook, 
  IconRocket, 
  IconUsers,
  IconLock 
} from '@/components/Icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cabinetModalOpen, setCabinetModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
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

  // Close menu on route change & handle smooth hash scrolling
  useEffect(() => {
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 180);
      }
    }
  }, [pathname]);

  const closeMenu = () => setMobileMenuOpen(false);

  const openCabinet = () => {
    closeMenu();
    setCabinetModalOpen(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dema:open-cabinet'));
    }
  };

  const handleNavLinkClick = (targetPath, e) => {
    closeMenu();
    if (pathname === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAlumniClick = (e) => {
    closeMenu();
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('kesan-pesan-alumni');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Allow browser to navigate to /#kesan-pesan-alumni
    }
  };

  return (
    <>
      {/* Cabinet Details Modal */}
      <CabinetModal 
        isOpen={cabinetModalOpen} 
        onClose={() => setCabinetModalOpen(false)} 
      />

      {/* Floating Solane Capsule Header */}
      <header className={`solane-nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="solane-nav-capsule">
          {/* Brand Link */}
          <Link 
            href="/" 
            className="solane-nav-brand" 
            onClick={(e) => handleNavLinkClick('/', e)} 
            aria-label="Beranda DEMA FST"
          >
            <div className="solane-brand-icon">
              <img src="/logo.png" alt="Logo DEMA" className="solane-brand-img" />
            </div>
            <div className="solane-brand-title">
              DEMA <span>FST</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="solane-nav-links" aria-label="Navigasi Utama">
            <Link 
              href="/" 
              className={`solane-nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={(e) => handleNavLinkClick('/', e)}
            >
              Beranda
            </Link>
            <Link 
              href="/profil" 
              className={`solane-nav-link ${pathname.startsWith('/profil') ? 'active' : ''}`}
              onClick={(e) => handleNavLinkClick('/profil', e)}
            >
              Profil &amp; Filosofi
            </Link>
            <Link 
              href="/portofolio" 
              className={`solane-nav-link ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
              onClick={(e) => handleNavLinkClick('/portofolio', e)}
            >
              Portofolio
            </Link>
            <Link 
              href="/#kesan-pesan-alumni" 
              className="solane-nav-link"
              onClick={handleAlumniClick}
            >
              Alumni
            </Link>
            <Link 
              href="/kontak" 
              className={`solane-nav-link ${pathname.startsWith('/kontak') ? 'active' : ''}`}
              onClick={(e) => handleNavLinkClick('/kontak', e)}
            >
              Kontak
            </Link>
          </nav>

          {/* Action Buttons & Theme Toggle */}
          <div className="solane-nav-actions">
            {/* Kabinet Modal Trigger Pill */}
            <button 
              type="button"
              className="btn-solane-ghost desktop-only"
              onClick={openCabinet}
              title="Lihat Struktur & Profil Kabinet Wigyamerta Antasena"
            >
              <span className="dot-live"></span> Kabinet 26/27
            </button>

            {/* Kirim Aspirasi Pill CTA */}
            <Link href="/kontak#aspirasi" className="btn-solane-green desktop-only">
              <IconChat size={15} /> Kirim Aspirasi
            </Link>

            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button 
              type="button"
              className={`mobile-nav-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
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
        <div className="drawer-cabinet-banner" onClick={openCabinet}>
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
          <p className="drawer-cabinet-desc">Sentuh untuk melihat filosofi, visi misi, &amp; struktur BPI serta 6 departemen</p>
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
            onClick={(e) => handleNavLinkClick('/', e)}
          >
            <span className="drawer-link-icon"><IconHome size={18} /></span>
            <span>Beranda</span>
          </Link>

          <Link 
            href="/profil" 
            className={`drawer-link ${pathname.startsWith('/profil') ? 'active' : ''}`}
            onClick={(e) => handleNavLinkClick('/profil', e)}
          >
            <span className="drawer-link-icon"><IconBook size={18} /></span>
            <span>Profil &amp; Filosofi Lambang</span>
          </Link>

          <Link 
            href="/portofolio" 
            className={`drawer-link ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
            onClick={(e) => handleNavLinkClick('/portofolio', e)}
          >
            <span className="drawer-link-icon"><IconRocket size={18} /></span>
            <span>Portofolio &amp; Program Kerja</span>
          </Link>

          <Link 
            href="/#kesan-pesan-alumni" 
            className="drawer-link"
            onClick={handleAlumniClick}
          >
            <span className="drawer-link-icon"><IconUsers size={18} /></span>
            <span>Kesan &amp; Pesan Alumni</span>
          </Link>

          <Link 
            href="/kontak" 
            className={`drawer-link ${pathname.startsWith('/kontak') ? 'active' : ''}`}
            onClick={(e) => handleNavLinkClick('/kontak', e)}
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
            className="btn btn-solane-green btn-block"
            onClick={closeMenu}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
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
