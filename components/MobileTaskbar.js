'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconBook,
  IconUsers,
  IconRocket,
  IconChat
} from '@/components/Icons';

export default function MobileTaskbar() {
  const pathname = usePathname();

  const openCabinetModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dema:open-cabinet'));
    }
  };

  return (
    <nav className="mobile-taskbar" aria-label="Navigasi Mobile">
      <div className="taskbar-container">
        <Link
          href="/"
          className={`taskbar-item ${pathname === '/' ? 'active' : ''}`}
          aria-current={pathname === '/' ? 'page' : undefined}
          aria-label="Beranda"
        >
          <span className="taskbar-icon-wrap" aria-hidden="true">
            <IconHome size={19} />
          </span>
          <span className="taskbar-label">Beranda</span>
        </Link>

        <Link
          href="/profil"
          className={`taskbar-item ${pathname.startsWith('/profil') ? 'active' : ''}`}
          aria-current={pathname.startsWith('/profil') ? 'page' : undefined}
          aria-label="Profil & Filosofi"
        >
          <span className="taskbar-icon-wrap" aria-hidden="true">
            <IconBook size={19} />
          </span>
          <span className="taskbar-label">Profil</span>
        </Link>

        <button
          type="button"
          className="taskbar-item taskbar-kabinet-btn"
          onClick={openCabinetModal}
          aria-label="Profil Kabinet Wigyamerta Antasena"
        >
          <span className="taskbar-icon-wrap" aria-hidden="true">
            <IconUsers size={19} />
          </span>
          <span className="taskbar-label">Kabinet</span>
        </button>

        <Link
          href="/portofolio"
          className={`taskbar-item ${pathname.startsWith('/portofolio') ? 'active' : ''}`}
          aria-current={pathname.startsWith('/portofolio') ? 'page' : undefined}
          aria-label="Portofolio & Program Kerja"
        >
          <span className="taskbar-icon-wrap" aria-hidden="true">
            <IconRocket size={19} />
          </span>
          <span className="taskbar-label">Proker</span>
        </Link>

        <Link
          href="/kontak#aspirasi"
          className={`taskbar-item ${pathname.startsWith('/kontak') ? 'active' : ''}`}
          aria-current={pathname.startsWith('/kontak') ? 'page' : undefined}
          aria-label="Kirim Aspirasi Mahasiswa"
        >
          <span className="taskbar-icon-wrap" aria-hidden="true">
            <IconChat size={19} />
          </span>
          <span className="taskbar-label">Aspirasi</span>
        </Link>
      </div>
    </nav>
  );
}
