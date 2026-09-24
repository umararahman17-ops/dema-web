'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function KelolaProgramKerjaPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'sains-teknologi',
    date: '',
    status: 'Sukses Terlaksana',
    tags: '',
    image: '',
    impact: '',
    desc: ''
  });

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/program-kerja');
      const json = await res.json();
      if (json.success) {
        setPrograms(json.data);
      }
    } catch {
      showToast('Gagal memuat data program kerja', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      category: 'sains-teknologi',
      date: '',
      status: 'Sukses Terlaksana',
      tags: '',
      image: '',
      impact: '',
      desc: ''
    });
    setShowForm(true);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      category: p.category || 'sains-teknologi',
      date: p.date || '',
      status: p.status || 'Sukses Terlaksana',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      image: p.image || '',
      impact: p.impact || '',
      desc: p.desc || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Hapus program kerja "${title}" dari database?`)) return;

    try {
      const res = await fetch(`/api/program-kerja?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchPrograms();
      } else {
        showToast(json.message, 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const handleReset = async () => {
    if (!confirm('Apakah Anda yakin ingin me-reset database ke 6 data awal bawaan?')) return;

    try {
      const res = await fetch('/api/program-kerja/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchPrograms();
      }
    } catch {
      showToast('Gagal me-reset database.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        id: editingId || undefined
      };

      const res = await fetch('/api/program-kerja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setShowForm(false);
        fetchPrograms();
      } else {
        showToast(json.message, 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi saat menyimpan.', 'error');
    }
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Kelola Database Program Kerja</h1>
          <p>Panel pengelolaan basis data program kerja &amp; portofolio DEMA. Data yang diubah di sini langsung tersimpan ke database Next.js dan tampil secara real-time di seluruh halaman website.</p>
          <div className="breadcrumb-trail">
            <Link href="/">Beranda</Link> &bull; <Link href="/portofolio">Portofolio</Link> &bull; <span>Kelola Database</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px', background: 'var(--bg-page)' }}>
        <div className="container">
          {/* Toast Notice */}
          {toast && (
            <div className="toast-notice show" style={{ borderLeftColor: toast.type === 'error' ? '#ef4444' : 'var(--accent-orange)' }}>
              <span style={{ fontSize: '1.2rem' }}>{toast.type === 'error' ? '⚠️' : '✓'}</span> {toast.message}
            </div>
          )}

          {/* Control Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px', background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>Daftar Program Kerja di Database</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Total: <strong>{programs.length} Program Tersimpan</strong> di database JSON/SQLite (<code>data/program_kerja.json</code>).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-orange" onClick={handleOpenAdd}>
                <span>➕</span> Tambah Program Baru
              </button>
              <button onClick={handleReset} className="btn btn-outline-green" style={{ fontSize: '0.85rem' }}>
                <span>🔄</span> Reset ke Data Awal
              </button>
              <Link href="/portofolio" target="_blank" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                <span>👁️</span> Lihat Tampilan Publik &rarr;
              </Link>
            </div>
          </div>

          {/* Form Tambah / Edit */}
          {showForm && (
            <div style={{ background: 'var(--bg-card)', border: '2px solid var(--accent-orange)', borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {editingId ? `✏️ Edit Program Kerja #${editingId}` : '➕ Tambah Program Kerja Baru'}
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Program Kerja *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Cth: Workshop Artificial Intelligence 2026"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kategori *</label>
                    <select 
                      className="form-control"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    >
                      <option value="sains-teknologi">Sains &amp; Teknologi</option>
                      <option value="sosial-pengabdian">Sosial &amp; Pengabdian</option>
                      <option value="kaderisasi">Kaderisasi &amp; Karir</option>
                      <option value="advokasi">Advokasi Mahasiswa</option>
                      <option value="seni-kreatif">Kreatif &amp; Seni</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Jadwal / Waktu Pelaksanaan *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Cth: 15-18 Mei 2026 / Berkala"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status Program</label>
                    <select 
                      className="form-control"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Sukses Terlaksana">Sukses Terlaksana</option>
                      <option value="Program Berjalan">Program Berjalan</option>
                      <option value="Segera Datang">Segera Datang</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags / Kata Kunci (Pisahkan koma)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Cth: AI, Workshop, Riset"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL Foto / Gambar Ilustrasi</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https://images.unsplash.com/... (atau kosongkan untuk gambar bawaan)"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dampak / Capaian Utama</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Cth: 200+ Peserta • 15 Karya Terpilih"
                    value={form.impact}
                    onChange={(e) => setForm({ ...form, impact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Lengkap Program *</label>
                  <textarea 
                    className="form-control" 
                    style={{ minHeight: '100px' }}
                    placeholder="Uraikan tujuan, sasaran, dan deskripsi kegiatan secara rinci..."
                    required
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-orange" style={{ padding: '12px 28px' }}>
                    <span>💾</span> Simpan ke Database
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline-green" style={{ padding: '12px 24px' }}>
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--table-head-bg)', borderBottom: '2px solid var(--table-head-border)', color: 'var(--text-heading)' }}>
                    <th style={{ padding: '16px 20px', fontWeight: 800, width: '60px' }}>Foto</th>
                    <th style={{ padding: '16px 20px', fontWeight: 800 }}>Judul Program Kerja</th>
                    <th style={{ padding: '16px 20px', fontWeight: 800 }}>Kategori</th>
                    <th style={{ padding: '16px 20px', fontWeight: 800 }}>Jadwal</th>
                    <th style={{ padding: '16px 20px', fontWeight: 800 }}>Status</th>
                    <th style={{ padding: '16px 20px', fontWeight: 800 }}>Dampak</th>
                    <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'center', width: '140px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Memuat data dari database...
                      </td>
                    </tr>
                  ) : programs.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Belum ada program kerja di database. Klik tombol <strong>Tambah Program Baru</strong> atau <strong>Reset ke Data Awal</strong> di atas.
                      </td>
                    </tr>
                  ) : (
                    programs.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--table-row-border)', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <img src={p.image} alt="Thumbnail" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-surface-subtle)' }} />
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.95rem', marginBottom: '4px' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {p.desc ? p.desc.slice(0, 80) + '...' : ''}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: '0.75rem', background: 'var(--tag-bg)', color: 'var(--primary-green-light)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '99px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {p.categoryName || p.category}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                          📅 {p.date}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(224,99,31,0.15)', color: 'var(--accent-orange-light)', padding: '4px 10px', borderRadius: '99px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {p.impact}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              className="btn btn-sm btn-outline-green" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => handleEdit(p)}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="btn btn-sm" 
                              style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                              onClick={() => handleDelete(p.id, p.title)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
