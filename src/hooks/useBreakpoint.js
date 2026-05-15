import { useState, useEffect } from 'react';

export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    isMobile:  width < 640,
    isTablet:  width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// Responsive padding helper
export function rPad(bp) {
  if (bp.isMobile)  return '52px 18px';
  if (bp.isTablet)  return '64px 32px';
  return '80px 56px';
}

// Responsive section width helper
export const rW = { maxWidth: 1200, margin: '0 auto', width: '100%' };
