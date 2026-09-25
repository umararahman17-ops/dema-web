'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cabinetDetails, orgInfo, stats } from '@/lib/data';
import { 
  IconClose, 
  IconAtom, 
  IconShield, 
  IconNetwork, 
  IconUsers, 
  IconHandshake, 
  IconCompass, 
  IconBuilding, 
  IconBulb, 
  IconRocket, 
  IconCheck, 
  IconChat, 
  IconBook 
} from '@/components/Icons';

const deptIcons = {
  atom: <IconAtom size={20} />,
  shield: <IconShield size={20} />,
  network: <IconNetwork size={20} />,
  users: <IconUsers size={20} />,
  handshake: <IconHandshake size={20} />,
  compass: <IconCompass size={20} />,
  building: <IconBuilding size={20} />,
  bulb: <IconBulb size={20} />,
};

export default function CabinetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'departments' | 'actions'

  // Listen to custom global events for opening the modal from anywhere
  useEffect(() => {
    const handleOpen = () => {
      if (typeof onClose === 'function' && !isOpen) {
        // Controlled from outside
      }
    };
    window.addEventListener('dema:open-cabinet', handleOpen);
    return () => window.removeEventListener('dema:open-cabinet', handleOpen);
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="cabinet-modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div 
        className="cabinet-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="cabinet-modal-header">
          <div className="cabinet-header-brand">
            <div className="cabinet-emblem-badge">
              <img src="/logo-kabinet.png" alt="Logo Kabinet Wigyamerta Antasena" className="cabinet-emblem-img" />
              <span className="cabinet-live-pulse" title="Kabinet Aktif 2026/2027"></span>
            </div>
            <div>
              <div className="cabinet-badge-tag">
                <span className="dot-live"></span> KABINET SAAT INI • {cabinetDetails.period}
              </div>
              <h2 className="cabinet-title">{cabinetDetails.name}</h2>
              <div className="cabinet-meta">{cabinetDetails.faculty} • {cabinetDetails.university}</div>
            </div>
          </div>
          <button 
            className="cabinet-close-btn" 
            onClick={onClose} 
            aria-label="Tutup Detail Kabinet"
          >
            <IconClose size={22} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="cabinet-tabs-bar">
          <button 
            type="button"
            className={`cabinet-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>Sekilas &amp; Filosofi</span>
          </button>
          <button 
            type="button"
            className={`cabinet-tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <span>Struktur &amp; 8 Departemen</span>
          </button>
          <button 
            type="button"
            className={`cabinet-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            <span>Layanan &amp; Aspirasi</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="cabinet-modal-body">
          {/* TAB 1: OVERVIEW & PHILOSOPHY */}
          {activeTab === 'overview' && (
            <div className="cabinet-tab-content">
              {/* Official Cabinet Logo Showcase Card */}
              <div className="cabinet-hero-logo-card">
                <div className="cabinet-hero-logo-img-wrap">
                  <img 
                    src="/logo-kabinet.png" 
                    alt="Logo Resmi Kabinet Wigyamerta Antasena" 
                    className="cabinet-hero-logo-img" 
                  />
                </div>
                <div className="cabinet-hero-logo-details">
                  <div className="cabinet-hero-logo-tag">
                    <span className="dot-live"></span> Lambang Resmi Kabinet
                  </div>
                  <h4 className="cabinet-hero-logo-title">Wigyamerta Antasena</h4>
                  <p className="cabinet-hero-logo-desc">
                    Mengadopsi figur ksatria Antasena yang sakti, berani menyelami kedalaman samudra riset sains &amp; teknologi, berwatak jujur, bersahaja, serta teguh mengawal kemajuan mahasiswa FST UINSA.
                  </p>
                </div>
              </div>

              {/* Slogan Banner */}
              <div className="cabinet-slogan-card">
                <div className="cabinet-slogan-tag">Motto Pergerakan</div>
                <div className="cabinet-slogan-text">&ldquo;{cabinetDetails.tagline}&rdquo;</div>
                <div className="cabinet-slogan-motto">Etos: {cabinetDetails.motto}</div>
              </div>


              {/* Stats Summary */}
              <div className="cabinet-stats-row">
                {stats.map((s, idx) => (
                  <div key={idx} className="cabinet-stat-pill">
                    <span className="cabinet-stat-num">{s.number}{s.suffix}</span>
                    <span className="cabinet-stat-lbl">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Filosofi Nama Kabinet */}
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">
                  <span className="subheading-accent">#</span> Filosofi Nama &ldquo;Wigyamerta Antasena&rdquo;
                </h3>
                <div className="cabinet-etymology-grid">
                  {cabinetDetails.nameEtymology.map((item, idx) => (
                    <div key={idx} className="cabinet-etymology-card">
                      <div className="etymology-badge">
                        <span className="etymology-idx">0{idx + 1}</span>
                        <h4>{item.term}</h4>
                      </div>
                      <p>{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visi & 3 Pilar Misi */}
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">
                  <span className="subheading-accent">#</span> 3 Pilar Strategis Kabinet
                </h3>
                <div className="cabinet-pillars-list">
                  {cabinetDetails.pillars.map((pillar, idx) => (
                    <div key={idx} className="cabinet-pillar-item">
                      <div className="pillar-num">{idx + 1}</div>
                      <div>
                        <h5>{pillar.title}</h5>
                        <p>{pillar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRUCTURE & 8 DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="cabinet-tab-content">
              {/* Badan Pengurus Harian */}
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">
                  <span className="subheading-accent">#</span> Badan Pengurus Harian (BPH)
                </h3>
                <div className="cabinet-bph-grid">
                  {cabinetDetails.bph.map((bph, idx) => (
                    <div key={idx} className="cabinet-bph-card">
                      <div className="bph-role-title">{bph.role}</div>
                      <div className="bph-role-desc">{bph.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8 Departemen & Biro */}
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">
                  <span className="subheading-accent">#</span> 8 Departemen &amp; Biro Pelaksana
                </h3>
                <div className="cabinet-dept-grid">
                  {cabinetDetails.departments.map((dept, idx) => (
                    <div key={idx} className={`cabinet-dept-card ${dept.badge}`}>
                      <div className="dept-card-top">
                        <div className="dept-icon-wrap">
                          {deptIcons[dept.icon] || <IconAtom size={20} />}
                        </div>
                        <span className="dept-code-tag">{dept.code}</span>
                      </div>
                      <h4 className="dept-name">{dept.name}</h4>
                      <p className="dept-desc">{dept.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & DIRECT ACTIONS */}
          {activeTab === 'actions' && (
            <div className="cabinet-tab-content">
              <div className="cabinet-actions-intro">
                <div className="cabinet-badge-tag" style={{ alignSelf: 'flex-start' }}>Portal Partisipatif Mahasiswa</div>
                <h3>Layanan &amp; Interaksi Bersama Kabinet</h3>
                <p>Kabinet Wigyamerta Antasena membuka ruang seluas-luasnya bagi mahasiswa FST untuk bersinergi, menyalurkan aspirasi, dan mengawal kemajuan bersama.</p>
              </div>

              <div className="cabinet-action-tiles">
                <Link 
                  href="/kontak#aspirasi" 
                  className="cabinet-tile-btn orange"
                  onClick={onClose}
                >
                  <div className="tile-icon-box">
                    <IconChat size={24} />
                  </div>
                  <div className="tile-content">
                    <h4>Kirim Aspirasi Mahasiswa</h4>
                    <p>Sampaikan kritik, saran, permohonan advokasi UKT, atau gagasan inovasi secara langsung ke kabinet.</p>
                  </div>
                  <span className="tile-arrow">&rarr;</span>
                </Link>

                <Link 
                  href="/portofolio" 
                  className="cabinet-tile-btn green"
                  onClick={onClose}
                >
                  <div className="tile-icon-box">
                    <IconRocket size={24} />
                  </div>
                  <div className="tile-content">
                    <h4>Portofolio &amp; Program Kerja</h4>
                    <p>Lihat rekam jejak program kerja terlaksana, pameran STIX, hackathon AI, hingga pengabdian desa digital.</p>
                  </div>
                  <span className="tile-arrow">&rarr;</span>
                </Link>

                <Link 
                  href="/profil" 
                  className="cabinet-tile-btn subtle"
                  onClick={onClose}
                >
                  <div className="tile-icon-box">
                    <IconBook size={24} />
                  </div>
                  <div className="tile-content">
                    <h4>Profil &amp; Filosofi Lambang 3D</h4>
                    <p>Pelajari dekonstruksi filosofi inti atom, roda bergerigi, bingkai segi delapan, dan pilar oranye DEMA.</p>
                  </div>
                  <span className="tile-arrow">&rarr;</span>
                </Link>
              </div>

              {/* Sekretariat Info */}
              <div className="cabinet-office-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <IconBuilding size={18} style={{ color: 'var(--accent-orange)' }} />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>Sekretariat DEMA FST UINSA</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                  {orgInfo.address} • Email: <a href={`mailto:${orgInfo.email}`} style={{ color: 'var(--accent-orange)' }}>{orgInfo.email}</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="cabinet-modal-footer">
          <div className="cabinet-footer-note">
            <span>DEMA FST UIN Sunan Ampel Surabaya</span> &bull; <span>Periode 2026/2027</span>
          </div>
          <button className="btn btn-outline-green btn-sm" onClick={onClose}>
            Tutup Tampilan
          </button>
        </div>
      </div>
    </div>
  );
}
