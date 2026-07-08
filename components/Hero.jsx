import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';
import Parallax from './Parallax';
import arunProfile from '../assets/arun-profile.jpg';
import { useContent } from '../context/ContentProvider';

const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ease = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.1 + i * 0.08, ease } }),
};

const Hero = () => {
  const { settings } = useContent();
  const hero = settings.hero;

  const story = hero.story || [];
  const credentials = hero.credentials || [];
  const ticker = hero.ticker || [];
  const socials = hero.socials || {};
  // Per-element visibility controlled from the admin panel (eye toggles)
  const hidden = hero.hidden || {};

  return (
    <section id="hero" className="relative min-h-dvh flex flex-col justify-center overflow-hidden pt-28 pb-12">
      {/* Soft radial wash */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_85%_10%,#eef3ff_0%,transparent_55%)]" />
      {/* Full-bleed background grid — graph-paper lines fading toward the bottom */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(120%_100%_at_50%_0%,black_35%,transparent_80%)]"
      />
      {/* Swiss column hairlines — stronger structure aligned to the content grid */}
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(100%_100%_at_50%_0%,black,transparent_75%)]">
        <div className="mx-auto max-w-7xl h-full grid grid-cols-12">
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="border-l border-line h-full" />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* ---------- Left: the banner copy ---------- */}
        <div className="lg:col-span-7">
          {/* Availability eyebrow */}
          {!hidden.badge && (
            <motion.div custom={0} variants={rise} initial="hidden" animate="show">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-line bg-surface/70 backdrop-blur text-xs sm:text-sm font-medium text-ink-soft">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {hero.badge}
              </div>
            </motion.div>
          )}

          {/* Banner headline — oversized Swiss-modern type */}
          <h1 className="mt-6 font-display font-extrabold text-ink leading-[0.92] tracking-tight text-[clamp(2.75rem,7vw,5.5rem)]">
            {(hero.headline || []).map((line, i) => (
              <motion.span key={i} custom={i + 1} variants={rise} initial="hidden" animate="show" className="block">{line}</motion.span>
            ))}
            {!hidden.headlineAccent && (
              <motion.span custom={(hero.headline || []).length + 1} variants={rise} initial="hidden" animate="show" className="block">
                <span className="italic font-medium text-accent">{hero.headlineAccent}</span>
              </motion.span>
            )}
          </h1>

          {!hidden.subtitle && (
            <motion.p
              custom={4} variants={rise} initial="hidden" animate="show"
              className="mt-6 max-w-lg text-base sm:text-lg text-ink-soft leading-relaxed"
              dangerouslySetInnerHTML={{ __html: hero.subtitle }}
            />
          )}

          {/* STAR storyline strip — the value prop, told as a pipeline */}
          {!hidden.story && story.length > 0 && (
          <motion.div
            custom={5} variants={rise} initial="hidden" animate="show"
            className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3"
          >
            {story.map((s, i) => (
              <React.Fragment key={s.k}>
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 backdrop-blur pl-2 pr-3.5 py-1.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-white text-[11px] font-mono font-bold">{s.k}</span>
                  <span className="text-xs sm:text-sm font-medium text-ink-soft">{s.label}</span>
                </div>
                {i < story.length - 1 && <ArrowRight size={16} className="text-ink-soft/40 shrink-0" aria-hidden />}
              </React.Fragment>
            ))}
          </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            custom={6} variants={rise} initial="hidden" animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            {!hidden.primaryCta && (
              <MagneticButton
                href={hero.primaryCta?.href || '#projects'}
                className="group gap-2 rounded-full bg-ink text-white px-8 py-4 text-base font-semibold shadow-[0_10px_30px_-10px_rgba(9,9,11,0.5)] hover:bg-accent transition-colors duration-300"
              >
                {hero.primaryCta?.label || 'View selected work'}
                <ArrowDownRight size={19} className="group-hover:translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </MagneticButton>
            )}
            {!hidden.secondaryCta && (
              <MagneticButton
                href={hero.secondaryCta?.href || '/resume.pdf'} download strength={0.25}
                className="gap-2 rounded-full border border-ink/15 bg-surface/70 backdrop-blur px-8 py-4 text-base font-semibold text-ink hover:border-ink/40 transition-colors duration-300"
              >
                {hero.secondaryCta?.label || 'Download résumé'}
                <ArrowUpRight size={17} />
              </MagneticButton>
            )}
          </motion.div>

          {/* Credential strip + socials */}
          <motion.div
            custom={7} variants={rise} initial="hidden" animate="show"
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            {!hidden.credentials && credentials.length > 0 && (
              <>
                <div className="flex items-center gap-6 sm:gap-8">
                  {credentials.map((c) => (
                    <div key={c.label}>
                      <div className="font-display font-extrabold text-2xl sm:text-3xl text-ink tabular-nums leading-none">{c.value}</div>
                      <div className="mt-1 text-[11px] sm:text-xs text-ink-soft">{c.label}</div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block h-10 w-px bg-line" />
              </>
            )}
            <div className="flex items-center gap-5 text-ink-soft">
              {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink transition-colors"><GithubIcon /></a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-accent transition-colors"><LinkedinIcon /></a>}
              {socials.email && <a href={`mailto:${socials.email}`} aria-label="Email" className="hover:text-danger transition-colors"><Mail size={20} /></a>}
            </div>
          </motion.div>
        </div>

        {/* ---------- Right: the tech-animation video (framed) with profile chip ---------- */}
        <Parallax speed={60} className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.25 }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-auto max-w-md"
            >
              {/* glow */}
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-accent/25 via-indigo-300/20 to-transparent blur-3xl" />
              {/* video card */}
              <div className="relative rounded-[1.75rem] border border-line bg-surface p-2 shadow-[0_40px_90px_-30px_rgba(9,9,11,0.4)]">
                <video
                  className="w-full rounded-[1.35rem] aspect-square object-cover bg-ink"
                  src={hero.videoSrc || '/hero-animation.mp4'}
                  autoPlay muted loop playsInline preload="auto"
                  aria-label="Data analytics motion graphic"
                />
                {/* caption chip */}
                {!(hidden.videoCaption && hidden.videoSubCaption) && (
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl bg-surface/85 backdrop-blur px-4 py-2.5 border border-line">
                    {!hidden.videoCaption && <span className="font-display font-semibold text-ink text-sm">{hero.videoCaption || 'Data · in motion'}</span>}
                    {!hidden.videoSubCaption && <span className="text-xs text-ink-soft font-mono">{hero.videoSubCaption || 'SQL · Python · BI'}</span>}
                  </div>
                )}
              </div>

              {/* Profile accent chip — Arun, clearly, anchored to the banner visual */}
              {!(hidden.name && hidden.role) && (
                <div className="absolute -top-5 -left-5 sm:-left-8 flex items-center gap-3 rounded-2xl bg-surface/90 backdrop-blur border border-line shadow-[0_20px_45px_-20px_rgba(9,9,11,0.5)] pl-2 pr-4 py-2">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#2563EB,#6366F1,#a5b4fc,#2563EB)]" />
                    <img
                      src={arunProfile}
                      alt={hero.name || 'Arun Pandian'}
                      className="relative h-14 w-14 rounded-full object-cover border-2 border-surface"
                      style={{ objectPosition: '50% 22%' }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-surface" />
                  </div>
                  <div className="leading-tight">
                    {!hidden.name && <p className="font-display font-bold text-ink text-sm">{hero.name || 'Arun Pandian'}</p>}
                    {!hidden.role && <p className="text-[11px] text-ink-soft font-mono">{hero.role || 'Data Analyst'}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </Parallax>
      </div>

      {/* Full-width scrolling tech ticker — the banner's baseline */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}
        className="relative z-10 mt-14 border-y border-line bg-surface/50 backdrop-blur py-3.5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="flex w-max animate-marquee">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 text-sm font-mono uppercase tracking-wider text-ink-soft">
              {t}
              <span className="h-1 w-1 rounded-full bg-accent/60" />
            </span>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-soft/70">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-ink-soft/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
