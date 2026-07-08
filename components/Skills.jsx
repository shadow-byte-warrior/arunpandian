import React from 'react';
import { motion } from 'framer-motion';
import { Database, Sigma, BarChart3, Wrench } from 'lucide-react';
import { useContent } from '../context/ContentProvider';

const ease = [0.16, 1, 0.3, 1];

// Map icon name strings from the database to actual components
const iconMap = { Database, Sigma, BarChart3, Wrench };

const Skills = () => {
  const { settings } = useContent();
  const skills = settings.skills;

  const categories = skills.categories || [];
  const certifications = skills.certifications || [];
  const ticker = skills.ticker || [];

  return (
    <section id="skills" className="py-24 sm:py-32 bg-bg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-14">
          <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">{skills.sectionLabel}</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">{skills.sectionTitle}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Database;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-line bg-surface p-6 hover:shadow-[0_20px_50px_-25px_rgba(9,9,11,0.3)] hover:border-ink/20 transition-all duration-300"
              >
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-muted text-ink group-hover:bg-ink group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-display font-bold text-lg text-ink">{cat.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {(cat.items || []).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="mt-12 rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">Certifications</span>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {certifications.map((c) => (
              <span key={c} className="px-3.5 py-1.5 rounded-full border border-line bg-bg text-sm text-ink-soft">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="mt-16 relative overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="mx-6 font-display font-semibold text-2xl sm:text-3xl text-ink/25 hover:text-accent transition-colors">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
