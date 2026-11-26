'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortfolioModal from './PortfolioModal';
import { IconCalendar } from './Icons';

export default function PortfolioSection({ initialPrograms, showAllButton = true }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProgram, setActiveModalProgram] = useState(null);

  useEffect(() => {
    setPrograms(initialPrograms);
  }, [initialPrograms]);

  useEffect(() => {
    let active = true;
    fetch('/api/program-kerja', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setPrograms(json.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const categories = [
    { key: 'all', label: 'Semua Kategori' },
    { key: 'sains-teknologi', label: 'Sains & Teknologi' },
    { key: 'sosial-pengabdian', label: 'Sosial & Pengabdian' },
    { key: 'kaderisasi', label: 'Kaderisasi & Karir' },
    { key: 'advokasi', label: 'Advokasi Mahasiswa' },
    { key: 'seni-kreatif', label: 'Kreatif & Seni' },
  ];

  const filtered = selectedCategory === 'all'
    ? programs
    : programs.filter((p) => p.category === selectedCategory);

  const getStatusClass = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('berjalan')) return 'is-ongoing';
    if (s.includes('segera')) return 'is-upcoming';
    return 'is-done';
  };

  return (
    <>
      <div className="portfolio-filter-bar" role="tablist" aria-label="Filter Kategori Program Kerja">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat.key}
            className={`filter-btn ${selectedCategory === cat.key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="portfolio-empty-state">
          <p>Belum ada program kerja untuk kategori ini.</p>
          <button
            type="button"
            className="btn btn-outline-green btn-sm"
            onClick={() => setSelectedCategory('all')}
          >
            Tampilkan Semua Kategori
          </button>
        </div>
      ) : (
        <div className="portfolio-grid">
          {filtered.map((p) => (
            <article key={p.id} className="portfolio-card">
              <div className="portfolio-card-media">
                <img
                  src={p.image}
                  alt={p.title}
                  width={400}
                  height={250}
                  className="portfolio-card-img"
                  loading="lazy"
                />
                <span className={`portfolio-status-badge ${getStatusClass(p.status)}`}>
                  {p.status}
                </span>
              </div>

              <div className="portfolio-card-body">
                <div className="portfolio-meta">
                  <span className="portfolio-meta-category">
                    {p.categoryName || p.category}
                  </span>
                  <span className="portfolio-meta-date">
                    <IconCalendar size={13} aria-hidden="true" />
                    <span>{p.date}</span>
                  </span>
                </div>

                <h3 className="portfolio-card-title">{p.title}</h3>
                <p className="portfolio-card-desc">{p.desc}</p>

                {p.impact && p.impact !== '-' && (
                  <div className="portfolio-impact-row">
                    <span className="impact-label">Capaian</span>
                    <p className="impact-value">{p.impact}</p>
                  </div>
                )}

                <div className="portfolio-card-footer">
                  <div className="portfolio-tag-list">
                    {p.tags && p.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="portfolio-tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-detail-link"
                    onClick={() => setActiveModalProgram(p)}
                  >
                    <span>Detail</span>
                    <span className="detail-arrow" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showAllButton && (
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/portofolio" className="btn btn-outline-green btn-lg">
            Lihat Seluruh Portofolio &rarr;
          </Link>
        </div>
      )}

      <PortfolioModal
        program={activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
      />
    </>
  );
}
