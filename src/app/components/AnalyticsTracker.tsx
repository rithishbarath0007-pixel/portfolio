"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Don't track the admin dashboard
    if (pathname?.startsWith('/admin')) return;

    // 2. Instantly grab OR generate a browser Session ID
    let sessionId = localStorage.getItem('chat_session_id');

    if (!sessionId) {
      sessionId = 'visitor_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chat_session_id', sessionId);
    }

    // 3. Fire the ping immediately. No timers, no polling.
    fetch('/api/track', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sessionId, 
        path: window.location.pathname 
      }),
    }).catch(() => {
      // Silently absorb network hiccups
    });

  }, [pathname]);

  return null;
}