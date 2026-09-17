import mysql from 'mysql2/promise';
import type { Experience, User, Microfrontend } from '@/types';

// Connection pool configuration for phpMyAdmin / MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'events_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;
let isConnectedToMySQL = false;

try {
  if (process.env.MYSQL_HOST) {
    pool = mysql.createPool(dbConfig);
    isConnectedToMySQL = true;
  }
} catch (err) {
  console.warn('MySQL connection pool init deferred:', err);
}

// In-Memory Database Fallback mirroring phpMyAdmin tables when MySQL is offline
const MOCK_USERS_TABLE: User[] = [
  {
    id: '1',
    githubId: '1001',
    login: 'paolaanaya',
    name: 'Paola Anaya',
    email: 'paola@anayap.tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format',
    bio: 'Microfrontend Host Lead & Software Architect',
    publicRepos: 42,
    role: 'admin',
    isApproved: true,
  },
  {
    id: '2',
    githubId: '1002',
    login: 'alexrivera',
    name: 'Alex Rivera',
    email: 'alex@eventshq.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
    bio: 'Event Creator & Lead Organizer',
    publicRepos: 18,
    role: 'creator',
    isApproved: true,
  },
];

const MOCK_EVENTS_TABLE: Experience[] = [
  {
    id: '1',
    name: 'Rivera Family Baby Shower',
    slug: 'rivera-baby-shower',
    url: 'https://babyshower.riveras.family',
    description: 'A private celebration page for our baby shower — RSVP, gift registry, venue details, and photo album for guests.',
    category: 'Baby Shower',
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=340&fit=crop&auto=format',
    mfeRemoteUrl: 'https://events.anayap.tech/remoteEntry.js',
    createdBy: 'paolaanaya',
    createdAt: '2026-07-15',
    lastModified: '2026-09-10',
  },
  {
    id: '2',
    name: 'Q3 Product Leadership Offsite',
    slug: 'product-leadership-offsite',
    url: 'https://offsite.internal.acme.co',
    description: 'Private agenda, session notes, speaker bios, and hotel info for the 3-day leadership conference in Sonoma.',
    category: 'Conference',
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=340&fit=crop&auto=format',
    mfeRemoteUrl: 'https://events.anayap.tech/remoteEntry.js',
    createdBy: 'paolaanaya',
    createdAt: '2026-06-01',
    lastModified: '2026-09-05',
  },
  {
    id: '3',
    name: "Sophie's 30th Birthday",
    slug: 'sophie-30th-birthday',
    url: 'https://sophie30.party',
    description: 'Surprise birthday celebration for Sophie — venue surprise reveal on the day, RSVP tracking, and a shared memory wall.',
    category: 'Birthday',
    status: 'draft',
    thumbnail: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=340&fit=crop&auto=format',
    mfeRemoteUrl: 'https://experiences.anayap.tech/remoteEntry.js',
    createdBy: 'alexrivera',
    createdAt: '2026-08-20',
    lastModified: '2026-09-12',
  },
  {
    id: '4',
    name: 'Chen & Nakamura Wedding',
    slug: 'chen-nakamura-wedding',
    url: 'https://chennakamura.wedding',
    description: 'Wedding info hub with ceremony details, accommodation options, dietary preferences form, and a live photo stream for guests.',
    category: 'Wedding',
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=340&fit=crop&auto=format',
    mfeRemoteUrl: 'https://experiences.anayap.tech/remoteEntry.js',
    createdBy: 'paolaanaya',
    createdAt: '2026-03-10',
    lastModified: '2026-08-28',
  },
  {
    id: '5',
    name: 'Morales Family Reunion 2026',
    slug: 'morales-reunion-2026',
    url: 'https://moralesreunion.com',
    description: 'Annual family gathering page with potluck signup, activity schedule, directions to the lake house, and a photo booth uploader.',
    category: 'Family Reunion',
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop&auto=format',
    mfeRemoteUrl: 'https://events.anayap.tech/remoteEntry.js',
    createdBy: 'alexrivera',
    createdAt: '2026-04-22',
    lastModified: '2026-09-01',
  },
  {
    id: '6',
    name: 'Design Dept Farewell — Mia',
    slug: 'design-farewell-mia',
    url: 'https://farewell.mia.internal',
    description: 'Team farewell for Mia Santos — a private tribute page where colleagues can leave messages, share memories, and view the event schedule.',
    category: 'Farewell',
    status: 'archived',
    thumbnail: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=340&fit=crop&auto=format',
    mfeRemoteUrl: 'https://tickets.anayap.tech/remoteEntry.js',
    createdBy: 'paolaanaya',
    createdAt: '2025-11-05',
    lastModified: '2025-12-14',
  },
];

