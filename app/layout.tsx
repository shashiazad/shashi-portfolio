import './globals.css';
import type { Metadata } from 'next';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="relative overflow-x-hidden bg-black text-[#f5f5f7]">
        <Navbar />
        <main className="relative z-10 pt-24">{children}</main>
        <Footer />
        <SiyaChat />
      </body>
    </html>
  );
}
