import { NextResponse } from 'next/server';
import { fetchEventsFromDb, saveEventToDb } from '@/lib/db';
import type { Experience } from '@/types';

export async function GET() {
  try {
    const events = await fetchEventsFromDb();
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to query events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Experience = await request.json();
    if (!body.name || !body.url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }
    const saved = await saveEventToDb(body);
    return NextResponse.json({ success: true, event: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save event' }, { status: 500 });
  }
}
