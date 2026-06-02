import type { Metadata } from 'next';
import { Geist, Geist_Mono, Pacifico } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocationProvider } from '@/components/LocationContext';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AuraCinema - Premium Booking',
  description: 'Book your movie tickets with a premium cinematic experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 min-h-screen selection:bg-rose-500/30 selection:text-rose-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocationProvider>
            {children}
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
