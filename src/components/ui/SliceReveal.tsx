import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SliceRevealProps {
  children: React.ReactNode;
  slices?: number;
  delay?: number;
  radius?: string;
  className?: string;
}

export default function SliceReveal({ 
  children, 
  slices = 4, 
  delay = 0, 
  radius = 'rounded-3xl', 
  className = '' 
}: SliceRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className={`absolute inset-0 z-10 pointer-events-none flex overflow-hidden ${radius}`} aria-hidden>
        {Array.from({ length: slices }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: delay + i * 0.07, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: i % 2 === 0 ? 'top' : 'bottom', willChange: 'transform' }}
            className="flex-1 bg-ink"
          />
        ))}
      </div>
    </div>
  );
}
