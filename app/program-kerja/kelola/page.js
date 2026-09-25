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
  IconClose,
  IconChat,
  IconInbox,
  IconSearch,
  IconSend
} from '@/components/Icons';

export default function KelolaPengurusPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState('');

  // Active Tab: 'aspirasi' | 'program-kerja'
  const [activeTab, setActiveTab] = useState('aspirasi');

  // --- PROGRAM KERJA STATES ---
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [programForm, setProgramForm] = useState({
    title: '',
    category: 'sains-teknologi',
    date: '',
    status: 'Sukses Terlaksana',
    tags: '',
    image: '',
    impact: '',
    desc: ''
  });

  // --- ASPIRASI DATABASE STATES ---
  const [aspirasiList, setAspirasiList] = useState([]);
  const [loadingAspirasi, setLoadingAspirasi] = useState(false);
  const [aspirasiSearch, setAspirasiSearch] = useState('');
  const [aspirasiStatusFilter, setAspirasiStatusFilter] = useState('all');
  const [aspirasiCategoryFilter, setAspirasiCategoryFilter] = useState('all');
  const [selectedAspirasi, setSelectedAspirasi] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalTanggapan, setModalTanggapan] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const [toast, setToast] = useState(null);

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
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dema_admin_key', keyToTest);
        }
        fetchAllData(keyToTest);
      } else {
        setIsAuthenticated(false);
        setAuthError(json.message || 'Kunci sandi / PIN pengurus tidak valid!');
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('dema_admin_key');
        }
      }
    } catch {
      setAuthError('Gagal menghubungkan ke server.');
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputKey) return;
    verifyKey(inputKey, false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    setInputKey('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dema_admin_key');
    }
    showToast('Sesi pengurus telah ditutup dan dikunci.', 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchAllData = (key) => {
    fetchAspirasi();
    fetchPrograms();
  };

  // --- ASPIRASI FUNCTIONS ---
  const fetchAspirasi = async () => {
    setLoadingAspirasi(true);
    try {
      const res = await fetch('/api/aspirasi?t=' + Date.now());
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAspirasiList(json.data);
      }
    } catch (err) {
      console.error('Gagal mengambil aspirasi:', err);
    } finally {
      setLoadingAspirasi(false);
    }
  };

  const handleOpenAspirasiDetail = (item) => {
    setSelectedAspirasi(item);
    setModalStatus(item.status || 'Menunggu Ditinjau');
    setModalTanggapan(item.tanggapan || '');
  };

  const handleSaveAspirasiStatus = async (e) => {
    e.preventDefault();
    if (!selectedAspirasi) return;
    setSavingStatus(true);
    try {
      const res = await fetch('/api/aspirasi', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          id: selectedAspirasi.id,
          status: modalStatus,
          tanggapan: modalTanggapan
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast('Tindak lanjut & status aspirasi berhasil disimpan!');
        setSelectedAspirasi(null);
        fetchAspirasi();
      } else {
        showToast(json.message || 'Gagal menyimpan status aspirasi', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menyimpan tindak lanjut.', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeleteAspirasi = async (id, nama) => {
    if (!confirm(`Hapus aspirasi dari "${nama}" dari database?`)) return;
    try {
      const res = await fetch(`/api/aspirasi?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey
        }
      });
      const json = await res.json();
      if (json.success) {
        showToast('Aspirasi berhasil dihapus dari database.');
        fetchAspirasi();
      } else {
        showToast(json.message || 'Gagal menghapus aspirasi', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan saat menghapus aspirasi.', 'error');
    }
  };

  const handleExportAspirasiCSV = () => {
    if (aspirasiList.length === 0) {
      showToast('Tidak ada data aspirasi untuk di-export.', 'error');
      return;
    }
    const headers = ['ID', 'Tanggal', 'Nama', 'Prodi', 'Email', 'Kategori', 'Pesan', 'Status', 'Tindak Lanjut'];
    const rows = aspirasiList.map(a => [
      a.id,
      `"${new Date(a.createdAt).toLocaleString('id-ID')}"`,
      `"${(a.nama || '').replace(/"/g, '""')}"`,
      `"${(a.prodi || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.kategori || '').replace(/"/g, '""')}"`,
      `"${(a.pesan || '').replace(/"/g, '""')}"`,
      `"${(a.status || '').replace(/"/g, '""')}"`,
      `"${(a.tanggapan || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aspirasi_DEMA_FST_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data aspirasi berhasil diunduh sebagai CSV.');
  };

  // --- PROGRAM KERJA FUNCTIONS ---
  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const res = await fetch('/api/program-kerja?category=all&t=' + Date.now());
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPrograms(json.data);
      }
    } catch (err) {
      console.error('Gagal mengambil program kerja:', err);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleOpenAddProgram = () => {
    setEditingProgramId(null);
    setProgramForm({
      title: '',
      category: 'sains-teknologi',
      date: '',
      status: 'Sukses Terlaksana',
      tags: '',
      image: '',
      impact: '',
      desc: ''
    });
    setShowProgramForm(true);
  };

  const handleEditProgram = (item) => {
    setEditingProgramId(item.id);
    setProgramForm({
      title: item.title,
      category: item.category,
      date: item.date,
      status: item.status,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      image: item.image,
      impact: item.impact,
      desc: item.desc
    });
    setShowProgramForm(true);
  };

  const handleDeleteProgram = async (id, title) => {
    if (!confirm(`Hapus program kerja "${title}" dari database?`)) return;
    try {
      const res = await fetch(`/api/program-kerja?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey
        }
      });
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

  const handleResetPrograms = async () => {
    if (!confirm('Apakah Anda yakin ingin me-reset database program kerja ke data awal?')) return;
    try {
      const res = await fetch('/api/program-kerja/reset', {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey
        }
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchPrograms();
      } else {
        showToast(json.message, 'error');
      }
    } catch {
      showToast('Gagal me-reset database program kerja.', 'error');
    }
  };

  const handleSubmitProgram = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...programForm,
        id: editingProgramId || undefined
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
      if (json.success) {
        showToast(json.message);
        setShowProgramForm(false);
        fetchPrograms();
      } else {
        showToast(json.message, 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi saat menyimpan.', 'error');
    }
  };

  // Filtered Aspirasi List
  const filteredAspirasi = aspirasiList.filter((item) => {
    const matchSearch =
      (item.nama || '').toLowerCase().includes(aspirasiSearch.toLowerCase()) ||
      (item.prodi || '').toLowerCase().includes(aspirasiSearch.toLowerCase()) ||
      (item.pesan || '').toLowerCase().includes(aspirasiSearch.toLowerCase()) ||
      (item.kategori || '').toLowerCase().includes(aspirasiSearch.toLowerCase());

    const matchStatus =
      aspirasiStatusFilter === 'all' || item.status === aspirasiStatusFilter;

    const matchCategory =
      aspirasiCategoryFilter === 'all' || item.kategori === aspirasiCategoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  // Aspirasi Stats
  const countTotalAspirasi = aspirasiList.length;
  const countMenunggu = aspirasiList.filter(a => a.status === 'Menunggu Ditinjau').length;
  const countDiproses = aspirasiList.filter(a => a.status === 'Sedang Diproses').length;
  const countSelesai = aspirasiList.filter(a => a.status === 'Selesai Ditindaklanjuti').length;

  // If checking authentication
  if (authChecking) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(30, 107, 55, 0.12)', color: 'var(--primary-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <IconLock size={26} />
          </div>
          <p>Memeriksa otorisasi keamanan pengurus...</p>
        </div>
      </div>
    );
  }

  // If Not Authenticated -> Login Screen
  if (!isAuthenticated) {
    return (
      <section style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'var(--bg-page)' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(30, 107, 55, 0.15), rgba(224, 99, 31, 0.15))', color: 'var(--accent-orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
            <IconLock size={32} />
          </div>
          
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>
            Portal Privat Pengurus DEMA
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            Akses basis data aspirasi mahasiswa &amp; program kerja internal. Masukkan kunci sandi / PIN pengurus untuk membuka panel.
          </p>

          {authError && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <IconAlert size={18} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Kunci Akses / PIN Pengurus</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Masukkan PIN pengurus..." 
                required 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-orange" style={{ width: '100%', padding: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <IconUnlock size={18} /> Buka Dashboard Pengurus
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Dewan Eksekutif Mahasiswa FST UINSA &bull; Kabinet Wigyamerta Antasena
          </div>
        </div>
      </section>
    );
  }

  // Authenticated Dashboard
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            <IconLock size={14} /> Sesi Pengurus Aktif (Privat)
          </div>
          <h1>Pusat Manajemen Database Pengurus</h1>
          <p>Kelola data aspirasi mahasiswa yang masuk serta portofolio program kerja internal DEMA secara real-time.</p>
          <div className="breadcrumb-trail">
            <Link href="/">Beranda</Link> &bull; <span>Portal Pengurus</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 100px', background: 'var(--bg-page)' }}>
        <div className="container">
          {/* Toast Notification */}
          {toast && (
            <div className="toast-notice show" style={{ borderLeftColor: toast.type === 'error' ? '#ef4444' : 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {toast.type === 'error' ? <IconAlert size={18} /> : <IconCheck size={18} />}
              <span>{toast.message}</span>
            </div>
          )}

          {/* Top Bar with Logout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            {/* Tabs Selector */}
            <div style={{ display: 'inline-flex', background: 'var(--bg-card)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('aspirasi')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === 'aspirasi' ? 'var(--primary-green)' : 'transparent',
                  color: activeTab === 'aspirasi' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <IconInbox size={18} />
                <span>Database Aspirasi Mahasiswa</span>
                <span style={{
                  background: activeTab === 'aspirasi' ? 'var(--accent-orange)' : 'var(--bg-surface-subtle)',
                  color: activeTab === 'aspirasi' ? '#ffffff' : 'var(--text-main)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {countTotalAspirasi}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('program-kerja')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === 'program-kerja' ? 'var(--primary-green)' : 'transparent',
                  color: activeTab === 'program-kerja' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <IconCalendar size={18} />
                <span>Database Program Kerja</span>
                <span style={{
                  background: activeTab === 'program-kerja' ? 'var(--accent-orange)' : 'var(--bg-surface-subtle)',
                  color: activeTab === 'program-kerja' ? '#ffffff' : 'var(--text-main)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {programs.length}
                </span>
              </button>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                padding: '9px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <IconLock size={15} /> Kunci &amp; Keluar
            </button>
          </div>

          {/* ==============================================================
              TAB 1: DATABASE ASPIRASI MAHASISWA
              ============================================================== */}
          {activeTab === 'aspirasi' && (
            <div>
              {/* Aspirasi Statistics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Total Aspirasi Masuk</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)' }}>{countTotalAspirasi}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Semua saluran pengaduan</div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(234, 179, 8, 0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#ca8a04', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>⏳ Menunggu Ditinjau</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308' }}>{countMenunggu}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Belum ada tindak lanjut</div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(224, 99, 31, 0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>⚙️ Sedang Diproses</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-orange)' }}>{countDiproses}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Tahap audiensi / koordinasi</div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(34, 197, 94, 0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>✅ Selesai Ditindaklanjuti</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{countSelesai}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>Telah terjawab / tuntas</div>
                </div>
              </div>

              {/* Control & Filter Bar */}
              <div style={{ background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>
                      Kotak Masuk Aspirasi Mahasiswa
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Menampilkan <strong>{filteredAspirasi.length} dari {countTotalAspirasi} aspirasi</strong> tersimpan di database.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleExportAspirasiCSV}
                      className="btn btn-outline-green"
                      style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <IconDisk size={14} /> Unduh CSV
                    </button>
                    <button
                      type="button"
                      onClick={fetchAspirasi}
                      className="btn btn-sm"
                      style={{ background: 'var(--bg-surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <IconRefresh size={14} /> Refresh
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                  {/* Search Bar */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari berdasarkan nama, prodi, atau isi aspirasi..."
                      value={aspirasiSearch}
                      onChange={(e) => setAspirasiSearch(e.target.value)}
                      style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
                    />
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                      <IconSearch size={16} />
                    </div>
                  </div>

                  {/* Filter Status */}
                  <div>
                    <select
                      className="form-control"
                      value={aspirasiStatusFilter}
                      onChange={(e) => setAspirasiStatusFilter(e.target.value)}
                      style={{ fontSize: '0.88rem' }}
                    >
                      <option value="all">Semua Status</option>
                      <option value="Menunggu Ditinjau">Menunggu Ditinjau</option>
                      <option value="Sedang Diproses">Sedang Diproses</option>
                      <option value="Selesai Ditindaklanjuti">Selesai Ditindaklanjuti</option>
                    </select>
                  </div>

                  {/* Filter Kategori */}
                  <div>
                    <select
                      className="form-control"
                      value={aspirasiCategoryFilter}
                      onChange={(e) => setAspirasiCategoryFilter(e.target.value)}
                      style={{ fontSize: '0.88rem' }}
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="Akademik & Perkuliahan">Akademik &amp; Perkuliahan</option>
                      <option value="Fasilitas & Sarpras Kampus">Fasilitas &amp; Sarpras</option>
                      <option value="Advokasi Biaya / UKT">Advokasi UKT</option>
                      <option value="Ide Program & Kolaborasi">Ide &amp; Kolaborasi</option>
                      <option value="Kritik & Masukan DEMA">Kritik &amp; Masukan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Aspirasi List Table */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--table-head-bg)', borderBottom: '2px solid var(--table-head-border)', color: 'var(--text-heading)' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 800, width: '130px' }}>Tanggal</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, width: '190px' }}>Pengirim</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, width: '180px' }}>Kategori</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800 }}>Isi Aspirasi</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, width: '150px' }}>Status</th>
                        <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'center', width: '120px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingAspirasi ? (
                        <tr>
                          <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Memuat data aspirasi dari database...
                          </td>
                        </tr>
                      ) : filteredAspirasi.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Tidak ada aspirasi yang cocok dengan filter atau pencarian saat ini.
                          </td>
                        </tr>
                      ) : (
                        filteredAspirasi.map((item) => {
                          const dateObj = new Date(item.createdAt);
                          const dateFormatted = isNaN(dateObj) ? '-' : dateObj.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          });
                          const timeFormatted = isNaN(dateObj) ? '' : dateObj.toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--table-row-border)', transition: 'background 0.15s ease' }}>
                              {/* Tanggal */}
                              <td style={{ padding: '14px 18px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{dateFormatted}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeFormatted} WIB</div>
                              </td>

                              {/* Pengirim */}
                              <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                                <div style={{ fontWeight: 800, color: 'var(--text-heading)', marginBottom: '2px' }}>
                                  {item.nama}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                  {item.prodi}
                                </div>
                                {item.email && item.email !== '-' && (
                                  <a href={`mailto:${item.email}`} style={{ fontSize: '0.72rem', color: 'var(--accent-orange)', textDecoration: 'underline' }}>
                                    {item.email}
                                  </a>
                                )}
                              </td>

                              {/* Kategori */}
                              <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '4px 10px',
                                  borderRadius: '99px',
                                  fontWeight: 700,
                                  display: 'inline-block',
                                  background: item.kategori.includes('Advokasi')
                                    ? 'rgba(239, 68, 68, 0.12)'
                                    : item.kategori.includes('Fasilitas')
                                    ? 'rgba(224, 99, 31, 0.12)'
                                    : item.kategori.includes('Akademik')
                                    ? 'rgba(59, 130, 246, 0.12)'
                                    : 'rgba(30, 107, 55, 0.12)',
                                  color: item.kategori.includes('Advokasi')
                                    ? '#ef4444'
                                    : item.kategori.includes('Fasilitas')
                                    ? 'var(--accent-orange)'
                                    : item.kategori.includes('Akademik')
                                    ? '#3b82f6'
                                    : 'var(--primary-green-light)',
                                  border: '1px solid var(--border-color)'
                                }}>
                                  {item.kategori}
                                </span>
                              </td>

                              {/* Pesan & Catatan */}
                              <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                                <div style={{ color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '6px' }}>
                                  {item.pesan}
                                </div>
                                {item.tanggapan && (
                                  <div style={{
                                    fontSize: '0.78rem',
                                    background: 'var(--bg-surface-subtle)',
                                    borderLeft: '3px solid var(--primary-green)',
                                    padding: '6px 10px',
                                    borderRadius: '0 6px 6px 0',
                                    color: 'var(--text-muted)'
                                  }}>
                                    <strong>Tindak Lanjut DEMA:</strong> {item.tanggapan}
                                  </div>
                                )}
                              </td>

                              {/* Status */}
                              <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                                <span style={{
                                  fontSize: '0.75rem',
                                  padding: '4px 10px',
                                  borderRadius: '99px',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                  display: 'inline-block',
                                  background: item.status === 'Selesai Ditindaklanjuti'
                                    ? 'rgba(34, 197, 94, 0.15)'
                                    : item.status === 'Sedang Diproses'
                                    ? 'rgba(224, 99, 31, 0.15)'
                                    : 'rgba(234, 179, 8, 0.15)',
                                  color: item.status === 'Selesai Ditindaklanjuti'
                                    ? '#22c55e'
                                    : item.status === 'Sedang Diproses'
                                    ? 'var(--accent-orange)'
                                    : '#ca8a04',
                                  border: '1px solid currentColor'
                                }}>
                                  {item.status}
                                </span>
                              </td>

                              {/* Aksi */}
                              <td style={{ padding: '14px 18px', verticalAlign: 'top', textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-green"
                                    onClick={() => handleOpenAspirasiDetail(item)}
                                    style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    title="Tanggapi atau Ubah Status Aspirasi"
                                  >
                                    <IconEdit size={13} /> Tindak Lanjut
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{ padding: '6px 8px', fontSize: '0.78rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                                    onClick={() => handleDeleteAspirasi(item.id, item.nama)}
                                    title="Hapus Aspirasi dari Database"
                                  >
                                    <IconTrash size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Detail / Tindak Lanjut */}
              {selectedAspirasi && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '580px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <IconEdit size={20} /> Tindak Lanjut Aspirasi #{selectedAspirasi.id}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSelectedAspirasi(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <IconClose size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAspirasiStatus} style={{ padding: '24px' }}>
                      {/* Rincian Pengirim */}
                      <div style={{ background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <div><strong>Pengirim:</strong> {selectedAspirasi.nama}</div>
                          <div><strong>Prodi:</strong> {selectedAspirasi.prodi}</div>
                          <div><strong>Email:</strong> {selectedAspirasi.email}</div>
                          <div><strong>Kategori:</strong> {selectedAspirasi.kategori}</div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
                          <strong>Isi Aspirasi:</strong>
                          <p style={{ marginTop: '4px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                            &ldquo;{selectedAspirasi.pesan}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Update Status */}
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Status Aspirasi Saat Ini</label>
                        <select
                          className="form-control"
                          value={modalStatus}
                          onChange={(e) => setModalStatus(e.target.value)}
                          required
                        >
                          <option value="Menunggu Ditinjau">Menunggu Ditinjau</option>
                          <option value="Sedang Diproses">Sedang Diproses (Audiensi / Koordinasi)</option>
                          <option value="Selesai Ditindaklanjuti">Selesai Ditindaklanjuti</option>
                          <option value="Diarsipkan">Diarsipkan</option>
                        </select>
                      </div>

                      {/* Catatan Tindak Lanjut */}
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Catatan Tindak Lanjut / Respon Pengurus</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Tuliskan respon resmi DEMA atau nota dinas tindak lanjut untuk aspirasi ini..."
                          value={modalTanggapan}
                          onChange={(e) => setModalTanggapan(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedAspirasi(null)}
                          className="btn btn-sm btn-outline-green"
                          style={{ padding: '10px 18px' }}
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={savingStatus}
                          className="btn btn-sm btn-orange"
                          style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <IconDisk size={15} /> {savingStatus ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================================
              TAB 2: DATABASE PROGRAM KERJA (EXISTING FEATURE)
              ============================================================== */}
          {activeTab === 'program-kerja' && (
            <div>
              {/* Program Kerja Header Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>
                    Daftar Program Kerja di Database
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total: <strong>{programs.length} Program Tersimpan</strong> &bull; Tersinkronisasi ke portal publik.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button className="btn btn-orange" onClick={handleOpenAddProgram} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <IconPlus size={16} /> Tambah Program Baru
                  </button>
                  <button onClick={handleResetPrograms} className="btn btn-outline-green" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <IconRefresh size={15} /> Reset ke Data Awal
                  </button>
                </div>
              </div>

              {/* Form Tambah / Edit Program Kerja */}
              {showProgramForm && (
                <div style={{ background: 'var(--bg-card)', border: '2px solid var(--accent-orange)', borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '40px', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      {editingProgramId ? <IconEdit size={22} /> : <IconPlus size={22} />}
                      <span>{editingProgramId ? `Edit Program Kerja #${editingProgramId}` : 'Tambah Program Kerja Baru'}</span>
                    </h3>
                    <button onClick={() => setShowProgramForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Tutup Form">
                      <IconClose size={22} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProgram}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Nama Program Kerja *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Cth: Workshop Artificial Intelligence 2026"
                          required
                          value={programForm.title}
                          onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kategori *</label>
                        <select 
                          className="form-control"
                          value={programForm.category}
                          onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
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
                          value={programForm.date}
                          onChange={(e) => setProgramForm({ ...programForm, date: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Status Program</label>
                        <select 
                          className="form-control"
                          value={programForm.status}
                          onChange={(e) => setProgramForm({ ...programForm, status: e.target.value })}
                        >
                          <option value="Sukses Terlaksana">Sukses Terlaksana</option>
                          <option value="Program Berjalan">Program Berjalan</option>
                          <option value="Segera Datang">Segera Datang</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Target / Dampak Capaian</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Cth: 500 Peserta • 10 Karya"
                          value={programForm.impact}
                          onChange={(e) => setProgramForm({ ...programForm, impact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">URL Foto Dokumentasi / Banner</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://images.unsplash.com/..."
                        value={programForm.image}
                        onChange={(e) => setProgramForm({ ...programForm, image: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tags (Pisahkan dengan koma)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Expo, AI, Riset, Teknologi"
                        value={programForm.tags}
                        onChange={(e) => setProgramForm({ ...programForm, tags: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Deskripsi Lengkap Program Kerja *</label>
                      <textarea 
                        className="form-control" 
                        rows="4"
                        placeholder="Tuliskan latar belakang, tujuan, serta ringkasan pelaksanaan program kerja..."
                        required
                        value={programForm.desc}
                        onChange={(e) => setProgramForm({ ...programForm, desc: e.target.value })}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
                      <button type="submit" className="btn btn-orange" style={{ padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <IconDisk size={16} /> Simpan ke Database
                      </button>
                      <button type="button" onClick={() => setShowProgramForm(false)} className="btn btn-outline-green" style={{ padding: '12px 24px' }}>
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table Program Kerja */}
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
                      {loadingPrograms ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Memuat data dari database...
                          </td>
                        </tr>
                      ) : programs.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Belum ada program kerja di database.
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
                                  onClick={() => handleEditProgram(p)}
                                >
                                  <IconEdit size={13} /> Edit
                                </button>
                                <button 
                                  className="btn btn-sm" 
                                  style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                  onClick={() => handleDeleteProgram(p.id, p.title)}
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
          )}
        </div>
      </section>
    </>
  );
}
