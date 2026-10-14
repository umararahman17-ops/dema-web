import fs from 'fs';
import path from 'path';
import os from 'os';
import { supabase } from './supabase.js';

const isVercel = Boolean(process.env.VERCEL);
const localDataDir = path.join(process.cwd(), 'data');
const localFilePath = path.join(localDataDir, 'alumni.json');
const tmpFilePath = path.join(os.tmpdir(), 'alumni.json');

export const defaultAlumni = [
  {
    id: 1,
    nama: 'Muhammad Farhan, S.Kom.',
    prodi: 'Sistem Informasi',
    angkatan: '2019',
    tahunLulus: '2023',
    jabatan: 'Lead Enterprise Data Architect',
    instansi: 'Tech Enterprise Indonesia',
    kesan: 'Berproses di DEMA FST UINSA menempa kepemimpinan, cara berpikir kritis, dan kemampuan diplomasi di luar bangku kuliah. Ruang riset dan kolaborasi ormawa membuka gerbang karir saya di industri teknologi informasi modern.',
    pesan: 'Kuasai fundamental arsitektur sistem dan data, jangan ragu melahirkan inovasi digital dari riset kampus, dan rawat etika integritas moral. Dunia industri menanti karya terbaik kalian!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'sistem-informasi',
    verified: true,
    createdAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 2,
    nama: 'Ahmad Zaki Al-Farisi, S.Ars.',
    prodi: 'Arsitektur',
    angkatan: '2019',
    tahunLulus: '2023',
    jabatan: 'Architectural Project Lead & Urban Designer',
    instansi: 'Studio Rancang Bangun Nusantara',
    kesan: 'Sinergi antar program studi di FST melalui DEMA mengajarkan saya bahwa arsitektur bukan sekadar estetika bangunan fisik, melainkan integrasi harmoni lingkungan hidup, sains komputasi, dan nilai humanisme.',
    pesan: 'Manfaatkan ruang organisasi ormawa untuk melatih negosiasi gagasan dan kerja lintas disiplin. Jaga terus semangat paseduluran dan kebanggaan almamater FST UINSA.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'arsitektur',
    verified: true,
    createdAt: '2026-08-20T14:30:00.000Z'
  },
  {
    id: 3,
    nama: 'Nadia Safitri, S.Si.',
    prodi: 'Biologi',
    angkatan: '2018',
    tahunLulus: '2022',
    jabatan: 'Environmental Sustainability Specialist',
    instansi: 'Lembaga Konservasi & Riset Hayati',
    kesan: 'DEMA FST adalah rumah yang menyatukan sains hayati dengan kepekaan sosial kemasyarakatan. Setiap program kerja pengabdian melatih kami untuk selalu membumikan sains demi kemaslahatan masyarakat luas.',
    pesan: 'Jangan pernah merasa riset sains itu jauh dari masyarakat. Teruslah bereksplorasi di laboratorium, publikasikan karya ilmiah, dan jadikan ilmu bermanfaat sebagai jariyah peradaban.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'biologi',
    verified: true,
    createdAt: '2026-08-28T09:15:00.000Z'
  },
  {
    id: 4,
    nama: 'Nurul Hidayah, S.Mat.',
    prodi: 'Matematika',
    angkatan: '2020',
    tahunLulus: '2024',
    jabatan: 'Quantitative Risk Analyst',
    instansi: 'Fintech Analytics Group',
    kesan: 'Matematika melatih ketelitian logika, dan DEMA melatih keberanian eksekusi. Kombinasi nalar deduktif dan ketangkasan organisasi adalah bekal tak ternilai di era kecerdasan buatan.',
    pesan: 'Jangan pernah ragu dengan keilmuan sains murni. Dari rumus dan algoritma yang kalian pelajari hari ini, teknologi komputasi masa depan dibangun. Teruslah berkarya dan berprestasi!',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed292022?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'matematika',
    verified: true,
    createdAt: '2026-09-02T11:45:00.000Z'
  },
  {
    id: 5,
    nama: 'Rahmat Hidayatullah, S.Kel.',
    prodi: 'Ilmu Kelautan',
    angkatan: '2019',
    tahunLulus: '2023',
    jabatan: 'Marine Oceanographer & Coastal GIS Specialist',
    instansi: 'Balai Pengelolaan Sumberdaya Pesisir & Laut',
    kesan: 'Eksplorasi riset maritim dan dinamika kepengurusan di DEMA FST menanamkan wawasan kebangsaan maritim yang luas. DEMA selalu mendukung ekspedisi ilmiah dan aksi konservasi pesisir kami.',
    pesan: 'Indonesia adalah poros maritim dunia. Mahasiswa Ilmu Kelautan FST UINSA harus berani memimpin riset oseanografi, pelestarian terumbu karang, dan kemajuan ekonomi biru nasional.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'ilmu-kelautan',
    verified: true,
    createdAt: '2026-09-06T08:30:00.000Z'
  },
  {
    id: 6,
    nama: 'Arya Pratama Wicaksana, S.T.',
    prodi: 'Teknik Sipil',
    angkatan: '2019',
    tahunLulus: '2023',
    jabatan: 'Structural Engineering Consultant',
    instansi: 'BUMN Rekayasa Infrastruktur Publik',
    kesan: 'Belajar manajemen proyek, mitigasi risiko organisasi, dan kepemimpinan di DEMA menjadi pondasi kokoh saat saya memimpin koordinasi konstruksi infrastruktur di lapangan kerja nyata.',
    pesan: 'Jadilah insinyur sipil yang kokoh memegang nilai kejujuran, keselamatan publik, dan etika profesional. Rancanglah infrastruktur peradaban yang aman, efisien, dan berkelanjutan.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'teknik-sipil',
    verified: true,
    createdAt: '2026-09-10T14:15:00.000Z'
  },
  {
    id: 7,
    nama: 'Dimas Bagus Wicaksono, S.T.',
    prodi: 'Teknik Lingkungan',
    angkatan: '2019',
    tahunLulus: '2023',
    jabatan: 'Water & Environmental Engineer',
    instansi: 'Konsultan Rekayasa Lingkungan Hidup',
    kesan: 'Kanal audiensi dan pergerakan advokasi DEMA FST membimbing kami untuk berani bersuara secara santun, terstruktur, dan berbasis data saintifik yang valid.',
    pesan: 'Bagi rekan-rekan mahasiswa: jadilah garda terdepan pelestari lingkungan dan sains hijau. Tetap solid, dukung program kerja DEMA, dan harumkan nama fakultas tercinta.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    kategoriProdi: 'teknik-lingkungan',
    verified: true,
    createdAt: '2026-09-18T16:20:00.000Z'
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
    let initialData = defaultAlumni;
    if (fs.existsSync(localFilePath)) {
      try {
        initialData = JSON.parse(fs.readFileSync(localFilePath, 'utf-8'));
      } catch {
        initialData = defaultAlumni;
      }
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch {
      memoryStore = initialData;
    }
  }
}

function getLocalAlumni() {
  ensureDataFile();
  const filePath = getDataFilePath();
  let list = defaultAlumni;

  if (memoryStore) {
    list = memoryStore;
  } else if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      list = defaultAlumni;
    }
  } else if (fs.existsSync(localFilePath)) {
    try {
      const raw = fs.readFileSync(localFilePath, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      list = defaultAlumni;
    }
  }
  return list;
}

