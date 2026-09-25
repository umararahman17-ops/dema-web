import fs from 'fs';
import path from 'path';
import os from 'os';
import { supabase } from './supabase';

const isVercel = Boolean(process.env.VERCEL);
const localDataDir = path.join(process.cwd(), 'data');
const localFilePath = path.join(localDataDir, 'aspirasi.json');
const tmpFilePath = path.join(os.tmpdir(), 'aspirasi.json');

export const defaultAspirasi = [
  {
    id: 1,
    nama: 'M. Rizky Pratama',
    prodi: 'Teknik Informatika (2024)',
    email: 'rizky.ti24@student.uinsa.ac.id',
    kategori: 'Fasilitas & Sarpras Kampus',
    pesan: 'Mohon izin mengusulkan penambahan colokan listrik dan perbaikan proyektor di Lab Komputasi Lantai 4 Gedung Saintek, karena proyektor sering berkedip saat jam praktikum berlangsung.',
    status: 'Sedang Diproses',
    tanggapan: 'Sudah diajukan dalam audiensi nota dinas ke Kasubbag Sarpras Fakultas pada 20 September 2026.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 2,
    nama: 'Siti Nurhaliza',
    prodi: 'Sistem Informasi (2023)',
    email: 'siti.si23@student.uinsa.ac.id',
    kategori: 'Advokasi Biaya / UKT',
    pesan: 'Ingin berkonsultasi mengenai alur pengajuan perpanjangan masa banding UKT semester depan dan pendampingan berkas advokasi bagi keluarga terdampak musibah.',
    status: 'Selesai Ditindaklanjuti',
    tanggapan: 'Departemen Advokasi telah mendampingi pengisian form banding dan berkas telah divalidasi ke Dekanat.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 3,
    nama: 'Ahmad Fajar',
    prodi: 'Biologi (2025)',
    email: 'fajar.bio25@student.uinsa.ac.id',
    kategori: 'Akademik & Perkuliahan',
    pesan: 'Saran untuk penjadwalan ujian responsi praktikum agar tidak bertumpuk pada hari yang sama dengan ujian teori, agar mahasiswa lebih fokus dan optimal.',
    status: 'Menunggu Ditinjau',
    tanggapan: '',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 4,
    nama: 'Dian Ayu Lestari',
    prodi: 'Teknik Lingkungan (2024)',
    email: 'dian.tl24@student.uinsa.ac.id',
    kategori: 'Ide Program & Kolaborasi',
    pesan: 'Gagasan usulan program kolaborasi riset pengolahan limbah plastik dan audit emisi karbon di lingkungan kampus FST UINSA bersama HMJ dan Komunitas Green Campus.',
    status: 'Sedang Diproses',
    tanggapan: 'Diteruskan ke Biro Ristek & Inovasi untuk diagendakan dalam diskusi proker gabungan.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 5,
    nama: 'Bayu Hendrawan',
    prodi: 'Arsitektur (2023)',
    email: 'bayu.arsitektur23@gmail.com',
    kategori: 'Kritik & Masukan DEMA',
    pesan: 'Apresiasi untuk peluncuran website resmi DEMA yang sangat interaktif dan responsif! Usulan ke depannya agar ringkasan hasil rapat dan ketercapaian program kerja dapat diakses rutin di portal ini.',
    status: 'Selesai Ditindaklanjuti',
    tanggapan: 'Terima kasih atas apresiasinya. Fitur publikasi portofolio berkala telah diintegrasikan pada portal resmi.',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

let memoryStore = null;

function getDataFilePath() {
  if (isVercel) return tmpFilePath;
  return localFilePath;
}

function ensureDataFile() {
  const filePath = getDataFilePath();
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // ignore
    }
  }

  if (!fs.existsSync(filePath)) {
    let initialData = defaultAspirasi;
    if (fs.existsSync(localFilePath)) {
      try {
        initialData = JSON.parse(fs.readFileSync(localFilePath, 'utf-8'));
      } catch {
        initialData = defaultAspirasi;
      }
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch {
      memoryStore = initialData;
    }
  }
}

function getLocalAspirasi() {
  ensureDataFile();
  const filePath = getDataFilePath();
  let list = defaultAspirasi;

  if (memoryStore) {
    list = memoryStore;
  } else if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      list = defaultAspirasi;
    }
  } else if (fs.existsSync(localFilePath)) {
    try {
      const raw = fs.readFileSync(localFilePath, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      list = defaultAspirasi;
    }
  }
  return list;
}

