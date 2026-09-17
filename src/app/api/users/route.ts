import { NextResponse } from 'next/server';
import { checkUserInDb } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'paolaanaya';

  try {
    const user = await checkUserInDb(username);
    if (!user) {
      return NextResponse.json({ error: 'User not found in phpMyAdmin database' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}