export function normalizeKategori(prodi = '') {
  const p = prodi.toLowerCase();
  if (p.includes('sistem informasi') || p === 'si') return 'sistem-informasi';
  if (p.includes('arsitektur') || p.includes('arsi')) return 'arsitektur';
  if (p.includes('biologi') || p.includes('bio')) return 'biologi';
  if (p.includes('matematika') || p.includes('mat')) return 'matematika';
  if (p.includes('kelautan') || p.includes('laut')) return 'ilmu-kelautan';
  if (p.includes('sipil')) return 'teknik-sipil';
  if (p.includes('lingkungan')) return 'teknik-lingkungan';
  return 'sistem-informasi';
}

function formatAlumniItem(item) {
  const isVerified = item.verified === true || item.verified === 'true';
  let status = item.status;
  if (!status) {
    status = isVerified ? 'Disetujui' : 'Menunggu Ditinjau';
  }

  return {
    id: Number(item.id),
    nama: item.nama || 'Alumni FST UINSA',
    prodi: item.prodi || 'Fakultas Sains dan Teknologi',
    angkatan: item.angkatan || '-',
    tahunLulus: item.tahunLulus || item.tahun_lulus || '-',
    jabatan: item.jabatan || 'Praktisi Profesional',
    instansi: item.instansi || '-',
    kesan: item.kesan || '',
    pesan: item.pesan || '',
    avatar: item.avatar || '',
    rating: Number(item.rating) || 5,
    kategoriProdi: item.kategoriProdi || item.kategori_prodi || normalizeKategori(item.prodi),
    verified: isVerified,
    status: status,
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString()
  };
}

