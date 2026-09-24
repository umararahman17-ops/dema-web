'use client';

import { IconCalendar, IconClose } from './Icons';

export default function PortfolioModal({ program, onClose }) {
  if (!program) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconClose size={18} />
        </button>
        <div className="modal-media">
          <img src={program.image} alt={program.title} />
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="portfolio-category-badge" style={{ position: 'static' }}>
              {program.categoryName || program.category}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#52665a', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <IconCalendar size={13} /> {program.date}
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#11281c', marginBottom: '14px' }}>
            {program.title}
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#435b4d', marginBottom: '20px' }}>
            {program.desc}
          </p>
          
          <div style={{ background: '#f4f8f5', border: '1px solid #dbe8e0', borderRadius: '12px', padding: '14px 18px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '4px' }}>
              Pencapaian &amp; Dampak Nyata:
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#143521' }}>
              {program.impact || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
