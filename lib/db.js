import fs from 'fs';
import path from 'path';
import os from 'os';
import { defaultPrograms } from './data';

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
      // Ignore if dir cannot be created
    }
  }

  if (!fs.existsSync(filePath)) {
    // If on Vercel and local file exists, copy from local to tmp
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

export function getAllPrograms(category = 'all') {
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

  if (category && category !== 'all') {
    return list.filter(item => item.category === category);
  }
  return list;
}

export function getProgramById(id) {
  const list = getAllPrograms();
  return list.find(item => Number(item.id) === Number(id)) || null;
}

export function saveProgram(data) {
  ensureDataFile();
  const list = [...getAllPrograms()];

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

  let updatedItem;

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
      updatedItem = list[index];
    }
  }

  if (!updatedItem) {
    const nextId = list.length > 0 ? Math.max(...list.map(p => Number(p.id) || 0)) + 1 : 1;
    updatedItem = {
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
    list.unshift(updatedItem);
  }

  // Persist to file or memory
  memoryStore = list;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk, saved in memoryStore:', err.message);
  }

  return updatedItem;
}

export function deleteProgram(id) {
  ensureDataFile();
  const list = getAllPrograms().filter(item => Number(item.id) !== Number(id));
  memoryStore = list;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk, updated memoryStore:', err.message);
  }
  return true;
}

export function resetPrograms() {
  memoryStore = defaultPrograms;
  try {
    fs.writeFileSync(getDataFilePath(), JSON.stringify(defaultPrograms, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk, reset memoryStore:', err.message);
  }
  return defaultPrograms;
}
