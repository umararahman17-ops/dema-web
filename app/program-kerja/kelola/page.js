'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  IconLock, 
  IconUnlock, 
  IconAlert, 
  IconCheck, 
  IconPlus, 
  IconRefresh, 
  IconEdit, 
  IconTrash, 
  IconDisk, 
  IconCalendar,
  IconClose
} from '@/components/Icons';

export default function KelolaProgramKerjaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState('');

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Check saved session on mount
  useEffect(() => {
    const savedKey = typeof window !== 'undefined' ? sessionStorage.getItem('dema_admin_key') : null;
    if (savedKey) {
      verifyKey(savedKey, true);
    } else {
      setAuthChecking(false);
    }
  }, []);

  const verifyKey = async (keyToTest, isAuto = false) => {
    try {
      if (!isAuto) setAuthChecking(true);
      setAuthError('');

      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyToTest })
      });

      const json = await res.json();
      if (json.success) {
        setIsAuthenticated(true);
        setAdminKey(keyToTest);
        sessionStorage.setItem('dema_admin_key', keyToTest);
        fetchPrograms();
      } else {
        setIsAuthenticated(false);
        setAdminKey('');
        sessionStorage.removeItem('dema_admin_key');
        if (!isAuto) {
          setAuthError(json.message || 'Kunci sandi / PIN pengurus tidak valid!');
        }
      }
    } catch {
      setAuthError('Gagal melakukan verifikasi keamanan.');
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    verifyKey(inputKey.trim());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setInputKey('');
    sessionStorage.removeItem('dema_admin_key');
    showToast('Akses database berhasil dikunci kembali.');
  };

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
      const res = await fetch(`/api/program-kerja?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey
        }
      });
      const json = await res.json();
      if (res.status === 401) {
        handleLogout();
        showToast('Akses ditolak atau sesi berakhir.', 'error');
        return;
      }
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
    if (!confirm('Apakah Anda yakin ingin me-reset database ke data awal bawaan?')) return;

    try {
      const res = await fetch('/api/program-kerja/reset', {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey
        }
      });
      const json = await res.json();
      if (res.status === 401) {
        handleLogout();
        showToast('Akses ditolak atau sesi berakhir.', 'error');
        return;
      }
      if (json.success) {
        showToast(json.message);
        fetchPrograms();
      } else {
        showToast(json.message, 'error');
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.status === 401) {
        handleLogout();
        showToast('Akses ditolak atau sesi berakhir.', 'error');
        return;
      }
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

  // If verifying initial session
  if (authChecking) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(30, 107, 55, 0.12)', color: 'var(--primary-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <IconLock size={26} />
          </div>
          <p>Memeriksa otorisasi keamanan pengurus...</p>
        </div>
      </div>
    );
  }

  // If Not Authenticated -> Show Private Admin Lock Screen
  if (!isAuthenticated) {
    return (
      <section style={{ minHeight: '80vh', padding: '100px 0', background: 'var(--bg-page)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '40px 32px', 
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(224, 99, 31, 0.1)', 
              color: 'var(--accent-orange)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '20px'
            }}>
              <IconLock size={28} />
            </div>

            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
              Area Khusus Pengurus DEMA
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              Basis data program kerja bersifat privat dan terlindungi dari akses publik. Masukkan kunci sandi atau PIN pengurus untuk mengakses panel pengelolaan.
            </p>

            {authError && (
              <div style={{ 
                background: '#fee2e2', 
                color: '#991b1b', 
                border: '1px solid #fca5a5', 
                borderRadius: '8px', 
                padding: '12px 16px', 
                fontSize: '0.85rem', 
                marginBottom: '20px', 
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <IconAlert size={16} /> <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Kunci Akses / PIN Pengurus</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Masukkan kunci sandi pengurus..." 
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  required
                  autoFocus
                  style={{ fontSize: '1rem', padding: '12px 16px' }}
                />
              </div>

              <button type="submit" className="btn btn-orange" style={{ width: '100%', justifyContent: 'center', padding: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <IconUnlock size={18} /> Buka Panel Kelola
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Link href="/" style={{ color: 'var(--primary-green-light)', textDecoration: 'none', fontWeight: 600 }}>
                &larr; Kembali ke Beranda Publik
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If Authenticated -> Render Full Secure Dashboard
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            <IconLock size={14} /> Sesi Pengurus Aktif (Privat)
          </div>
          <h1>Kelola Database Program Kerja</h1>
          <p>Panel pengelolaan database tertutup khusus pengurus DEMA. Seluruh perubahan langsung tersimpan ke basis data internal.</p>
          <div className="breadcrumb-trail">
            <Link href="/">Beranda</Link> &bull; <Link href="/portofolio">Portofolio</Link> &bull; <span>Kelola Database</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 100px', background: 'var(--bg-page)' }}>
        <div className="container">
          {/* Toast Notice */}
          {toast && (
            <div className="toast-notice show" style={{ borderLeftColor: toast.type === 'error' ? '#ef4444' : 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {toast.type === 'error' ? <IconAlert size={18} /> : <IconCheck size={18} />}
              <span>{toast.message}</span>
            </div>
          )}

          {/* Control Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px', background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>Daftar Program Kerja di Database</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Total: <strong>{programs.length} Program Tersimpan</strong> &bull; Basis data terenkripsi &amp; terlindungi.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-orange" onClick={handleOpenAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <IconPlus size={16} /> Tambah Program Baru
              </button>
              <button onClick={handleReset} className="btn btn-outline-green" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <IconRefresh size={15} /> Reset ke Data Awal
              </button>
              <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'var(--bg-surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <IconLock size={14} /> Kunci &amp; Keluar
              </button>
            </div>
          </div>

          {/* Form Tambah / Edit */}
          {showForm && (
            <div style={{ background: 'var(--bg-card)', border: '2px solid var(--accent-orange)', borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  {editingId ? <IconEdit size={22} /> : <IconPlus size={22} />}
                  <span>{editingId ? `Edit Program Kerja #${editingId}` : 'Tambah Program Kerja Baru'}</span>
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Tutup Form">
                  <IconClose size={22} />
                </button>
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
                  <button type="submit" className="btn btn-orange" style={{ padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <IconDisk size={16} /> Simpan ke Database
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <IconCalendar size={13} /> {p.date}
                          </span>
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
                              style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => handleEdit(p)}
                            >
                              <IconEdit size={13} /> Edit
                            </button>
                            <button 
                              className="btn btn-sm" 
                              style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => handleDelete(p.id, p.title)}
                              aria-label="Hapus program"
                            >
                              <IconTrash size={14} />
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
