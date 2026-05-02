import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Clinical Trial Navigator',
  description: 'Find and understand clinical trials that match your condition.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
