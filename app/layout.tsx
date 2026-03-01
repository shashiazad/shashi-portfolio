import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiyaChat from '@/components/SiyaChat';

export const metadata: Metadata = {
  title: 'Shashi Shekhar Azad — Software Engineer II | Dell Technologies',
  description:
    'Portfolio of Shashi Shekhar Azad — Software Engineer II at Dell Technologies. Expertise in Java, Spring Boot, Go, microservices, cloud-native architectures, and automation.',
  keywords: [
    'Shashi Azad',
    'Software Engineer',
    'Dell Technologies',
    'Java',
    'Spring Boot',
    'Go',
    'Microservices',
    'Backend Developer',
    'Cloud Native',
    'Portfolio',
  ],
  authors: [{ name: 'Shashi Shekhar Azad' }],
  openGraph: {
    title: 'Shashi Shekhar Azad — Software Engineer II | Dell Technologies',
    description:
      'Software Engineer with expertise in cloud-native architectures, microservices, and scalable backend systems.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shashi Shekhar Azad — Software Engineer II',
    description:
      'Software Engineer with expertise in cloud-native architectures, microservices, and scalable backend systems.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-overlay relative overflow-x-hidden bg-slate-50 text-slate-800 dark:bg-[#0a0a1a] dark:text-slate-200 transition-colors duration-500">
        {/* Ambient gradient blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand-500/15 dark:bg-brand-500/10 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/8 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-pink-500/8 dark:bg-pink-500/5 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />
        </div>

        {/* Subtle particle network */}
        <div className="particle-network">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="particle" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }} />
          ))}
        </div>

        {/* Subtle falling code characters */}
        <div className="code-fall">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${10 + Math.random() * 8}s`,
            }}>
              {'{}[]()<>/=;:'.charAt(Math.floor(Math.random() * 12))}
            </span>
          ))}
        </div>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="relative z-10 pt-14">{children}</main>
          <Footer />
          <SiyaChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
