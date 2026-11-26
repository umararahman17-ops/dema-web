'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import BgDemaWatermark from '@/components/BgDemaWatermark';
import {
  IconGraduationCap,
  IconCheck,
  IconPlus,
  IconClose,
  IconBriefcase,
  IconCalendar,
  IconUsers,
  IconRocket,
  IconSend,
  IconUpload,
  IconInfo
} from '@/components/Icons';

/** Render alumni portrait with reliable SSR and post-hydration fallback to /default-profile.jpg. */
function AlumniAvatar({ src, alt, size }) {
  const [imgSrc, setImgSrc] = useState(src || '/default-profile.jpg');
  const imgRef = useRef(null);

  useEffect(() => {
    setImgSrc(src || '/default-profile.jpg');
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0 && imgSrc !== '/default-profile.jpg') {
      setImgSrc('/default-profile.jpg');
    }
  }, [imgSrc]);

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      className="alumni-avatar-img"
      onError={() => {
        if (imgSrc !== '/default-profile.jpg') {
          setImgSrc('/default-profile.jpg');
        }
      }}
    />
  );
}

export default function AlumniSection({ initialAlumni = [] }) {
  const [alumniList, setAlumniList] = useState(initialAlumni);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const avatarInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    prodi: 'Sistem Informasi',
    angkatan: '',
    tahunLulus: '',
    jabatan: '',
    instansi: '',
    kesan: '',
    pesan: '',
    avatar: '',
  });

  useEffect(() => {
    setAlumniList(initialAlumni);
  }, [initialAlumni]);

  useEffect(() => {
    let active = true;
    fetch('/api/alumni', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setAlumniList(json.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Lock background scroll & close active modals with Escape
  useEffect(() => {
    const anyModalOpen = modalOpen || Boolean(detailModal);
    if (!anyModalOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (detailModal) setDetailModal(null);
        else if (modalOpen) setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen, detailModal]);

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
          avatar: '',
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

  const processAvatarFile = (file) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name || '');
    if (!isImage) {
      showToast('File harus berupa gambar (JPG, PNG, WebP, GIF, SVG).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 10MB.', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      showToast('Gagal membaca file foto.', 'error');
    };
    reader.onload = () => {
      const result = reader.result;
      if (file.type === 'image/svg+xml') {
        setFormData((prev) => ({ ...prev, avatar: result }));
        setIsUploadingAvatar(false);
        return;
      }
      const img = new Image();
      img.onerror = () => {
        setIsUploadingAvatar(false);
        showToast('Format foto tidak dapat diproses browser.', 'error');
      };
      img.onload = () => {
        const MAX_DIM = 400;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/webp', 0.82);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        }
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        setIsUploadingAvatar(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="section-alumni" id="kesan-pesan-alumni" style={{ position: 'relative', overflow: 'clip' }}>
      <div className="parallax-bg-orb orb-section-emerald" data-parallax="0.12" data-parallax-max="65" aria-hidden="true" />
      <BgDemaWatermark variant="left" speed={0.15} maxShift={80} />

      {/* Toast Notification */}
      {toast && (
        <div className={`alumni-toast ${toast.type}`}>
          <div className="alumni-toast-icon" aria-hidden="true">
            {toast.type === 'success' ? <IconCheck size={18} /> : '!'}
          </div>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header aligned with Solane site rhythm */}
        <div className="solane-features-header" data-reveal="up" style={{ marginBottom: '36px' }}>
          <div className="solane-features-title-block">
            <div className="solane-section-tag" style={{ textAlign: 'left' }}>
              JEJAK LANGKAH &amp; INSPIRASI ALUMNI
            </div>
            <h2>Kesan &amp; Pesan Alumni FST UINSA.</h2>
            <p className="alumni-section-lead">
              Refleksi kepemimpinan, pengalaman berorganisasi, serta wejangan alumni yang kini berkiprah di industri teknologi, rancang bangun, dan riset nasional.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="btn-solane-green"
              onClick={() => setModalOpen(true)}
            >
              <IconPlus size={16} aria-hidden="true" />
              <span>Tulis Kesan Alumni</span>
            </button>
          </div>
        </div>

        {/* Highlights Strip aligned with theme cards */}
        <div className="alumni-highlights-grid" data-reveal="up" data-reveal-delay="80">
          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap green" aria-hidden="true">
              <IconGraduationCap size={20} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">7</div>
              <div className="highlight-label">Program Studi FST Terintegrasi</div>
            </div>
          </div>

          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap orange" aria-hidden="true">
              <IconUsers size={20} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">1.200+</div>
              <div className="highlight-label">Jejaring Alumni Aktif Berdaya</div>
            </div>
          </div>

          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap green" aria-hidden="true">
              <IconRocket size={20} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">98%</div>
              <div className="highlight-label">Kesiapan Karir &amp; Riset Lanjutan</div>
            </div>
          </div>

          <div className="alumni-highlight-item">
            <div className="highlight-icon-wrap orange" aria-hidden="true">
              <IconBriefcase size={20} />
            </div>
            <div className="highlight-content">
              <div className="highlight-number">100%</div>
              <div className="highlight-label">Wadah Sinergi &amp; Mentorship</div>
            </div>
          </div>
        </div>

        {/* Prodi Filter Tabs */}
        <div className="alumni-action-bar">
          <div className="alumni-filter-scroll" role="tablist" aria-label="Filter Program Studi Alumni">
            {filterTabs.map(tab => {
              const count = tab.key === 'all'
                ? alumniList.length
                : alumniList.filter(a => a.kategoriProdi === tab.key).length;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={selectedFilter === tab.key}
                  onClick={() => setSelectedFilter(tab.key)}
                  className={`alumni-tab-btn ${selectedFilter === tab.key ? 'active' : ''}`}
                >
                  <span>{tab.label}</span>
                  <span className="alumni-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alumni Testimonials Grid */}
        <div className="alumni-grid">
          {filteredAlumni.map((item, index) => (
            <article
              key={item.id || index}
              className="alumni-card"
            >
              {/* Card Top: Profile Header */}
              <div className="alumni-profile-header">
                <div className="alumni-avatar-box">
                  <AlumniAvatar src={item.avatar} alt={item.nama} size={54} />
                </div>

                <div className="alumni-profile-meta">
                  <div className="alumni-name-row">
                    <h4 className="alumni-name">{item.nama}</h4>
                    {item.verified && (
                      <span className="alumni-verified-badge" title="Alumni Terverifikasi FST UINSA">
                        <IconCheck size={11} aria-hidden="true" /> Terverifikasi
                      </span>
                    )}
                  </div>

                  <div className="alumni-prodi-line">
                    <span className="alumni-prodi-name">{item.prodi}</span>
                    {item.angkatan && <span className="alumni-dot-sep">&bull;</span>}
                    {item.angkatan && <span>Angkatan {item.angkatan}</span>}
                  </div>

                  {(item.jabatan || item.instansi) && (
                    <div className="alumni-career-line">
                      {item.jabatan}{item.instansi && item.instansi !== '-' ? ` • ${item.instansi}` : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Clean Hairline Quote Sections aligned with Portfolio Card */}
              <div className="alumni-quote-section">
                <span className="alumni-quote-eyebrow is-green">Kesan di Kampus &amp; DEMA</span>
                <p className="alumni-quote-excerpt">
                  &ldquo;{item.kesan}&rdquo;
                </p>
              </div>

              <div className="alumni-quote-section">
                <span className="alumni-quote-eyebrow is-orange">Pesan untuk Mahasiswa</span>
                <p className="alumni-quote-excerpt is-compact">
                  &ldquo;{item.pesan}&rdquo;
                </p>
              </div>

              {/* Card Footer */}
              <div className="alumni-card-footer">
                <div className="alumni-footer-tag">
                  <IconCalendar size={13} aria-hidden="true" />
                  <span>Lulus {item.tahunLulus || '2023'}</span>
                </div>
                <button
                  type="button"
                  className="alumni-read-btn"
                  onClick={() => setDetailModal(item)}
                >
                  <span>Detail Profil</span>
                  <span className="detail-arrow" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state if filter has no data */}
        {filteredAlumni.length === 0 && (
          <div className="alumni-empty-state">
            <IconGraduationCap size={44} className="empty-icon" aria-hidden="true" />
            <h3>Belum Ada Testimoni di Kategori Ini</h3>
            <p>Jadilah alumni pertama dari program studi ini yang membagikan kesan dan pesan inspiratif.</p>
            <button
              type="button"
              className="btn-solane-green"
              onClick={() => setModalOpen(true)}
            >
              <IconPlus size={16} aria-hidden="true" /> Tulis Kesan &amp; Pesan
            </button>
          </div>
        )}

        {/* Bottom Invitation Banner aligned with theme */}
        <div className="alumni-banner-card">
          <div className="alumni-banner-text">
            <h3>Alumni Fakultas Sains dan Teknologi UINSA?</h3>
            <p>
              Setiap jejak langkah Anda adalah lentera inspirasi bagi generasi penerus. Bagikan pengalaman berorganisasi dan motivasi karir Anda melalui portal resmi DEMA FST UINSA.
            </p>
          </div>
          <button
            type="button"
            className="btn-solane-green btn-solane-lg"
            onClick={() => setModalOpen(true)}
          >
            <IconGraduationCap size={18} aria-hidden="true" />
            <span>Bagikan Kesan &amp; Pesan</span>
          </button>
        </div>
      </div>

      {/* MODAL: SUBMIT NEW ALUMNI IMPRESSION */}
      {modalOpen && typeof document !== 'undefined' && createPortal(
        <div className="alumni-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="alumni-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alumni-submit-title"
          >
            <div className="alumni-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="modal-icon-circle green" aria-hidden="true">
                  <IconGraduationCap size={20} />
                </div>
                <div>
                  <h3 id="alumni-submit-title" className="alumni-modal-title">Formulir Kesan &amp; Pesan Alumni</h3>
                  <p className="alumni-modal-subtitle">Kontribusi wejangan Anda sangat berarti bagi mahasiswa FST UINSA.</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Tutup Dialog"
              >
                <IconClose size={18} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="alumni-modal-body">
              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="alumni-nama" className="form-label">
                    Nama Lengkap &amp; Gelar <span className="req">*</span>
                  </label>
                  <input
                    id="alumni-nama"
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Farhan, S.Kom."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alumni-prodi" className="form-label">
                    Program Studi <span className="req">*</span>
                  </label>
                  <select
                    id="alumni-prodi"
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
                  <label htmlFor="alumni-angkatan" className="form-label">Tahun Angkatan Masuk</label>
                  <input
                    id="alumni-angkatan"
                    type="text"
                    placeholder="Contoh: 2019"
                    value={formData.angkatan}
                    onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alumni-lulus" className="form-label">Tahun Kelulusan</label>
                  <input
                    id="alumni-lulus"
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
                  <label htmlFor="alumni-jabatan" className="form-label">Profesi / Jabatan Saat Ini</label>
                  <input
                    id="alumni-jabatan"
                    type="text"
                    placeholder="Contoh: Senior Software Engineer"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="alumni-instansi" className="form-label">Instansi / Perusahaan / Lembaga</label>
                  <input
                    id="alumni-instansi"
                    type="text"
                    placeholder="Contoh: PT Nusantara Teknologi"
                    value={formData.instansi}
                    onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Foto Profil (Opsional)
                </label>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processAvatarFile(file);
                    if (e.target) e.target.value = '';
                  }}
                />
                <div
                  className={`proker-upload-dropzone ${isDraggingAvatar ? 'dragging' : ''}`}
                  style={{ padding: '14px 16px', flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'left', gap: '14px' }}
                  onClick={() => !isUploadingAvatar && avatarInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isUploadingAvatar) {
                      e.preventDefault();
                      avatarInputRef.current?.click();
                    }
                  }}
                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingAvatar(true); }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (!isDraggingAvatar) setIsDraggingAvatar(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingAvatar(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingAvatar(false);
                    const file = e.dataTransfer?.files?.[0];
                    if (file) processAvatarFile(file);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Unggah atau seret foto profil alumni"
                >
                  <img
                    src={formData.avatar || '/default-profile.jpg'}
                    alt="Preview Foto Profil"
                    width={52}
                    height={52}
                    style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)', flexShrink: 0, background: '#fff' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconUpload size={15} style={{ color: 'var(--primary-green-light)' }} aria-hidden="true" />
                      {isUploadingAvatar
                        ? 'Memproses foto...'
                        : isDraggingAvatar
                        ? 'Lepaskan foto di sini'
                        : 'Klik atau seret foto profil dari penyimpanan'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {formData.avatar
                        ? 'Foto profil terpilih siap dikirim'
                        : 'Jika kosong, otomatis menggunakan logo profil standar'}
                    </div>
                  </div>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({ ...prev, avatar: '' }));
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="alumni-kesan" className="form-label">
                  Kesan Selama Berproses di Kampus &amp; DEMA <span className="req">*</span>
                </label>
                <textarea
                  id="alumni-kesan"
                  required
                  rows={3}
                  placeholder="Ceritakan pengalaman organisasi dan nilai positif yang Anda rasakan selama di FST UINSA..."
                  value={formData.kesan}
                  onChange={(e) => setFormData({ ...formData, kesan: e.target.value })}
                  className="form-input form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="alumni-pesan" className="form-label">
                  Pesan &amp; Wejangan untuk Mahasiswa <span className="req">*</span>
                </label>
                <textarea
                  id="alumni-pesan"
                  required
                  rows={3}
                  placeholder="Tuliskan motivasi atau nasihat untuk adik tingkat dan pengurus DEMA FST UINSA..."
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  className="form-input form-textarea"
                />
              </div>

              <div className="alumni-review-notice">
                <IconInfo size={16} aria-hidden="true" />
                <span>
                  <strong>Alur Peninjauan Pengurus:</strong> Testimoni yang Anda kirim akan ditinjau terlebih dahulu oleh pengurus DEMA sebelum dipublikasikan di website.
                </span>
              </div>

              <div className="alumni-modal-actions">
                <button
                  type="button"
                  className="cabinet-footer-close"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-solane-green"
                  style={{ minHeight: '44px' }}
                >
                  {submitting ? (
                    'Mengirim...'
                  ) : (
                    <>
                      <IconSend size={15} aria-hidden="true" /> Kirim Testimoni
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL: READ ALUMNI FULL DETAIL */}
      {detailModal && typeof document !== 'undefined' && createPortal(
        <div className="alumni-modal-overlay" onClick={() => setDetailModal(null)}>
          <div
            className="alumni-modal-card detail-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alumni-detail-title"
          >
            <div className="alumni-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div className="alumni-avatar-box large">
                  <AlumniAvatar src={detailModal.avatar} alt={detailModal.nama} size={62} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div className="alumni-name-row">
                    <h3 id="alumni-detail-title" className="alumni-modal-title">{detailModal.nama}</h3>
                    {detailModal.verified && (
                      <span className="alumni-verified-badge">
                        <IconCheck size={11} aria-hidden="true" /> Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="alumni-prodi-line" style={{ marginTop: '4px' }}>
                    <span className="alumni-prodi-name">{detailModal.prodi}</span>
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
                <IconClose size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="alumni-modal-body">
              {(detailModal.jabatan || detailModal.instansi) && (
                <div className="detail-meta-row">
                  <IconBriefcase size={16} aria-hidden="true" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Kiprah Saat Ini</div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {detailModal.jabatan}{detailModal.instansi && detailModal.instansi !== '-' ? ` • ${detailModal.instansi}` : ''}
                    </div>
                  </div>
                </div>
              )}

              <div className="alumni-quote-section" style={{ marginTop: '16px' }}>
                <span className="alumni-quote-eyebrow is-green">Kesan Mendalam di Kampus &amp; DEMA</span>
                <p className="alumni-quote-full">
                  &ldquo;{detailModal.kesan}&rdquo;
                </p>
              </div>

              <div className="alumni-quote-section">
                <span className="alumni-quote-eyebrow is-orange">Pesan Motivasi untuk Mahasiswa</span>
                <p className="alumni-quote-full">
                  &ldquo;{detailModal.pesan}&rdquo;
                </p>
              </div>

              <div className="alumni-modal-actions">
                <button
                  type="button"
                  className="cabinet-footer-close"
                  onClick={() => setDetailModal(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
