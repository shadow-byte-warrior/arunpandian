import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, FileText, ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentProvider';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const flow = [
  { key: 'problem', label: 'Problem', dot: 'bg-rose-400' },
  { key: 'data', label: 'Data', dot: 'bg-sky-400' },
  { key: 'process', label: 'Process', dot: 'bg-amber-400' },
  { key: 'insight', label: 'Insight', dot: 'bg-emerald-500' },
];

const ProjectCard = ({ project, index = 0 }) => {
  const { title, tags, githubLink, caseStudyLink, demoLink, insight } = project;
  const { settings } = useContent();
  const animationStyle = settings?.theme?.layout?.animationStyle || 'default';

  // 3D tilt following the pointer
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
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
      className="group relative flex flex-col rounded-3xl border border-line bg-surface overflow-hidden [transform-style:preserve-3d] hover:border-ink/20 hover:shadow-[0_40px_80px_-40px_rgba(9,9,11,0.4)] transition-shadow duration-300"
    >
      {project.image_url && (
        <div className="w-full h-48 overflow-hidden bg-muted" style={{ transform: 'translateZ(10px)' }}>
          <img 
            src={project.image_url} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-4 mb-4" style={{ transform: 'translateZ(30px)' }}>
          {/* Year or badge area (optional if created_at was provided, otherwise just a static badge or nothing) */}
          <span className="text-xs font-mono font-bold text-ink-soft bg-muted px-2.5 py-1 rounded-md">
            {new Date(project.created_at || Date.now()).getFullYear()}
          </span>
          <div className="flex items-center gap-2.5 text-ink-soft shrink-0">
            {githubLink && <a href={githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink transition-colors"><GithubIcon /></a>}
            {caseStudyLink && <a href={caseStudyLink} target="_blank" rel="noopener noreferrer" aria-label="Case study" className="hover:text-ink transition-colors"><FileText size={18} /></a>}
            {demoLink && <a href={demoLink} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="hover:text-accent transition-colors"><ExternalLink size={18} /></a>}
          </div>
        </div>

        <h3 className="font-display font-bold text-xl sm:text-[1.35rem] text-ink leading-snug mb-4" style={{ transform: 'translateZ(40px)' }}>
          {animationStyle === 'depoluxe' && (
            <span className="font-mono text-accent mr-3">
              {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][index] || String(index + 1)}.
            </span>
          )}
          {title}
        </h3>

        <div className="space-y-3.5 flex-1" style={{ transform: 'translateZ(20px)' }}>
          {flow.map((f) => {
            if (!project[f.key]) return null;
            return (
              <div key={f.key}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft">{f.label}</span>
                </div>
                <p className={`pl-3.5 text-sm leading-relaxed border-l border-line ${f.key === 'insight' ? 'text-ink font-medium' : 'text-ink-soft'}`}>
                  {project[f.key]}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-1.5" style={{ transform: 'translateZ(20px)' }}>
          {tags && tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-full border border-line text-ink-soft bg-surface">{tag}</span>
          ))}
        </div>

        {(caseStudyLink || githubLink) && (
          <a
            href={caseStudyLink || githubLink} target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent transition-colors"
            style={{ transform: 'translateZ(30px)' }}
          >
            Read the case study
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>
    </motion.article>
  );
};

export default ProjectCard;
