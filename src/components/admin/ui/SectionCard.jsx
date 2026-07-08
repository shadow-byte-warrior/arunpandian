import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/* Admin settings card with an eye toggle to show/hide its inputs.
   Collapsing unmounts the fields, but react-hook-form keeps their
   values (shouldUnregister defaults to false), so nothing is lost. */

export default function SectionCard({ title, description, action, defaultOpen = true, children, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-[1.25rem] border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <h2 className="font-bold text-lg text-slate-800">{title}</h2>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
        {open && action}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? `Hide ${title} fields` : `Show ${title} fields`}
          title={open ? 'Hide fields' : 'Show fields'}
          className={`shrink-0 p-2 rounded-lg border transition-colors cursor-pointer ${
            open
              ? 'text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
              : 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {open ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
