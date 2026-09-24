import { NextResponse } from 'next/server';
import { ADMIN_SECRET } from '@/lib/auth';

export async function POST(request) {
  try {
    const { key } = await request.json();
    if (!key) {
      return NextResponse.json({ success: false, message: 'Kunci sandi diperlukan' }, { status: 400 });
    }

    if (key === ADMIN_SECRET) {
      return NextResponse.json({ success: true, message: 'Autentikasi berhasil' });
    }

    return NextResponse.json({ success: false, message: 'Kunci sandi / PIN pengurus salah!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
