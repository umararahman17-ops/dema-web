import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const isVercel = Boolean(process.env.VERCEL);
const aspirasiPath = isVercel
  ? path.join(os.tmpdir(), 'aspirasi.json')
  : path.join(process.cwd(), 'data', 'aspirasi.json');

let memoryAspirasi = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const dir = path.dirname(aspirasiPath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {
        // ignore
      }
    }

    let list = memoryAspirasi;
    if (fs.existsSync(aspirasiPath)) {
      try {
        list = JSON.parse(fs.readFileSync(aspirasiPath, 'utf-8'));
      } catch {
        list = memoryAspirasi;
      }
    }

    const newAspirasi = {
      id: Date.now(),
      nama: body.nama || 'Anonim',
      prodi: body.prodi || '-',
      email: body.email || '-',
      kategori: body.kategori || 'Umum',
      pesan: body.pesan || '',
      submittedAt: new Date().toISOString()
    };

    list.unshift(newAspirasi);
    memoryAspirasi = list;

    try {
      fs.writeFileSync(aspirasiPath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write aspirasi to disk, stored in memory:', err.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Aspirasi Anda berhasil dikirim ke Dewan Eksekutif Mahasiswa!'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