function formatAspirasiItem(item) {
  return {
    id: Number(item.id),
    nama: item.nama || 'Anonim',
    prodi: item.prodi || '-',
    email: item.email || '-',
    kategori: item.kategori || 'Umum',
    pesan: item.pesan || '',
    status: item.status || 'Menunggu Ditinjau',
    tanggapan: item.tanggapan || item.catatan_pengurus || '',
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    updatedAt: item.updated_at || item.updatedAt || new Date().toISOString()
  };
}

export async function getAllAspirasi() {
  // 1. Coba ambil dari Supabase Cloud jika tabel public.aspirasi tersedia
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('aspirasi')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(formatAspirasiItem);
      }
    } catch (err) {
      console.warn('Supabase aspirasi query failed, falling back to local:', err.message);
    }
  }

  // 2. Fallback ke basis data lokal JSON
  const list = getLocalAspirasi();
  return list.map(formatAspirasiItem);
}

export async function createAspirasi(payload) {
  const itemToSave = {
    nama: payload.nama?.trim() || 'Anonim',
    prodi: payload.prodi?.trim() || '-',
    email: payload.email?.trim() || '-',
    kategori: payload.kategori || 'Umum',
    pesan: payload.pesan?.trim() || '',
    status: 'Menunggu Ditinjau',
    catatan_pengurus: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let savedItem = null;

  // 1. Coba simpan ke Supabase Cloud
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('aspirasi')
        .insert([itemToSave])
        .select()
        .single();

      if (!error && data) {
        savedItem = formatAspirasiItem(data);
      }
    } catch (err) {
      console.warn('Gagal menyimpan aspirasi ke Supabase, fallback lokal:', err.message);
    }
  }

  // 2. Simpan ke database lokal
  ensureDataFile();
  const list = [...getLocalAspirasi()];
  const nextId = list.length > 0 ? Math.max(...list.map(a => Number(a.id) || 0)) + 1 : 1;

  if (!savedItem) {
    savedItem = {
      id: nextId,
      ...itemToSave,
      tanggapan: '',
      createdAt: itemToSave.created_at,
      updatedAt: itemToSave.updated_at
    };
  }

  list.unshift(savedItem);
  memoryStore = list;

  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write aspirasi to disk:', err.message);
  }

  return savedItem;
}

export async function updateAspirasi(id, updates) {
  let updatedItem = null;

  // 1. Supabase
  if (supabase) {
    try {
      const payload = {
        updated_at: new Date().toISOString()
      };
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.tanggapan !== undefined) payload.catatan_pengurus = updates.tanggapan;

      const { data, error } = await supabase
        .from('aspirasi')
        .update(payload)
        .eq('id', Number(id))
        .select()
        .single();

      if (!error && data) {
        updatedItem = formatAspirasiItem(data);
      }
    } catch (err) {
      console.warn('Gagal update di Supabase, fallback lokal:', err.message);
    }
  }

  // 2. Lokal
  ensureDataFile();
  const list = [...getLocalAspirasi()];
  const index = list.findIndex(a => Number(a.id) === Number(id));

  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    if (!updatedItem) updatedItem = list[index];
    memoryStore = list;
    try {
      fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to disk:', err.message);
    }
  }

  return updatedItem;
}

export async function deleteAspirasi(id) {
  // 1. Supabase
  if (supabase) {
    try {
      await supabase.from('aspirasi').delete().eq('id', Number(id));
    } catch (err) {
      console.warn('Gagal menghapus di Supabase:', err.message);
    }
  }

  // 2. Lokal
  ensureDataFile();
  const list = getLocalAspirasi().filter(a => Number(a.id) !== Number(id));
  memoryStore = list;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk:', err.message);
  }
  return true;
}

export async function resetAspirasi() {
  if (supabase) {
    try {
      await supabase.from('aspirasi').delete().neq('id', 0);
      const rows = defaultAspirasi.map(a => ({
        id: a.id,
        nama: a.nama,
        prodi: a.prodi,
        email: a.email,
        kategori: a.kategori,
        pesan: a.pesan,
        status: a.status,
        catatan_pengurus: a.tanggapan
      }));
      await supabase.from('aspirasi').insert(rows);
    } catch (err) {
      console.warn('Gagal reset di Supabase:', err.message);
    }
  }

  memoryStore = defaultAspirasi;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(defaultAspirasi, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk:', err.message);
  }
  return defaultAspirasi;
}
