"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AIChatWidget from '@/components/AIChatWidget';

// ─── Icons ────────────────────────────────────────────────────────────────────

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Button config ────────────────────────────────────────────────────────────

const buttons = [
  { id: 'contact', href: '/contact', label: 'Contact me',   icon: <MailIcon />  },
  { id: 'work',    href: '/work',    label: 'View  work', icon: <ArrowIcon /> },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-12 overflow-hidden">

      {/* The Hero Text — unchanged */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
          I'm Rithish_Barath N, an engineer and builder of full-stack apps people remember
        </h1>
      </motion.div>

      {/* The CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8 z-10"
      >
        {buttons.map(({ id, href, label, icon }) => {
          const isHovered = hoveredId === id;

          return (
            <Link
              key={id}
              href={href}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center justify-center h-11 px-6 text-sm font-medium text-white rounded-md overflow-hidden active:scale-95"
              style={{
                backgroundColor: isHovered ? '#2563eb' : '#171717',
                transition: 'background-color 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <motion.span
                animate={
                  isHovered
                    ? { width: 15, opacity: 1, marginRight: 6, scale: 1 }
                    : { width: 0,  opacity: 0, marginRight: 0, scale: 0.4 }
                }
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, overflow: 'hidden' }}
              >
                {icon}
              </motion.span>
              {label}
            </Link>
          );
        })}
      </motion.div>

      {/* The Floating AI Agent — unchanged */}
      <AIChatWidget />

    </main>
  );
}