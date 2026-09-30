import { NextResponse } from 'next/server';
import { getAllAlumni, createAlumni } from '@/lib/alumni';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori') || 'all';
    const list = await getAllAlumni(kategori);

    return NextResponse.json({
      success: true,
      data: list,
      count: list.length
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.nama || !body.prodi || !body.kesan || !body.pesan) {
      return NextResponse.json({
        success: false,
        message: 'Nama lengkap, program studi, kesan, dan pesan wajib diisi.'
      }, { status: 400 });
    }

    const saved = await createAlumni(body);

    return NextResponse.json({
      success: true,
      message: 'Terima kasih! Kesan dan pesan Anda sebagai alumni berhasil ditambahkan.',
      data: saved
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
