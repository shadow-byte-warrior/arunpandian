import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';
import type { Experience as ExperienceType } from '../../types';

const ease: any = [0.16, 1, 0.3, 1];

interface ExperienceProps {
  data: ExperienceType[];
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <section id="timeline" className="py-24 sm:py-32 bg-surface border-y border-line">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-14">
          <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">03 — Experience</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">Where I've made an impact</h2>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] sm:left-6 top-2 bottom-2 w-px bg-line" />
          <div className="space-y-6">
            {data.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className="relative pl-14 sm:pl-20"
              >
                <div className="absolute left-0 sm:left-1 top-1 grid place-items-center h-10 w-10 rounded-full bg-ink text-white ring-4 ring-surface">
                  <Briefcase size={16} />
                </div>
                <div className="rounded-2xl border border-line bg-bg p-6 hover:border-ink/20 hover:shadow-[0_20px_50px_-30px_rgba(9,9,11,0.4)] transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-50 text-accent">Work Experience</span>
                    <span className="flex items-center gap-1.5 text-xs text-ink-soft font-mono"><Calendar size={12} />{exp.period}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-ink">
                    {exp.title} <span className="text-ink-soft font-medium">· {exp.company}</span>
                  </h3>
                  <div className="mt-4 space-y-2 text-ink-soft leading-relaxed text-sm">
                    {exp.bullets.map((bullet, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 rounded-full bg-accent shrink-0" />
                        {bullet}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
