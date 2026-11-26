'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconCalendar, IconClose } from './Icons';

export default function PortfolioModal({ program, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!program) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [program, onClose]);

  if (!program || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container">
        <button
          ref={closeBtnRef}
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Tutup Detail Program"
        >
          <IconClose size={18} aria-hidden="true" />
        </button>

        <div className="modal-media">
          <img
            src={program.image}
            alt={program.title}
            width={650}
            height={260}
          />
        </div>

        <div className="modal-body">
          <div className="portfolio-modal-meta">
            <span className="portfolio-modal-cat">
              {program.categoryName || program.category}
            </span>
            <span className="portfolio-modal-date">
              <IconCalendar size={14} aria-hidden="true" />
              <span>{program.date}</span>
            </span>
          </div>

          <h3 id="portfolio-modal-title" className="portfolio-modal-title">
            {program.title}
          </h3>

          <p className="portfolio-modal-desc">
            {program.desc}
          </p>

          {program.impact && program.impact !== '-' && (
            <div className="portfolio-modal-impact">
              <span className="impact-label">Pencapaian &amp; Dampak</span>
              <p className="impact-value">{program.impact}</p>
            </div>
          )}

          {Array.isArray(program.tags) && program.tags.length > 0 && (
            <div className="portfolio-tag-list" style={{ marginTop: '18px' }}>
              {program.tags.map((tag, idx) => (
                <span key={idx} className="portfolio-tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
