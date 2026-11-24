import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: Sesi pengurus diperlukan untuk mengimpor file foto.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'File tidak ditemukan atau format tidak sesuai.' },
        { status: 400 }
      );
    }

    // Validasi tipe gambar
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File harus berupa gambar (JPG, PNG, WebP, GIF, SVG).' },
        { status: 400 }
      );
    }

    // Validasi ukuran maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file terlalu besar. Maksimal 10MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Direktori target penyimpanan lokal: public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Nama file unik dan aman
    const rawExt = path.extname(file.name || '').toLowerCase();
    const safeExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
    const ext = safeExts.includes(rawExt) ? rawExt : '.jpg';
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const filename = `proker-${timestamp}-${randomHex}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
      message: 'Foto berhasil diimpor dan disimpan ke server!'
    });
  } catch (error) {
    console.error('Error saat upload file:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengunggah foto ke server.' },
      { status: 500 }
    );
  }
}
