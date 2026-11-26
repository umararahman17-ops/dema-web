'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cabinetDetails, orgInfo, stats } from '@/lib/data';
import {
  IconClose,
  IconRocket,
  IconChat,
  IconBook,
  IconBuilding,
} from '@/components/Icons';

export default function CabinetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'departments' | 'actions'
  const closeBtnRef = useRef(null);

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

  // Move focus to close button when opened and lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Sekilas & Filosofi' },
    { id: 'departments', label: 'Struktur & Departemen' },
    { id: 'actions', label: 'Layanan & Kontak' },
  ];

  return (
    <div
      className="cabinet-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cabinet-modal-title"
    >
      <div
        className="cabinet-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className="cabinet-modal-header">
          <div className="cabinet-header-brand">
            <div className="cabinet-emblem-badge">
              <img
                src="/logo-kabinet.png"
                alt="Logo Kabinet Wigyamerta Antasena"
                width={52}
                height={52}
                className="cabinet-emblem-img"
              />
            </div>
            <div>
              <h2 id="cabinet-modal-title" className="cabinet-title">
                {cabinetDetails.name}
              </h2>
              <p className="cabinet-meta">
                {cabinetDetails.faculty} &bull; {cabinetDetails.university} &bull; Periode {cabinetDetails.period}
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="cabinet-close-btn"
            onClick={onClose}
            aria-label="Tutup Detail Kabinet"
          >
            <IconClose size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Clean Tab Navigation */}
        <div className="cabinet-tabs-bar" role="tablist" aria-label="Informasi Kabinet">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`cabinet-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="cabinet-modal-body">
          {/* TAB 1: OVERVIEW & PHILOSOPHY */}
          {activeTab === 'overview' && (
            <div className="cabinet-tab-content" role="tabpanel">
              {/* Concise Identity & Motto */}
              <div className="cabinet-intro-block">
                <p className="cabinet-intro-lead">
                  Mengadopsi figur Antasena yang jujur, bersahaja, dan berani menyelami kedalaman riset sains serta teknologi demi mengawal kemajuan mahasiswa FST UINSA.
                </p>
                <blockquote className="cabinet-quote-line">
                  <p className="cabinet-slogan-text">&ldquo;{cabinetDetails.tagline}&rdquo;</p>
                  <footer className="cabinet-slogan-motto">Etos: {cabinetDetails.motto}</footer>
                </blockquote>
              </div>

              {/* Clean Hairline Stats Strip */}
              <div className="cabinet-stats-strip">
                {stats.map((s, idx) => (
                  <div key={idx} className="cabinet-stat-cell">
                    <span className="cabinet-stat-num">{s.number}{s.suffix}</span>
                    <span className="cabinet-stat-lbl">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Filosofi Nama Kabinet */}
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">Filosofi Nama</h3>
                <div className="cabinet-etymology-grid">
                  {cabinetDetails.nameEtymology.map((item, idx) => (
                    <div key={idx} className="cabinet-etymology-item">
                      <h4>{item.term}</h4>
                      <p>{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Pilar Strategis */}
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">Pilar Strategis</h3>
                <ul className="cabinet-pillars-list">
                  {cabinetDetails.pillars.map((pillar, idx) => (
                    <li key={idx} className="cabinet-pillar-row">
                      <h5>{pillar.title}</h5>
                      <p>{pillar.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: STRUCTURE & 6 DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="cabinet-tab-content" role="tabpanel">
              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">Badan Pengurus Inti (BPI)</h3>
                <div className="cabinet-bph-grid">
                  {(cabinetDetails.bpi || cabinetDetails.bph).map((bpi, idx) => (
                    <div key={idx} className="cabinet-bph-card">
                      <div className="bph-role-title">{bpi.role}</div>
                      <div className="bph-role-desc">{bpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cabinet-section-group">
                <h3 className="cabinet-subheading">6 Departemen Pelaksana</h3>
                <div className="cabinet-dept-grid">
                  {cabinetDetails.departments.map((dept, idx) => (
                    <div key={idx} className="cabinet-dept-card">
                      <div className="dept-card-header">
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
            <div className="cabinet-tab-content" role="tabpanel">
              <div className="cabinet-actions-intro">
                <h3 className="cabinet-subheading" style={{ marginBottom: '6px' }}>
                  Layanan &amp; Akses Cepat
                </h3>
                <p>
                  Saluran resmi untuk menyampaikan aspirasi, meninjau program kerja, dan mengenal profil lengkap DEMA FST UINSA.
                </p>
              </div>

              <div className="cabinet-action-tiles">
                <Link
                  href="/kontak#aspirasi"
                  className="cabinet-tile-btn"
                  onClick={onClose}
                >
                  <div className="tile-icon-box" aria-hidden="true">
                    <IconChat size={20} />
                  </div>
                  <div className="tile-content">
                    <h4>Kirim Aspirasi Mahasiswa</h4>
                    <p>Sampaikan saran, permohonan advokasi UKT, atau gagasan secara langsung.</p>
                  </div>
                </Link>

                <Link
                  href="/portofolio"
                  className="cabinet-tile-btn"
                  onClick={onClose}
                >
                  <div className="tile-icon-box" aria-hidden="true">
                    <IconRocket size={20} />
                  </div>
                  <div className="tile-content">
                    <h4>Portofolio &amp; Program Kerja</h4>
                    <p>Rekam jejak kegiatan sains, teknologi, dan pengabdian masyarakat.</p>
                  </div>
                </Link>

                <Link
                  href="/profil"
                  className="cabinet-tile-btn"
                  onClick={onClose}
                >
                  <div className="tile-icon-box" aria-hidden="true">
                    <IconBook size={20} />
                  </div>
                  <div className="tile-content">
                    <h4>Profil &amp; Filosofi Lambang</h4>
                    <p>Makna simbolis inti atom, roda bergerigi, bingkai segi delapan, dan pilar.</p>
                  </div>
                </Link>
              </div>

              <div className="cabinet-office-line">
                <IconBuilding size={16} aria-hidden="true" />
                <span>
                  {orgInfo.address} &bull;{' '}
                  <a href={`mailto:${orgInfo.email}`}>{orgInfo.email}</a>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Clean Footer */}
        <div className="cabinet-modal-footer">
          <div className="cabinet-footer-note">
            DEMA FST UINSA &bull; {cabinetDetails.period}
          </div>
          <button
            type="button"
            className="cabinet-footer-close"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
