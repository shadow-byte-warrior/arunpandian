import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../types';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, stack, github, bullets } = project;

  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      className="group relative flex flex-col rounded-3xl border border-line bg-surface p-7 [transform-style:preserve-3d] hover:border-ink/20 hover:shadow-[0_40px_80px_-40px_rgba(9,9,11,0.4)] transition-shadow duration-300 h-full"
    >
      <div className="flex items-start justify-between gap-4" style={{ transform: 'translateZ(40px)' }}>
        <h3 className="font-display font-bold text-xl sm:text-[1.35rem] text-ink leading-snug">{title}</h3>
        <div className="flex items-center gap-2.5 text-ink-soft shrink-0">
          {github && <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink transition-colors"><GithubIcon /></a>}
        </div>
      </div>

      <div className="mt-5 space-y-3 flex-1" style={{ transform: 'translateZ(20px)' }}>
        {bullets.map((bullet, i) => (
          <div key={i} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
            <p className="text-sm text-ink-soft leading-relaxed">{bullet}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-1.5" style={{ transform: 'translateZ(20px)' }}>
        {stack.map((tag) => (
          <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 text-ink-soft">{tag}</span>
        ))}
      </div>

      {github && (
        <a
          href={github} target="_blank" rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent transition-colors"
          style={{ transform: 'translateZ(30px)' }}
        >
          View repository
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      )}
    </motion.article>
  );
}
