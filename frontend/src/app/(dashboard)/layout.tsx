'use client';
import { AuthProvider, useAuth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardGuard>
        {children}
      </DashboardGuard>
    </AuthProvider>
  );
}
