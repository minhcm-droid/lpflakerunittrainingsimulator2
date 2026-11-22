import React from 'react';
import './globals.css';
import { SafetyBanner } from '@/components/layout/SafetyBanner';
import { Navbar } from '@/components/layout/Navbar';

export const metadata = {
  title: 'LP Flaker Unit Training Simulator (Section 700)',
  description: 'Interactive Field & DCS Operator Training Simulator — TRAINING SIMULATION ONLY',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <SafetyBanner />
        <Navbar />
        <main className="mx-auto max-w-[1600px] p-4">{children}</main>
      </body>
    </html>
  );
}