export async function getAllAlumni(kategori = 'all', options = { onlyVerified: true }) {
  const onlyVerified = options?.onlyVerified !== false;
  const statusFilter = options?.status || 'all';

  let list = [];

  // 1. Supabase Check
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('kesan_pesan_alumni')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        list = data.map(formatAlumniItem);
      }
    } catch (err) {
      console.warn('Supabase query kesan_pesan_alumni failed, fallback local:', err.message);
    }
  }

  // 2. Local File
  if (list.length === 0) {
    list = getLocalAlumni().map(formatAlumniItem);
  }

  // Filter Kategori Prodi
  if (kategori && kategori !== 'all') {
    list = list.filter(item => item.kategoriProdi === kategori);
  }

  // Filter Publikasi / Status
  if (onlyVerified) {
    list = list.filter(item => item.verified === true && item.status !== 'Ditolak');
  } else if (statusFilter && statusFilter !== 'all') {
    list = list.filter(item => item.status === statusFilter);
  }

  return list;
}

export async function createAlumni(payload) {
  const kategoriProdi = payload.kategoriProdi || normalizeKategori(payload.prodi);

  // Status awal: Menunggu Ditinjau oleh pengurus (verified: false)
  const newRecord = {
    nama: payload.nama?.trim() || 'Alumni FST',
    prodi: payload.prodi?.trim() || 'Sistem Informasi',
    angkatan: payload.angkatan?.trim() || '-',
    tahunLulus: payload.tahunLulus?.trim() || payload.tahun_lulus?.trim() || '-',
    jabatan: payload.jabatan?.trim() || 'Praktisi Profesional',
    instansi: payload.instansi?.trim() || '-',
    kesan: payload.kesan?.trim() || '',
    pesan: payload.pesan?.trim() || '',
    avatar: payload.avatar?.trim() || '',
    rating: Number(payload.rating) || 5,
    kategoriProdi,
    verified: false,
    status: 'Menunggu Ditinjau',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  let savedItem = null;

  // 1. Supabase insert
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('kesan_pesan_alumni')
        .insert([{
          nama: newRecord.nama,
          prodi: newRecord.prodi,
          angkatan: newRecord.angkatan,
          tahun_lulus: newRecord.tahunLulus,
          jabatan: newRecord.jabatan,
          instansi: newRecord.instansi,
          kesan: newRecord.kesan,
          pesan: newRecord.pesan,
          avatar: newRecord.avatar,
          rating: newRecord.rating,
          kategori_prodi: newRecord.kategoriProdi,
          verified: false,
          status: 'Menunggu Ditinjau'
        }])
        .select()
        .single();

      if (!error && data) {
        savedItem = formatAlumniItem(data);
      }
    } catch (err) {
      console.warn('Gagal insert ke Supabase alumni, fallback ke JSON lokal:', err.message);
    }
  }

  // 2. Local storage
  ensureDataFile();
  const list = [...getLocalAlumni()];
  const nextId = list.length > 0 ? Math.max(...list.map(a => Number(a.id) || 0)) + 1 : 1;

  if (!savedItem) {
    savedItem = {
      id: nextId,
      ...newRecord
    };
  }

  list.unshift(savedItem);
  memoryStore = list;

  const filePath = getDataFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    memoryStore = list;
  }

  if (fs.existsSync(localFilePath) && filePath !== localFilePath) {
    try {
      fs.writeFileSync(localFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }

  return formatAlumniItem(savedItem);
}

export async function updateAlumni(id, updates) {
  let updatedItem = null;
  const numId = Number(id);

  let isVerified = updates.verified;
  let status = updates.status;

  if (status === 'Disetujui') {
    isVerified = true;
  } else if (status === 'Menunggu Ditinjau' || status === 'Ditolak') {
    isVerified = false;
  } else if (isVerified !== undefined) {
    isVerified = Boolean(isVerified);
    status = isVerified ? 'Disetujui' : 'Menunggu Ditinjau';
  }

  const payloadToUpdate = {
    updated_at: new Date().toISOString()
  };

  if (isVerified !== undefined) payloadToUpdate.verified = isVerified;
  if (status !== undefined) payloadToUpdate.status = status;
  if (updates.nama !== undefined) payloadToUpdate.nama = updates.nama;
  if (updates.prodi !== undefined) payloadToUpdate.prodi = updates.prodi;
  if (updates.angkatan !== undefined) payloadToUpdate.angkatan = updates.angkatan;
  if (updates.tahunLulus !== undefined) payloadToUpdate.tahun_lulus = updates.tahunLulus;
  if (updates.tahun_lulus !== undefined) payloadToUpdate.tahun_lulus = updates.tahun_lulus;
  if (updates.jabatan !== undefined) payloadToUpdate.jabatan = updates.jabatan;
  if (updates.instansi !== undefined) payloadToUpdate.instansi = updates.instansi;
  if (updates.kesan !== undefined) payloadToUpdate.kesan = updates.kesan;
  if (updates.pesan !== undefined) payloadToUpdate.pesan = updates.pesan;
  if (updates.rating !== undefined) payloadToUpdate.rating = Number(updates.rating);

  // 1. Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('kesan_pesan_alumni')
        .update(payloadToUpdate)
        .eq('id', numId)
        .select()
        .single();

      if (!error && data) {
        updatedItem = formatAlumniItem(data);
      }
    } catch (err) {
      console.warn('Gagal update di Supabase alumni, fallback lokal:', err.message);
    }
  }

  // 2. Local File
  ensureDataFile();
  const list = [...getLocalAlumni()];
  const index = list.findIndex(a => Number(a.id) === numId);

  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...updates,
      verified: isVerified !== undefined ? isVerified : list[index].verified,
      status: status || list[index].status || (list[index].verified ? 'Disetujui' : 'Menunggu Ditinjau'),
      updatedAt: new Date().toISOString()
    };
    if (!updatedItem) updatedItem = formatAlumniItem(list[index]);
    memoryStore = list;

    const filePath = getDataFilePath();
    try {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write alumni to disk:', err.message);
    }

    if (fs.existsSync(localFilePath) && filePath !== localFilePath) {
      try {
        fs.writeFileSync(localFilePath, JSON.stringify(list, null, 2), 'utf-8');
      } catch {
        // ignore
      }
    }
  }

  return updatedItem;
}

