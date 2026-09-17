import { NextResponse } from 'next/server';
import { authenticateGitHubUser } from '@/lib/github-auth';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'GitHub username is required' }, { status: 400 });
    }

    const authResult = await authenticateGitHubUser(username);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 403 });
    }

    return NextResponse.json({ success: true, user: authResult.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}
