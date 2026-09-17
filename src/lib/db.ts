import mysql from 'mysql2/promise';
import type { Experience, User } from '@/types';
import { INITIAL_EXPERIENCES } from '@/features/events/data';

// Securely read MySQL credentials from environment variables (.env.local)
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'events_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 8000,
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

// In-Memory Database Fallback mirroring phpMyAdmin tables when MySQL is unreachable
const MOCK_USERS_TABLE: User[] = [
  {
    id: '1',
    githubId: '1001',
    login: 'anayap04',
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

const MOCK_EVENTS_TABLE: Experience[] = [...INITIAL_EXPERIENCES];

export async function checkUserInDb(githubUsername: string): Promise<User | null> {
  if (pool && isConnectedToMySQL) {
    try {
      const [rows] = await pool.query<any[]>(
        'SELECT * FROM users_container_admin WHERE username = ? OR github_id = ? LIMIT 1',
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

  const user = MOCK_USERS_TABLE.find(
    u => u.login.toLowerCase() === githubUsername.toLowerCase() || u.githubId === githubUsername
  );

  if (user) return user;

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

export async function updateUserInDb(
  githubId: string,
  updates: Pick<User, 'name' | 'avatar' | 'bio' | 'publicRepos'>
): Promise<void> {
  if (pool && isConnectedToMySQL) {
    try {
      await pool.query(
        'UPDATE users_container_admin SET name = ?, avatar_url = ?, bio = ?, public_repos = ? WHERE github_id = ?',
        [updates.name, updates.avatar, updates.bio, updates.publicRepos, githubId]
      );
    } catch (e) {
      console.warn('phpMyAdmin update user failed:', e);
    }
  }

  const user = MOCK_USERS_TABLE.find(u => u.githubId === githubId);
  if (user) {
    Object.assign(user, updates);
  }
}

export async function fetchEventsFromDb(): Promise<Experience[]> {
  if (pool && isConnectedToMySQL) {
    try {
      const [rows] = await pool.query<any[]>('SELECT * FROM events ORDER BY created_at DESC');
      if (rows && rows.length > 0) {
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
      }
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
