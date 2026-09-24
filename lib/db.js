import fs from 'fs';
import path from 'path';
import os from 'os';
import { defaultPrograms } from './data';
import { supabase } from './supabase';

const isVercel = Boolean(process.env.VERCEL);
const localDataDir = path.join(process.cwd(), 'data');
const localFilePath = path.join(localDataDir, 'program_kerja.json');
const tmpFilePath = path.join(os.tmpdir(), 'program_kerja.json');

// In-memory fallback
let memoryStore = null;

function getDataFilePath() {
  if (isVercel) {
    return tmpFilePath;
  }
  return localFilePath;
}

function ensureDataFile() {
  const filePath = getDataFilePath();
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Ignore
    }
  }

  if (!fs.existsSync(filePath)) {
    let initialData = defaultPrograms;
    if (fs.existsSync(localFilePath)) {
      try {
        initialData = JSON.parse(fs.readFileSync(localFilePath, 'utf-8'));
      } catch {
        initialData = defaultPrograms;
      }
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch {
      memoryStore = initialData;
    }
  }
}

function getLocalPrograms() {
  ensureDataFile();
  const filePath = getDataFilePath();
  let list = defaultPrograms;

  if (memoryStore) {
    list = memoryStore;
  } else if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      list = JSON.parse(raw);
    } catch (err) {
      console.error('Error reading program_kerja database:', err);
      list = defaultPrograms;
    }
  } else if (fs.existsSync(localFilePath)) {
    try {
      const raw = fs.readFileSync(localFilePath, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      list = defaultPrograms;
    }
  }
  return list;
}

function formatProgramItem(item) {
  const categoryMap = {
    'sains-teknologi': 'Sains & Teknologi',
    'sosial-pengabdian': 'Sosial & Pengabdian',
    'kaderisasi': 'Kaderisasi & Karir',
    'advokasi': 'Advokasi Mahasiswa',
    'seni-kreatif': 'Kreatif & Seni',
  };

  let tags = [];
  if (Array.isArray(item.tags)) {
    tags = item.tags;
  } else if (typeof item.tags === 'string') {
    try {
      tags = JSON.parse(item.tags);
    } catch {
      tags = item.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  return {
    id: Number(item.id),
    slug: item.slug || String(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    title: item.title,
    category: item.category || 'sains-teknologi',
    categoryName: item.category_name || item.categoryName || categoryMap[item.category] || 'Umum',
    date: item.date || 'Segera Datang',
    status: item.status || 'Sukses Terlaksana',
    desc: item.desc || '',
    impact: item.impact || '-',
    image: item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    tags,
    featured: item.featured !== undefined ? item.featured : true,
    updatedAt: item.updated_at || item.updatedAt || new Date().toISOString()
  };
}

export async function getAllPrograms(category = 'all') {
  // 1. Coba ambil dari Supabase Cloud (Online Database)
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted = data.map(formatProgramItem);
        if (category && category !== 'all') {
          return formatted.filter(item => item.category === category);
        }
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local:', err.message);
    }
  }

  // 2. Fallback ke file JSON lokal jika Supabase belum ada tabel / offline
  const list = getLocalPrograms();
  const formatted = list.map(formatProgramItem);
  if (category && category !== 'all') {
    return formatted.filter(item => item.category === category);
  }
  return formatted;
}

export async function getProgramById(id) {
  const list = await getAllPrograms();
  return list.find(item => Number(item.id) === Number(id)) || null;
}

export async function saveProgram(data) {
  const categoryMap = {
    'sains-teknologi': 'Sains & Teknologi',
    'sosial-pengabdian': 'Sosial & Pengabdian',
    'kaderisasi': 'Kaderisasi & Karir',
    'advokasi': 'Advokasi Mahasiswa',
    'seni-kreatif': 'Kreatif & Seni',
  };

  const categoryName = categoryMap[data.category] || 'Umum';
  let tags = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags;
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  let savedItem = null;

  // 1. Simpan ke Supabase Cloud jika tabel sudah siap
  if (supabase) {
    try {
      const payload = {
        title: data.title,
        slug,
        category: data.category || 'sains-teknologi',
        category_name: categoryName,
        date: data.date || 'Segera Datang',
        status: data.status || 'Sukses Terlaksana',
        desc: data.desc || '',
        impact: data.impact || '-',
        image: data.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        tags,
        featured: true,
        updated_at: new Date().toISOString()
      };

      if (data.id) {
        payload.id = Number(data.id);
        const { data: updated, error } = await supabase
          .from('program_kerja')
          .update(payload)
          .eq('id', Number(data.id))
          .select()
          .single();

        if (!error && updated) {
          savedItem = formatProgramItem(updated);
        }
      } else {
        const { data: inserted, error } = await supabase
          .from('program_kerja')
          .insert([payload])
          .select()
          .single();

        if (!error && inserted) {
          savedItem = formatProgramItem(inserted);
        }
      }
    } catch (err) {
      console.warn('Gagal menyimpan ke Supabase, fallback simpan lokal:', err.message);
    }
  }

  // 2. Simpan juga ke file lokal sebagai cadangan
  ensureDataFile();
  const list = [...getLocalPrograms()];

  if (data.id) {
    const index = list.findIndex(p => Number(p.id) === Number(data.id));
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...data,
        id: Number(data.id),
        categoryName,
        tags,
        slug,
        updatedAt: new Date().toISOString()
      };
      if (!savedItem) savedItem = list[index];
    }
  }

  if (!savedItem) {
    const nextId = list.length > 0 ? Math.max(...list.map(p => Number(p.id) || 0)) + 1 : 1;
    savedItem = {
      id: nextId,
      slug,
      title: data.title,
      category: data.category || 'sains-teknologi',
      categoryName,
      date: data.date || 'Segera Datang',
      status: data.status || 'Sukses Terlaksana',
      desc: data.desc || '',
      impact: data.impact || '-',
      image: data.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      tags,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(savedItem);
  }

  memoryStore = list;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk:', err.message);
  }

  return savedItem;
}

export async function deleteProgram(id) {
  // 1. Hapus dari Supabase jika ada
  if (supabase) {
    try {
      await supabase.from('program_kerja').delete().eq('id', Number(id));
    } catch (err) {
      console.warn('Gagal menghapus di Supabase:', err.message);
    }
  }

  // 2. Hapus dari lokal
  ensureDataFile();
  const list = getLocalPrograms().filter(item => Number(item.id) !== Number(id));
  memoryStore = list;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk:', err.message);
  }
  return true;
}

export async function resetPrograms() {
  if (supabase) {
    try {
      await supabase.from('program_kerja').delete().neq('id', 0);
      const rows = defaultPrograms.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        category_name: p.categoryName,
        date: p.date,
        status: p.status,
        desc: p.desc,
        impact: p.impact,
        image: p.image,
        tags: p.tags,
        featured: p.featured
      }));
      await supabase.from('program_kerja').insert(rows);
    } catch (err) {
      console.warn('Gagal reset di Supabase:', err.message);
    }
  }

  memoryStore = defaultPrograms;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(defaultPrograms, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk:', err.message);
  }
  return defaultPrograms;
}