export async function checkUserInDb(githubUsername: string): Promise<User | null> {
  if (pool && isConnectedToMySQL) {
    try {
      const [rows] = await pool.query<any[]>(
        'SELECT * FROM users WHERE username = ? OR github_id = ? LIMIT 1',
        [githubUsername, githubUsername]
      );
      if (rows.length > 0) {
        const u = rows[0];
        return {
          id: String(u.id),
          githubId: u.github_id,
          login: u.username,
          name: u.name || u.username,
          email: u.email || '',
          avatar: u.avatar_url || '',
          bio: u.bio || '',
          publicRepos: u.public_repos || 0,
          role: u.role || 'creator',
          isApproved: Boolean(u.is_approved),
        };
      }
    } catch (e) {
      console.warn('phpMyAdmin query failed, fallback to memory storage:', e);
    }
  }

  // Fallback to in-memory user list
  const user = MOCK_USERS_TABLE.find(
    u => u.login.toLowerCase() === githubUsername.toLowerCase() || u.githubId === githubUsername
  );

  if (user) return user;

  // Allow any valid GitHub user for demonstration, registering them into DB
  const newUser: User = {
    id: String(Date.now()),
    githubId: githubUsername,
    login: githubUsername,
    name: githubUsername,
    email: `${githubUsername}@users.noreply.github.com`,
    avatar: `https://github.com/${githubUsername}.png`,
    bio: 'GitHub Authenticated User',
    publicRepos: 5,
    role: 'creator',
    isApproved: true,
  };
  MOCK_USERS_TABLE.push(newUser);
  return newUser;
}

export async function fetchEventsFromDb(): Promise<Experience[]> {
  if (pool && isConnectedToMySQL) {
    try {
      const [rows] = await pool.query<any[]>('SELECT * FROM events ORDER BY created_at DESC');
      return rows.map(r => ({
        id: String(r.id),
        name: r.name,
        slug: r.slug,
        url: r.url,
        description: r.description,
        category: r.category,
        status: r.status,
        thumbnail: r.thumbnail,
        mfeRemoteUrl: r.mfe_remote_url,
        createdBy: r.created_by,
        createdAt: r.created_at,
        lastModified: r.last_modified,
      }));
    } catch (e) {
      console.warn('phpMyAdmin fetch events failed, using fallback:', e);
    }
  }
  return [...MOCK_EVENTS_TABLE];
}

export async function saveEventToDb(event: Experience): Promise<Experience> {
  if (pool && isConnectedToMySQL) {
    try {
      await pool.query(
        `INSERT INTO events (id, name, slug, url, description, category, status, thumbnail, mfe_remote_url, created_by, created_at, last_modified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=?, url=?, description=?, category=?, status=?, thumbnail=?, mfe_remote_url=?, last_modified=?`,
        [
          event.id, event.name, event.slug || event.name.toLowerCase().replace(/\s+/g, '-'),
          event.url, event.description, event.category, event.status, event.thumbnail,
          event.mfeRemoteUrl || '', event.createdBy || 'host', event.createdAt, event.lastModified,
          event.name, event.url, event.description, event.category, event.status, event.thumbnail,
          event.mfeRemoteUrl || '', event.lastModified
        ]
      );
    } catch (e) {
      console.warn('phpMyAdmin save event failed:', e);
    }
  }

  const index = MOCK_EVENTS_TABLE.findIndex(e => e.id === event.id);
  if (index >= 0) {
    MOCK_EVENTS_TABLE[index] = event;
  } else {
    MOCK_EVENTS_TABLE.unshift(event);
  }
  return event;
}

export async function deleteEventFromDb(id: string): Promise<boolean> {
  if (pool && isConnectedToMySQL) {
    try {
      await pool.query('DELETE FROM events WHERE id = ?', [id]);
    } catch (e) {
      console.warn('phpMyAdmin delete event failed:', e);
    }
  }
  const index = MOCK_EVENTS_TABLE.findIndex(e => e.id === id);
  if (index >= 0) {
    MOCK_EVENTS_TABLE.splice(index, 1);
    return true;
  }
  return false;
}
