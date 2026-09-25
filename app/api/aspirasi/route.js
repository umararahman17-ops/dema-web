import { NextResponse } from 'next/server';
import { getAllAspirasi, createAspirasi, updateAspirasi, deleteAspirasi, resetAspirasi } from '@/lib/aspirasi';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const list = await getAllAspirasi();
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

    if (!body.prodi || !body.pesan || !body.email || !body.email.trim().includes('@')) {
      return NextResponse.json({
        success: false,
        message: 'Program studi, alamat email aktif, dan pesan aspirasi wajib diisi agar pengurus dapat mengirimkan feedback.'
      }, { status: 400 });
    }

    const saved = await createAspirasi(body);

    return NextResponse.json({
      success: true,
      message: 'Aspirasi Anda berhasil dikirim ke Dewan Eksekutif Mahasiswa!',
      data: saved
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({
        success: false,
        message: 'Akses ditolak: Hanya pengurus yang berhak mengubah status aspirasi.'
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, tanggapan } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID aspirasi diperlukan.'
      }, { status: 400 });
    }

    const updated = await updateAspirasi(id, { status, tanggapan });

    return NextResponse.json({
      success: true,
      message: 'Status aspirasi berhasil diperbarui!',
      data: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({
        success: false,
        message: 'Akses ditolak: Hanya pengurus yang berhak menghapus aspirasi.'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID aspirasi diperlukan.'
      }, { status: 400 });
    }

    await deleteAspirasi(id);

    return NextResponse.json({
      success: true,
      message: 'Aspirasi berhasil dihapus dari database.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
