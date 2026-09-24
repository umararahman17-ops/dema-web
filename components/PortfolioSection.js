'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortfolioModal from './PortfolioModal';
import { IconCalendar } from './Icons';

export default function PortfolioSection({ initialPrograms, showAllButton = true }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProgram, setActiveModalProgram] = useState(null);

  const categories = [
    { key: 'all', label: 'Semua Kategori' },
    { key: 'sains-teknologi', label: 'Sains & Teknologi' },
    { key: 'sosial-pengabdian', label: 'Sosial & Pengabdian' },
    { key: 'kaderisasi', label: 'Kaderisasi & Karir' },
    { key: 'advokasi', label: 'Advokasi Mahasiswa' },
    { key: 'seni-kreatif', label: 'Kreatif & Seni' },
  ];

  const filtered = selectedCategory === 'all'
    ? initialPrograms
    : initialPrograms.filter((p) => p.category === selectedCategory);

  return (
    <>
      <div className="portfolio-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`filter-btn ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filtered.map((p) => (
          <div key={p.id} className="portfolio-card">
            <div className="portfolio-card-media">
              <img src={p.image} alt={p.title} className="portfolio-card-img" loading="lazy" />
              <span className="portfolio-category-badge">{p.categoryName || p.category}</span>
              <span className="portfolio-status-badge">{p.status}</span>
            </div>

            <div className="portfolio-card-body">
              <div className="portfolio-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <IconCalendar size={13} /> {p.date}
                </span>
              </div>

              <h3 className="portfolio-card-title">{p.title}</h3>
              <p className="portfolio-card-desc">{p.desc}</p>

              <div className="portfolio-impact-strip">
                <span className="impact-label">Dampak:</span>
                <span className="impact-value">{p.impact}</span>
              </div>

              <div className="portfolio-card-footer">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {p.tags && p.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', background: '#f0f6f2', color: '#236139', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-detail-link"
                  onClick={() => setActiveModalProgram(p)}
                >
                  Detail &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAllButton && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link href="/portofolio" className="btn btn-outline-green btn-lg">
            Lihat Seluruh Katalog Portofolio &rarr;
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      <PortfolioModal 
        program={activeModalProgram} 
        onClose={() => setActiveModalProgram(null)} 
      />
    </>
  );
}
