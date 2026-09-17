import type { Microfrontend } from '@/types';

export const INITIAL_MFE_REGISTRY: Record<string, Microfrontend> = {
  events: {
    id: 'events',
    name: 'Events Discovery MFE',
    description: 'Concerts, conferences, workshops, and live gathering management.',
    basePath: '/events',
    remoteUrl: process.env.NEXT_PUBLIC_MFE_EVENTS_URL || 'https://events.anayap.tech/remoteEntry.js',
    status: 'active',
    version: '1.4.0',
    wcagLevel: 'WCAG 2.2 AA',
    category: 'events',
  },
  experiences: {
    id: 'experiences',
    name: 'Interactive Experiences MFE',
    description: 'Immersive pop-ups, VIP tours, and curated community experiences.',
    basePath: '/experiences',
    remoteUrl: process.env.NEXT_PUBLIC_MFE_EXPERIENCES_URL || 'https://experiences.anayap.tech/remoteEntry.js',
    status: 'active',
    version: '2.1.0',
    wcagLevel: 'WCAG 2.2 AA',
    category: 'experiences',
  },
  tickets: {
    id: 'tickets',
    name: 'Ticketing & Pass MFE',
    description: 'Secure pass reservation, QR validation, and checkout workflows.',
    basePath: '/tickets',
    remoteUrl: process.env.NEXT_PUBLIC_MFE_TICKETS_URL || 'https://tickets.anayap.tech/remoteEntry.js',
    status: 'maintenance',
    version: '0.9.5',
    wcagLevel: 'WCAG 2.2 AA',
    category: 'ticketing',
  },
};

const dynamicMfeRegistry: Record<string, Microfrontend> = { ...INITIAL_MFE_REGISTRY };

export function getRegisteredMfes(): Microfrontend[] {
  return Object.values(dynamicMfeRegistry);
}

export function getMfeById(id: string): Microfrontend | undefined {
  return dynamicMfeRegistry[id];
}

export function registerCustomMfe(mfe: Microfrontend): Microfrontend {
  dynamicMfeRegistry[mfe.id] = mfe;
  return mfe;
}

export function unregisterMfe(id: string): boolean {
  if (INITIAL_MFE_REGISTRY[id]) return false; // Prevent deleting core remotes
  delete dynamicMfeRegistry[id];
  return true;
}

export { INITIAL_MFE_REGISTRY as MFE_REGISTRY };
