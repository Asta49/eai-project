'use client';

import React from 'react';
import { usePathname } from '@/navigation';
import { BottomNav } from '@/components/bottom-nav';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDoctorPortal = pathname.includes('/doctor');

  if (isDoctorPortal) {
    return (
      <main className="flex-1 pb-16 pt-0 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {children}
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 pb-24 pt-1">
        <div className="mx-auto max-w-md sm:max-w-lg px-3.5 sm:px-4">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
