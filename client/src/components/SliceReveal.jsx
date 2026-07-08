import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Scroll-triggered slice unveil: the child is covered by vertical ink
   strips that collapse away (alternating top/bottom) once the element
   scrolls into view. Transform-only, runs once, respects reduced motion. */

const SliceReveal = ({ children, slices = 4, delay = 0, radius = 'rounded-3xl', className = '' }) => {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div className={`relative ${className}`}>
      {children}
      {/* Slice cover — clipped to the card's radius so corners stay clean */}
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
};

export default SliceReveal;
