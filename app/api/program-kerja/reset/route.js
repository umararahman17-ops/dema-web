import { NextResponse } from 'next/server';
import { resetPrograms } from '@/lib/db';

export async function POST() {
  try {
    const data = resetPrograms();
    return NextResponse.json({ success: true, message: 'Database berhasil di-reset ke data bawaan!', data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
