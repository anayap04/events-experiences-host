import type { Metadata, Viewport } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdConfigProvider from '@/components/AntdConfigProvider';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { LiveAnnouncerProvider } from '@/components/LiveAnnouncer';
import { SkipLink } from '@/components/SkipLink';
import { AccessibleNav } from '@/components/AccessibleNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Events Experiences Host | Microfrontend Container Shell',
  description: 'Scalable container application orchestrating event microfrontends with Ant Design system, GitHub authentication, and phpMyAdmin database.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AntdConfigProvider>
            <LiveAnnouncerProvider>
              <AuthProvider>
                <SkipLink targetId="main-content" label="Skip to main content" />
                <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
                  <AccessibleNav />
                  <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
                    {children}
                  </main>
                  <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <span>Events & Experiences Microfrontend Host Shell &copy; 2026</span>
                      <span className="font-mono text-slate-400">Ant Design 5 &bull; Next.js 14 &bull; phpMyAdmin MySQL Sync &bull; WCAG 2.2 AA</span>
                    </div>
                  </footer>
                </div>
              </AuthProvider>
            </LiveAnnouncerProvider>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
