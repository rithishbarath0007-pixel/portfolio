import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatWidget from '@/components/AIChatWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio | Full-Stack Developer',
  description: 'Designing and building websites people remember.',
  icons: {
    icon: [
      {
        url: '/portfolio.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/portfolio.svg',
    apple: '/portfolio.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen relative selection:bg-white selection:text-black bg-black text-neutral-100 antialiased overflow-x-hidden`}>
        
        <AnalyticsTracker />
        <AIChatWidget />
        
        {/* UPGRADED: Background Container */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
          
          {/* 1. Ambient Spotlight (Soft Top Glow) */}
          {<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07)_10%,transparent_40%)]" /> }

          {/* 2. Thicker Vertical Grid Lines (2px width, 0.09 opacity) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.09)_2px,transparent_3px)] bg-[size:10vw_100%] [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]" />

          {/* 3. Tactile Grain / Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-screen" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Navbar />

        {/* Page Content */}
        {children}

        {/* Footer sits at the bottom naturally */}
        <Footer />

      </body>
    </html>
  );
}