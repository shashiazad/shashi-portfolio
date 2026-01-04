import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Shashi Azad — Software Engineer II',
  description: 'Portfolio of Shashi Azad, Software Engineer II at Dell Technologies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="relative overflow-x-hidden bg-white text-gray-900 dark:bg-[#0b0f1a] dark:text-slate-200 transition-colors duration-500">
        {/* Neon gradient animated blobs */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/40 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-400/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-400/25 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Particle network */}
        <div className="particle-network">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`
            }} />
          ))}
        </div>

        {/* Falling code */}
        <div className="code-fall">
          {Array.from({ length: 200 }).map((_, i) => (
            <span key={i} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`
            }}>
              {Math.random().toString(36).substring(2, 3)}
            </span>
          ))}
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="relative z-10 fade-in animate-gradient-xy">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
