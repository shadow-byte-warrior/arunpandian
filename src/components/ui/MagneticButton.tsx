import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  href?: string;
  download?: boolean;
  className?: string;
  strength?: number;
  as?: React.ElementType;
}

export default function MagneticButton({
  children,
  href,
  className = '',
  strength = 0.35,
  as,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  const Comp = motion[(as as keyof typeof motion) || (href ? 'a' : 'button')] as any;

  return (
    <Comp
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex items-center justify-center cursor-pointer will-change-transform ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
