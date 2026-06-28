import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Vanir Group · Admin Console',
  description: 'Internal management dashboard for Vanir Group luxury travel platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080810] text-[#f5f0e8] min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 animate-[fade-in_0.4s_ease-out]">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
