import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeProps {
  onDone: () => void;
}

export default function Welcome({ onDone }: WelcomeProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => onDone(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
      >
        <div className="text-white text-2xl font-mono tracking-widest overflow-hidden">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: phase > 0 ? '0%' : '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Arun Pandian {phase > 1 && <span className="text-accent ml-2">✦</span>}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
