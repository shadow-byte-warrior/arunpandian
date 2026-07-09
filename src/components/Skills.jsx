import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Sigma, BarChart3, Wrench, X, ExternalLink,
  FileText, FileSpreadsheet, Presentation, File as FileIcon,
} from 'lucide-react';
import { useContent } from '../context/ContentProvider';
import { getFileKind, isPdf, isImage, isOfficeDoc, officeViewerUrl } from '../utils/fileType';

// Icon shown on a certificate card when the attachment isn't a previewable image.
const CERT_FILE_ICON = {
  pdf: FileText, doc: FileText, sheet: FileSpreadsheet,
  slides: Presentation, text: FileText,
};

const ease = [0.16, 1, 0.3, 1];

// Map icon name strings from the database to actual components
const iconMap = { Database, Sigma, BarChart3, Wrench };

const Skills = () => {
  const { settings } = useContent();
  const skills = settings.skills;

  const categories = skills.categories || [];
  // Certifications live under their own `certifications` settings key (rich
  // objects with issuer/date/image). Fall back to the legacy string list in
  // `skills.certifications`, normalising strings to objects so cards render.
  const rawCerts = settings.certifications?.certifications ?? skills.certifications ?? [];
  const certifications = rawCerts.map((c) => (typeof c === 'string' ? { name: c } : c));
  const ticker = skills.ticker || [];

  const hiddenFields = skills.hiddenFields || [];
  const isVisible = (field) => !hiddenFields.includes(field);

  // Certificate lightbox
  const [activeCert, setActiveCert] = useState(null);
  const media = activeCert ? (activeCert.image || activeCert.credentialUrl) : null;

  useEffect(() => {
    if (!activeCert) return;
    const onKey = (e) => { if (e.key === 'Escape') setActiveCert(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeCert]);

  return (
    <section id="skills" className="py-24 sm:py-32 bg-bg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-14">
          {isVisible('sectionLabel') && <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">{skills.sectionLabel}</span>}
          {isVisible('sectionTitle') && <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">{skills.sectionTitle}</h2>}
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
                  {isVisible(`categories.${i}.icon`) && <Icon size={20} />}
                </div>
                {isVisible(`categories.${i}.title`) && <h3 className="mt-5 font-display font-bold text-lg text-ink">{cat.title}</h3>}
                {isVisible(`categories.${i}.items`) && (
                  <ul className="mt-4 space-y-2.5">
                    {(cat.items || []).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Certifications - Now rendering as complex objects with images */}
        {certifications.length > 0 && (
        <div className="mt-12">
          <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">Certifications & Credentials</span>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveCert(c)}
                className="group flex w-full items-start gap-4 p-5 rounded-2xl border border-line bg-surface text-left hover:shadow-lg hover:border-ink/20 transition-all duration-300 cursor-pointer"
              >
                {c.image && isImage(c.image) ? (
                  <img src={c.image} alt={c.name} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                ) : c.image ? (
                  (() => {
                    const FileKindIcon = CERT_FILE_ICON[getFileKind(c.image)] || FileIcon;
                    return (
                      <div className="h-12 w-12 rounded-lg bg-accent-soft flex items-center justify-center text-accent shrink-0">
                        <FileKindIcon size={22} strokeWidth={1.75} />
                      </div>
                    );
                  })()
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-ink-soft shrink-0 font-bold text-lg">
                    {c.name ? c.name.substring(0, 1) : 'C'}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-ink text-sm sm:text-base group-hover:text-accent transition-colors line-clamp-2">{c.name}</h4>
                  <p className="text-xs text-ink-soft mt-1">{c.issuer} {c.issueDate && `• ${c.issueDate}`}</p>
                  {c.credentialId && <p className="text-[10px] text-ink-soft mt-1 font-mono">ID: {c.credentialId}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Dynamic Custom Elements in Skills */}
        {settings?.custom_elements && Object.values(settings.custom_elements)
          .filter((e) => e.section === 'skills')
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((el) => {
            const commonProps = {
              key: el.id,
              'data-edit-id': el.id,
              'data-edit-name': el.name,
              'data-edit-kind': el.kind,
              'data-edit-path': el.path,
              className: `custom-element custom-element-${el.kind} my-4 transition-all duration-300 inline-block w-full`,
            };
            if (el.kind === 'heading') return <h3 {...commonProps} className={`${commonProps.className} font-display font-bold text-xl sm:text-2xl text-ink`}>{el.value}</h3>;
            if (el.kind === 'text') return <p {...commonProps} className={`${commonProps.className} text-sm sm:text-base text-ink-soft`}>{el.value}</p>;
            if (el.kind === 'button') return <div key={el.id} className="my-3"><a href={el.href || '#'} {...commonProps} className="custom-element-button inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-ink text-white font-semibold hover:bg-accent text-xs sm:text-sm">{el.value}</a></div>;
            if (el.kind === 'link') return <div key={el.id} className="my-3"><a href={el.href || '#'} {...commonProps} className="text-xs sm:text-sm font-semibold text-accent hover:underline">{el.value}</a></div>;
            if (el.kind === 'image') return <img key={el.id} src={el.value} alt={el.name} {...commonProps} className={`${commonProps.className} max-w-full h-auto rounded-lg border border-line`} />;
            return null;
          })}
      </div>


      {/* Marquee ticker */}
      {isVisible('ticker') && ticker.length > 0 && (
      <div className="mt-16 relative overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="mx-6 font-display font-semibold text-2xl sm:text-3xl text-ink/25 hover:text-accent transition-colors">
              {t} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
      )}

      {/* Certificate lightbox — click a card to view the image / PDF */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-line p-4">
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-ink truncate">{activeCert.name}</h4>
                  <p className="text-xs text-ink-soft">{activeCert.issuer}{activeCert.issueDate && ` • ${activeCert.issueDate}`}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {media && (
                    <a
                      href={media} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink hover:border-ink/30 transition-colors"
                    >
                      <ExternalLink size={13} /> Open
                    </a>
                  )}
                  <button
                    type="button" onClick={() => setActiveCert(null)} aria-label="Close"
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-muted hover:text-ink transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="grid min-h-[300px] flex-1 place-items-center overflow-auto bg-bg p-2">
                {media ? (
                  isImage(media) ? (
                    <img src={media} alt={activeCert.name} className="max-h-[78vh] w-auto object-contain" />
                  ) : isPdf(media) ? (
                    <iframe src={media} title={activeCert.name} className="h-[75vh] w-full border-0 bg-white" />
                  ) : isOfficeDoc(media) ? (
                    <iframe
                      src={officeViewerUrl(media)}
                      title={activeCert.name}
                      className="h-[75vh] w-full border-0 bg-white"
                    />
                  ) : (
                    <div className="grid place-items-center gap-4 p-10 text-center">
                      <FileIcon size={48} strokeWidth={1.5} className="text-accent" />
                      <p className="text-sm text-ink-soft">
                        This file type can't be previewed in the browser.
                      </p>
                      <a
                        href={media} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink size={15} /> Open / Download
                      </a>
                    </div>
                  )
                ) : (
                  <p className="p-8 text-sm text-ink-soft">No certificate file attached yet.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
