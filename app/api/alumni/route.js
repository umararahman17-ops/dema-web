import { NextResponse } from 'next/server';
import { getAllAlumni, createAlumni, updateAlumni, deleteAlumni } from '@/lib/alumni';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori') || 'all';
    const status = searchParams.get('status') || 'all';
    const isAdminReq = searchParams.get('admin') === 'true';

    // Periksa otorisasi pengurus
    const isAdmin = verifyAdminAuth(request);

    // Pengunjung umum HANYA melihat yang sudah diverifikasi/disetujui.
    // Hanya jika request memiliki header/token admin dan ?admin=true, maka tampilkan semua status.
    const onlyVerified = !(isAdmin && isAdminReq);

    const list = await getAllAlumni(kategori, {
      onlyVerified,
      status: status !== 'all' ? status : undefined
    });

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
      message: 'Terima kasih! Kesan dan pesan Anda telah berhasil dikirim ke database pengurus DEMA untuk ditinjau terlebih dahulu sebelum dipublikasikan.',
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
        message: 'Akses ditolak: Hanya pengurus DEMA yang berhak meninjau atau mempublikasikan pesan alumni.'
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, verified, status, ...rest } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID testimoni alumni diperlukan.'
      }, { status: 400 });
    }

    const updated = await updateAlumni(id, { verified, status, ...rest });

    return NextResponse.json({
      success: true,
      message: (status === 'Disetujui' || verified === true)
        ? 'Kesan & pesan alumni berhasil disetujui dan dipublikasikan di website!'
        : 'Status peninjauan alumni berhasil diperbarui.',
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
        message: 'Akses ditolak: Hanya pengurus DEMA yang berhak menghapus data alumni.'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID testimoni alumni diperlukan.'
      }, { status: 400 });
    }

    await deleteAlumni(id);

    return NextResponse.json({
      success: true,
      message: 'Data testimoni alumni berhasil dihapus dari database.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
