import { NextResponse } from 'next/server';
import { getAllPrograms, saveProgram, deleteProgram } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('kategori') || 'all';
  const data = getAllPrograms(category);
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, message: 'Judul program kerja wajib diisi!' }, { status: 400 });
    }
    const saved = saveProgram(body);
    return NextResponse.json({ success: true, data: saved, message: 'Program kerja berhasil disimpan ke database!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID tidak disediakan' }, { status: 400 });
    }
    deleteProgram(id);
    return NextResponse.json({ success: true, message: 'Program kerja berhasil dihapus dari database!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
