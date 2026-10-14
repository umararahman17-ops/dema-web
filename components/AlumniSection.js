'use client';

import { useState } from 'react';
import { 
  IconGraduationCap, 
  IconQuote, 
  IconStar, 
  IconCheck, 
  IconPlus, 
  IconClose, 
  IconBriefcase, 
  IconCalendar, 
  IconUsers,
  IconRocket,
  IconSend
} from '@/components/Icons';

export default function AlumniSection({ initialAlumni = [] }) {
  const [alumniList, setAlumniList] = useState(initialAlumni);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    nama: '',
    prodi: 'Sistem Informasi',
    angkatan: '',
    tahunLulus: '',
    jabatan: '',
    instansi: '',
    kesan: '',
    pesan: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const filterTabs = [
    { key: 'all', label: 'Semua Prodi' },
    { key: 'sistem-informasi', label: 'Sistem Informasi' },
    { key: 'arsitektur', label: 'Arsitektur' },
    { key: 'biologi', label: 'Biologi' },
    { key: 'matematika', label: 'Matematika' },
    { key: 'ilmu-kelautan', label: 'Ilmu Kelautan' },
    { key: 'teknik-sipil', label: 'Teknik Sipil' },
    { key: 'teknik-lingkungan', label: 'Teknik Lingkungan' }
  ];

  const filteredAlumni = alumniList.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.kategoriProdi === selectedFilter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.prodi.trim() || !formData.kesan.trim() || !formData.pesan.trim()) {
      showToast('Mohon lengkapi nama, prodi, kesan, dan pesan Anda.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.success) {
        showToast('Terima kasih! Kesan dan pesan Anda telah terkirim ke database pengurus DEMA untuk ditinjau terlebih dahulu sebelum dipublikasikan.');
        setFormData({
          nama: '',
          prodi: 'Sistem Informasi',
          angkatan: '',
          tahunLulus: '',
          jabatan: '',
          instansi: '',
          kesan: '',
          pesan: '',
        });
        setModalOpen(false);
      } else {
        showToast(json.message || 'Gagal mengirim testimoni alumni.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi server.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for initial avatar initials
  const getInitials = (name = '') => {
    const parts = name.replace(/^(M\.|Moh\.|Dr\.|Ir\.)\s*/i, '').trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0] ? parts[0].slice(0, 2) : 'AL').toUpperCase();
  };

  return (
    <section className="section-alumni" id="kesan-pesan-alumni">
      {/* Toast Notification */}
      {toast && (
        <div className={`alumni-toast ${toast.type}`}>
          <div className="alumni-toast-icon">
            {toast.type === 'success' ? <IconCheck size={18} /> : '!'}
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-tag">
            <IconGraduationCap size={15} /> Jejak Langkah &amp; Inspirasi Alumni
          </div>
          <h2 className="section-title">Kesan &amp; Pesan Alumni FST UINSA</h2>
          <p className="section-subtitle">
            Untaian refleksi kepemimpinan, pengalaman berorganisasi, dan pesan inspiratif dari para alumni yang kini berkiprah di sektor industri teknologi, rancang bangun, riset lingkungan hidup, hingga korporasi nasional.
          </p>
        </div>

        {/* Quick Highlights Strip */}
        <div className="alumni-highlights-grid">
          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap green">
              <IconGraduationCap size={22} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">7</div>
              <div className="highlight-label">Program Studi FST Terintegrasi</div>
            </div>
          </div>

          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap orange">
              <IconUsers size={22} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">1.200+</div>
              <div className="highlight-label">Jejaring Alumni Aktif Berdaya</div>
            </div>
          </div>

          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap green">
              <IconRocket size={22} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">98%</div>
              <div className="highlight-label">Kesiapan Karir &amp; Riset Lanjutan</div>
            </div>
          </div>

          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap orange">
              <IconBriefcase size={22} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">100%</div>
              <div className="highlight-label">Wadah Sinergi &amp; Mentorship</div>
            </div>
          </div>
        </div>

        {/* Action Bar: Filter Tabs & Add Alumni Button */}
        <div className="alumni-action-bar">
          <div className="alumni-filter-scroll">
            {filterTabs.map(tab => {
              const count = tab.key === 'all' 
                ? alumniList.length 
                : alumniList.filter(a => a.kategoriProdi === tab.key).length;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`alumni-tab-btn ${selectedFilter === tab.key ? 'active' : ''}`}
                >
                  <span>{tab.label}</span>
                  <span className="alumni-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-orange alumni-add-btn"
            onClick={() => setModalOpen(true)}
          >
            <IconPlus size={16} />
            <span>Tulis Kesan Alumni</span>
          </button>
        </div>

        {/* Alumni Testimonials Grid */}
        <div className="alumni-grid">
          {filteredAlumni.map((item, index) => {
            const isGreenAccent = index % 2 === 0;
            return (
              <div 
                key={item.id || index} 
                className={`alumni-card ${isGreenAccent ? 'accent-green' : 'accent-orange'}`}
              >
                {/* Background Watermark Quote */}
                <div className="alumni-card-watermark" aria-hidden="true">
                  <IconQuote size={90} />
                </div>

                {/* Card Top: Profile Header */}
                <div className="alumni-profile-header">
                  <div className="alumni-avatar-box">
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.nama} 
                        className="alumni-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} 
                      />
                    ) : null}
                    <div 
                      className="alumni-avatar-fallback" 
                      style={{ display: item.avatar ? 'none' : 'flex' }}
                    >
                      {getInitials(item.nama)}
                    </div>
                  </div>

                  <div className="alumni-profile-meta">
                    <div className="alumni-name-row">
                      <h4 className="alumni-name">{item.nama}</h4>
                      {item.verified && (
                        <span className="alumni-verified-badge" title="Alumni Terverifikasi FST UINSA">
                          <IconCheck size={11} /> Terverifikasi
                        </span>
                      )}
                    </div>

                    <div className="alumni-prodi-badge">
                      <IconGraduationCap size={13} />
                      <span>{item.prodi}</span>
                      {item.angkatan && <span className="alumni-dot-sep">&bull;</span>}
                      {item.angkatan && <span>Angkatan {item.angkatan}</span>}
                    </div>

                    {(item.jabatan || item.instansi) && (
                      <div className="alumni-career-badge">
                        <IconBriefcase size={12} />
                        <span>
                          {item.jabatan}{item.instansi && item.instansi !== '-' ? ` • ${item.instansi}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="alumni-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="alumni-star-active">
                      <IconStar size={14} />
                    </span>
                  ))}
                  <span className="alumni-rating-text">5.0 &bull; Pengalaman Berorganisasi</span>
                </div>

                {/* Kesan Quote Block */}
                <div className="alumni-quote-block kesan-block">
                  <div className="quote-label">
                    <span className="quote-label-dot dot-green"></span>
                    <span>Kesan Berproses di Kampus &amp; DEMA:</span>
                  </div>
                  <p className="quote-content">
                    &ldquo;{item.kesan}&rdquo;
                  </p>
                </div>

                {/* Pesan Quote Block */}
                <div className="alumni-quote-block pesan-block">
                  <div className="quote-label">
                    <span className="quote-label-dot dot-orange"></span>
                    <span>Pesan untuk Mahasiswa &amp; Adik Tingkat:</span>
                  </div>
                  <p className="quote-content">
                    &ldquo;{item.pesan}&rdquo;
                  </p>
                </div>

                {/* Card Footer */}
                <div className="alumni-card-footer">
                  <div className="alumni-footer-tag">
                    <IconCalendar size={12} /> Lulus {item.tahunLulus || '2023'}
                  </div>
                  <button 
                    type="button" 
                    className="alumni-read-btn"
                    onClick={() => setDetailModal(item)}
                  >
                    Detail Profil &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if filter has no data */}
        {filteredAlumni.length === 0 && (
          <div className="alumni-empty-state">
            <IconGraduationCap size={48} className="empty-icon" />
            <h3>Belum Ada Testimoni di Kategori Ini</h3>
            <p>Jadilah alumni pertama dari program studi ini yang membagikan kesan dan pesan inspiratif!</p>
            <button 
              type="button" 
              className="btn btn-green btn-sm"
              onClick={() => setModalOpen(true)}
            >
              <IconPlus size={16} /> Tulis Kesan &amp; Pesan
            </button>
          </div>
        )}

        {/* Bottom Invitation Banner */}
        <div className="alumni-banner-card">
          <div className="alumni-banner-text">
            <h3>Apakah Anda Alumni Fakultas Sains dan Teknologi UINSA?</h3>
            <p>
              Setiap jejak langkah Anda adalah lentera inspirasi bagi generasi penerus. Bagikan pengalaman, pandangan industri, dan motivasi terbaik Anda melalui portal resmi DEMA FST UINSA.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-orange btn-lg"
            onClick={() => setModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
          >
            <IconGraduationCap size={20} />
            <span>Bagikan Kesan &amp; Pesan</span>
          </button>
        </div>
      </div>

      {/* MODAL: SUBMIT NEW ALUMNI IMPRESSION */}
      {modalOpen && (
        <div className="alumni-modal-overlay" onClick={() => setModalOpen(false)}>
          <div 
            className="alumni-modal-card" 
            onClick={(e) => e.stopPropagation()} 
            role="dialog" 
            aria-modal="true"
          >
            <div className="alumni-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="modal-icon-circle green">
                  <IconGraduationCap size={22} />
                </div>
                <div>
                  <h3 className="alumni-modal-title">Formulir Kesan &amp; Pesan Alumni</h3>
                  <p className="alumni-modal-subtitle">Kontribusi wejangan Anda sangat berarti bagi mahasiswa FST UINSA.</p>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Tutup Dialog"
              >
                <IconClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="alumni-modal-body">
              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">
                    Nama Lengkap &amp; Gelar <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Farhan, S.Kom."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Program Studi <span className="req">*</span>
                  </label>
                  <select
                    required
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                    className="form-input"
                  >
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Arsitektur">Arsitektur</option>
                    <option value="Biologi">Biologi</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Ilmu Kelautan">Ilmu Kelautan</option>
                    <option value="Teknik Sipil">Teknik Sipil</option>
                    <option value="Teknik Lingkungan">Teknik Lingkungan</option>
                  </select>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">Tahun Angkatan Masuk</label>
                  <input
                    type="text"
                    placeholder="Contoh: 2019"
                    value={formData.angkatan}
                    onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tahun Kelulusan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 2023"
                    value={formData.tahunLulus}
                    onChange={(e) => setFormData({ ...formData, tahunLulus: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label">Profesi / Jabatan Saat Ini</label>
                  <input
                    type="text"
                    placeholder="Contoh: Senior Software Engineer"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instansi / Perusahaan / Lembaga</label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Unicorn Tech Indonesia / Kementerian"
                    value={formData.instansi}
                    onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Kesan Selama Berproses di Kampus &amp; DEMA <span className="req">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan pengalaman, dinamika organisasi, dan nilai positif yang Anda rasakan selama menempuh studi dan berorganisasi di FST UINSA..."
                  value={formData.kesan}
                  onChange={(e) => setFormData({ ...formData, kesan: e.target.value })}
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Pesan &amp; Wejangan untuk Adik-Adik Mahasiswa <span className="req">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan motivasi, nasihat karir, atau pesan semangat untuk adik tingkat dan pengurus DEMA FST UINSA ke depan..."
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  className="form-input form-textarea"
                />
              </div>

              <div style={{ background: 'rgba(30, 107, 55, 0.08)', border: '1px solid rgba(30, 107, 55, 0.22)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '14px 0 18px' }}>
                ℹ️ <strong>Alur Peninjauan Pengurus:</strong> Kesan dan pesan yang Anda kirim akan masuk ke database pengurus DEMA terlebih dahulu untuk ditinjau dan diverifikasi sebelum dipublikasikan di website demi menjaga integritas informasi.
              </div>

              <div className="alumni-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline-green"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-orange"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {submitting ? (
                    'Mengirim...'
                  ) : (
                    <>
                      <IconSend size={16} /> Kirim untuk Ditinjau Pengurus
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: READ ALUMNI FULL DETAIL */}
      {detailModal && (
        <div className="alumni-modal-overlay" onClick={() => setDetailModal(null)}>
          <div 
            className="alumni-modal-card detail-card" 
            onClick={(e) => e.stopPropagation()} 
            role="dialog"
            aria-modal="true"
          >
            <div className="alumni-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="alumni-avatar-box large">
                  {detailModal.avatar ? (
                    <img 
                      src={detailModal.avatar} 
                      alt={detailModal.nama} 
                      className="alumni-avatar-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} 
                    />
                  ) : null}
                  <div 
                    className="alumni-avatar-fallback" 
                    style={{ display: detailModal.avatar ? 'none' : 'flex' }}
                  >
                    {getInitials(detailModal.nama)}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="alumni-modal-title">{detailModal.nama}</h3>
                    {detailModal.verified && (
                      <span className="alumni-verified-badge">
                        <IconCheck size={11} /> Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="alumni-prodi-badge" style={{ marginTop: '4px' }}>
                    <IconGraduationCap size={13} />
                    <span>{detailModal.prodi}</span>
                    {detailModal.angkatan && <span className="alumni-dot-sep">&bull;</span>}
                    {detailModal.angkatan && <span>Angkatan {detailModal.angkatan}</span>}
                    {detailModal.tahunLulus && <span> (Lulus {detailModal.tahunLulus})</span>}
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setDetailModal(null)}
                aria-label="Tutup Detail"
              >
                <IconClose size={20} />
              </button>
            </div>

            <div className="alumni-modal-body">
              {(detailModal.jabatan || detailModal.instansi) && (
                <div className="detail-meta-box">
                  <IconBriefcase size={16} style={{ color: 'var(--accent-orange)' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kiprah Saat Ini</div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {detailModal.jabatan} {detailModal.instansi && `• ${detailModal.instansi}`}
                    </div>
                  </div>
                </div>
              )}

              <div className="alumni-quote-block kesan-block" style={{ marginTop: '16px' }}>
                <div className="quote-label">
                  <span className="quote-label-dot dot-green"></span>
                  <span>Kesan Mendalam Selama di Kampus &amp; DEMA:</span>
                </div>
                <p className="quote-content" style={{ fontSize: '0.95rem' }}>
                  &ldquo;{detailModal.kesan}&rdquo;
                </p>
              </div>

              <div className="alumni-quote-block pesan-block" style={{ marginTop: '16px' }}>
                <div className="quote-label">
                  <span className="quote-label-dot dot-orange"></span>
                  <span>Pesan Motivasi untuk Rekan Mahasiswa FST:</span>
                </div>
                <p className="quote-content" style={{ fontSize: '0.95rem' }}>
                  &ldquo;{detailModal.pesan}&rdquo;
                </p>
              </div>

              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button
                  type="button"
                  className="btn btn-outline-green"
                  onClick={() => setDetailModal(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
