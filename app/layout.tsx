import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import NavigationBar from '@/components/NavigationBar';
import WeatherProvider from './WeatherProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeatherHub',
  description: 'A weather platform to keep you updated on the weather',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            'min-h-screen dark bg-background font-sans antialiased px-10 flex flex-col',
            inter.className
          )}
        >
          <NavigationBar />
          <WeatherProvider>{children}</WeatherProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
