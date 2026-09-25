'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconHome, 
  IconBook, 
  IconRocket, 
  IconChat 
} from '@/components/Icons';
import CabinetModal from '@/components/CabinetModal';

export default function MobileTaskbar() {
  const pathname = usePathname();
  const [cabinetModalOpen, setCabinetModalOpen] = useState(false);

  // Global event listener so any button (desktop or mobile) can open cabinet modal
  useEffect(() => {
    const handleOpenModal = () => setCabinetModalOpen(true);
    window.addEventListener('dema:open-cabinet', handleOpenModal);
    return () => window.removeEventListener('dema:open-cabinet', handleOpenModal);
  }, []);

  return (
    <>
      {/* Interactive Cabinet Detail Modal */}
      <CabinetModal 
        isOpen={cabinetModalOpen} 
        onClose={() => setCabinetModalOpen(false)} 
      />

      {/* Floating Bottom Taskbar for Mobile */}
      <div className="mobile-taskbar" role="navigation" aria-label="Taskbar Mobile">
        <div className="taskbar-container">
          {/* 1. Beranda */}
          <Link 
            href="/" 
            className={`taskbar-item ${pathname === '/' ? 'active' : ''}`}
            aria-label="Beranda"
          >
            <div className="taskbar-icon-wrap">
              <IconHome size={20} />
            </div>
            <span className="taskbar-label">Beranda</span>
          </Link>

          {/* 2. Profil & Filosofi */}
          <Link 
            href="/profil" 
            className={`taskbar-item ${pathname.startsWith('/profil') ? 'active' : ''}`}
            aria-label="Profil & Filosofi"
          >
            <div className="taskbar-icon-wrap">
              <IconBook size={20} />
            </div>
            <span className="taskbar-label">Profil</span>
          </Link>

          {/* 3. CENTER HERO: KABINET SAAT INI (TRIGGER MODAL) */}
          <button 
            type="button"
            className="taskbar-hero-btn"
            onClick={() => setCabinetModalOpen(true)}
            aria-label="Lihat Kabinet Saat Ini (Wigyamerta Antasena)"
            title="Klik untuk melihat struktur & profil Kabinet Saat Ini"
          >
            <div className="taskbar-hero-emblem-wrap">
              <img src="/logo-kabinet.png" alt="Logo Kabinet Wigyamerta Antasena" className="taskbar-hero-img" />
              <span className="taskbar-hero-live-badge">26/27</span>
            </div>
            <span className="taskbar-hero-label">
              Kabinet <span className="taskbar-pulse-dot"></span>
            </span>
          </button>

          {/* 4. Portofolio & Proker */}
          <Link 
            href="/portofolio" 
            className={`taskbar-item ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
            aria-label="Portofolio & Program Kerja"
          >
            <div className="taskbar-icon-wrap">
              <IconRocket size={20} />
            </div>
            <span className="taskbar-label">Proker</span>
          </Link>

          {/* 5. Kontak & Aspirasi */}
          <Link 
            href="/kontak#aspirasi" 
            className={`taskbar-item ${pathname.startsWith('/kontak') ? 'active' : ''}`}
            aria-label="Kirim Aspirasi Mahasiswa"
          >
            <div className="taskbar-icon-wrap">
              <IconChat size={20} />
            </div>
            <span className="taskbar-label">Aspirasi</span>
          </Link>
        </div>
      </div>
    </>
  );
}
