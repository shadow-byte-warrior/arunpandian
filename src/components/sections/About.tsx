import React from 'react';
import { motion } from 'framer-motion';
import arunProfile from '../../assets/arun-profile.jpg';
import SliceReveal from '../ui/SliceReveal';
import type { PersonalInfo, Education } from '../../types';

const ease: any = [0.16, 1, 0.3, 1];

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: Number(i) * 0.08, ease } }),
};

interface AboutProps {
  data: {
    personalInfo: PersonalInfo;
    education: Education[];
  }
}

export default function About({ data }: AboutProps) {
  const stats = [
    { label: 'Lines of Code', value: '50k+' },
    { label: 'Projects Completed', value: '10+' },
    { label: 'Hackathons Won', value: '2' },
    { label: 'Coffee Cups', value: '∞' }
  ];

  const stack = ['Python', 'SQL', 'React', 'Node.js', 'PostgreSQL', 'Power BI'];

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">01 — About</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">
            Who am I?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-5">
          <SliceReveal className="lg:col-span-2 h-full">
            <motion.div
              custom={0} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="group relative h-full overflow-hidden rounded-3xl border border-line bg-ink"
            >
              <img
                src={arunProfile}
                alt={data.personalInfo.name}
                className="h-full w-full min-h-[260px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 pt-14">
                <p className="font-display font-bold text-white text-lg leading-tight">{data.personalInfo.name}</p>
                <p className="mt-0.5 text-xs font-mono text-white/70">{data.personalInfo.title}</p>
              </div>
            </motion.div>
          </SliceReveal>

          <motion.div
            custom={1} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-line bg-bg p-7 sm:p-9"
          >
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/5 blur-2xl transition-opacity duration-700 opacity-0 group-hover:opacity-100" />
            <p className="relative text-xl sm:text-2xl text-ink leading-snug font-medium text-balance">
              {data.personalInfo.summary}
            </p>
            <div className="relative mt-6 flex flex-wrap gap-2">
              {stack.map((t) => (
                <span key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-mono text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={2} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl border border-ink/80 bg-ink p-5 shadow-[0_30px_60px_-30px_rgba(9,9,11,0.6)]"
          >
            <div className="flex items-center gap-1.5 mb-4">
              <span className="h-3 w-3 rounded-full bg-red-500/90" />
              <span className="h-3 w-3 rounded-full bg-amber-400/90" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
              <span className="ml-2 text-[10px] font-mono text-white/40">whoami.sql</span>
            </div>
            <pre className="font-mono text-[12.5px] leading-relaxed text-white/90 whitespace-pre-wrap">
<span className="text-indigo-300">SELECT</span> role, focus{'\n'}
<span className="text-indigo-300">FROM</span>   arun_pandian{'\n'}
<span className="text-indigo-300">WHERE</span>  curiosity = <span className="text-emerald-300">TRUE</span>;
            </pre>
            <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[12px] text-white/50">
              <span className="text-accent">→</span> {data.personalInfo.name} · turns
              <br />&nbsp;&nbsp;messy data into decisions
            </div>
          </motion.div>

          <motion.div
            custom={3} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl border border-line bg-bg p-6"
          >
            <span className="text-xs font-mono text-accent uppercase tracking-wider">Education</span>
            {data.education.map((edu, i) => (
              <div key={i} className="mt-4">
                <p className="text-ink font-semibold leading-snug">{edu.institution}</p>
                <p className="mt-1 text-sm text-ink-soft">{edu.degree}</p>
                <p className="mt-3 text-xs font-mono text-ink-soft/70">{edu.period}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            custom={4} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl border border-line bg-bg p-6"
          >
            <span className="text-xs font-mono text-accent uppercase tracking-wider">Goals</span>
            <p className="mt-2 text-ink font-medium leading-snug">
              <span className="text-accent">Now →</span> Building impactful data solutions
            </p>
            <p className="mt-3 text-ink font-medium leading-snug">
              <span className="text-accent">Next →</span> Advancing as a full-stack data scientist
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-line bg-line">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="bg-surface p-6 sm:p-8"
            >
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-ink tabular-nums">{s.value}</div>
              <div className="mt-1 text-sm text-ink-soft">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
