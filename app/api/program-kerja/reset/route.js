import { NextResponse } from 'next/server';
import { resetPrograms } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, message: 'Akses ditolak: Hanya pengurus/admin yang berhak mereset database!' }, { status: 401 });
    }

    const data = await resetPrograms();
    return NextResponse.json({ success: true, message: 'Database berhasil di-reset ke data bawaan!', data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
