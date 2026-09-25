'use client';

import { useState } from 'react';
import { IconSend, IconCheck } from '@/components/Icons';

export default function AspirasiForm() {
  const [formData, setFormData] = useState({
    nama: '',
    prodi: '',
    email: '',
    kategori: 'Akademik & Perkuliahan',
    pesan: ''
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/aspirasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage('Aspirasi Anda berhasil dikirim ke Dewan Eksekutif Mahasiswa! Terima kasih.');
        setFormData({
          nama: '',
          prodi: '',
          email: '',
          kategori: 'Akademik & Perkuliahan',
          pesan: ''
        });
      } else {
        setToastMessage('Gagal mengirim aspirasi: ' + data.message);
      }
    } catch {
      setToastMessage('Terjadi kesalahan koneksi saat mengirim aspirasi.');
    } finally {
      setLoading(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="aspirasi-form">
        <div className="form-group">
          <label className="form-label">Nama Lengkap </label>
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Program Studi &amp; Angkatan *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Cth: Teknik Informatika 2024"
            required
            value={formData.prodi}
            onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Alamat Email Aktif *</label>
          <input
            type="email"
            className="form-control"
            placeholder="nama@student.uinsa.ac.id atau email pribadi aktif"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <small style={{ display: 'block', marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            💡 <strong>Wajib diisi:</strong> Pengurus DEMA akan mengirimkan respon resmi dan pembaruan progres tindak lanjut langsung ke email Anda.
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Kategori Aspirasi *</label>
          <select
            className="form-control"
            value={formData.kategori}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            required
          >
            <option value="Akademik & Perkuliahan">Akademik &amp; Perkuliahan</option>
            <option value="Fasilitas & Sarpras Kampus">Fasilitas &amp; Sarana Kampus</option>
            <option value="Advokasi Biaya / UKT">Advokasi Biaya Kuliah / UKT</option>
            <option value="Ide Program & Kolaborasi">Ide Program &amp; Kolaborasi Riset</option>
            <option value="Kritik & Masukan DEMA">Kritik &amp; Evaluasi DEMA</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Isi Aspirasi / Pesan *</label>
          <textarea
            className="form-control"
            placeholder="Tuliskan aspirasi atau masukan Anda secara jelas..."
            required
            value={formData.pesan}
            onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn btn-orange" style={{ width: '100%', padding: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <IconSend size={16} /> {loading ? 'Mengirim Aspirasi...' : 'Kirimkan Aspirasi Sekarang'}
        </button>
      </form>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice show" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconCheck size={20} /> {toastMessage}
        </div>
      )}
    </>
  );
}
