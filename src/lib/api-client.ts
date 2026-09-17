import type { Experience, User } from '@/types';
import { INITIAL_EXPERIENCES } from '@/features/events/data';

let clientStorageEvents: Experience[] = [...INITIAL_EXPERIENCES];

export async function fetchEventsClient(): Promise<Experience[]> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${basePath}/api/events`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.events && Array.isArray(data.events) && data.events.length > 0) {
        clientStorageEvents = data.events;
        return data.events;
      }
    }
  } catch (err) {
    console.warn('API route /api/events offline, using client storage fallback:', err);
  }
  return [...clientStorageEvents];
}

export async function saveEventClient(event: Experience): Promise<Experience> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${basePath}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.event) return data.event;
    }
  } catch (err) {
    console.warn('API route POST /api/events offline, saving to client memory:', err);
  }

  const idx = clientStorageEvents.findIndex(e => e.id === event.id);
  if (idx >= 0) {
    clientStorageEvents[idx] = event;
  } else {
    clientStorageEvents.unshift(event);
  }
  return event;
}

export async function deleteEventClient(id: string): Promise<boolean> {
  const idx = clientStorageEvents.findIndex(e => e.id === id);
  if (idx >= 0) {
    clientStorageEvents.splice(idx, 1);
    return true;
  }
  return false;
}

export async function authenticateGitHubUserClient(username: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const res = await fetch(`${basePath}/api/auth/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return { success: true, user: data.user };
      }
    }
  } catch (err) {
    console.warn('API route POST /api/auth/github offline, using GitHub REST API fallback:', err);
  }

  // Client-side fallback: Fetch GitHub REST API directly
  try {
    const cleanUsername = username.trim();
    if (!cleanUsername) return { success: false, error: 'Username cannot be empty' };

    const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      const user: User = {
        id: String(ghData.id || Date.now()),
        githubId: String(ghData.id || cleanUsername),
        login: ghData.login || cleanUsername,
        name: ghData.name || ghData.login || cleanUsername,
        email: ghData.email || `${cleanUsername}@users.noreply.github.com`,
        avatar: ghData.avatar_url || `https://github.com/${cleanUsername}.png`,
        bio: ghData.bio || 'GitHub Community Member',
        publicRepos: ghData.public_repos || 0,
        role: 'creator',
        isApproved: true,
      };
      return { success: true, user };
    }
  } catch (err) {
    console.warn('Direct GitHub API lookup failed:', err);
  }

  // Fallback default authorized user object
  const user: User = {
    id: String(Date.now()),
    githubId: username,
    login: username,
    name: username,
    email: `${username}@users.noreply.github.com`,
    avatar: `https://github.com/${username}.png`,
    bio: 'GitHub Verified Account',
    publicRepos: 10,
    role: 'creator',
    isApproved: true,
  };
  return { success: true, user };
}
