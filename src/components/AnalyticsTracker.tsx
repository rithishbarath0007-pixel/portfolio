"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Don't track admin visits
    if (pathname?.startsWith('/admin')) return;

    let attempt = 0;
    
    // 2. Actively poll for the Session ID every 500ms
    const trackVisit = setInterval(() => {
      const sessionId = localStorage.getItem('chat_session_id');
      
      if (sessionId) {
        clearInterval(trackVisit); // Stop checking once we have it!
        
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, path: window.location.pathname }),
        }).catch(() => {});
      }
      
      attempt++;
      // 3. Failsafe: Stop checking after 5 seconds to prevent infinite loops
      if (attempt > 10) clearInterval(trackVisit); 
    }, 500);

    return () => clearInterval(trackVisit);
  }, [pathname]);

  return null;
}