export async function deleteAlumni(id) {
  const numId = Number(id);

  // 1. Supabase
  if (supabase) {
    try {
      await supabase.from('kesan_pesan_alumni').delete().eq('id', numId);
    } catch (err) {
      console.warn('Gagal menghapus alumni di Supabase:', err.message);
    }
  }

  // 2. Local File
  ensureDataFile();
  const list = getLocalAlumni().filter(a => Number(a.id) !== numId);
  memoryStore = list;

  const filePath = getDataFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write alumni to disk:', err.message);
  }

  if (fs.existsSync(localFilePath) && filePath !== localFilePath) {
    try {
      fs.writeFileSync(localFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }

  return true;
}

export async function resetAlumni() {
  if (supabase) {
    try {
      await supabase.from('kesan_pesan_alumni').delete().neq('id', 0);
      const rows = defaultAlumni.map(a => ({
        id: a.id,
        nama: a.nama,
        prodi: a.prodi,
        angkatan: a.angkatan,
        tahun_lulus: a.tahunLulus,
        jabatan: a.jabatan,
        instansi: a.instansi,
        kesan: a.kesan,
        pesan: a.pesan,
        avatar: a.avatar,
        rating: a.rating,
        kategori_prodi: a.kategoriProdi,
        verified: true,
        status: 'Disetujui'
      }));
      await supabase.from('kesan_pesan_alumni').insert(rows);
    } catch (err) {
      console.warn('Gagal reset di Supabase alumni:', err.message);
    }
  }

  memoryStore = defaultAlumni;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(defaultAlumni, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write alumni to disk:', err.message);
  }
  return defaultAlumni;
}
