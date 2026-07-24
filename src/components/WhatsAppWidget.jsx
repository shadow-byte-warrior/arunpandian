import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Briefcase, Building2, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const WHATSAPP_NUMBER = '918248960558';

const WhatsAppIcon = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.454h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
  </svg>
);

export default function WhatsAppWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState('menu'); // 'menu' | 'company'
  const [companyName, setCompanyName] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const companyInputRef = useRef(null);

  // Hide on admin portal
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when entering company step
  useEffect(() => {
    if (activeStep === 'company' && companyInputRef.current) {
      companyInputRef.current.focus();
    }
  }, [activeStep]);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
    if (hasUnread) setHasUnread(false);
    if (isOpen) {
      setActiveStep('menu');
      setCompanyName('');
    }
  };

  const handleProjectSelect = () => {
    const message = 'Hi Arun, I would like to discuss a project with you.';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCompanySubmit = (e) => {
    if (e) e.preventDefault();
    const cleanCompany = companyName.trim();
    let message = '';
    if (cleanCompany) {
      message = `Hi Arun, I'm reaching out from ${cleanCompany} regarding a potential opportunity.`;
    } else {
      message =
        "Hi Arun, I'm reaching out from a company regarding a potential opportunity. I would like to discuss further.";
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.88, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.88, y: 20, filter: 'blur(8px)' }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            role="dialog"
            aria-modal="true"
            aria-label="WhatsApp Contact Options"
            className="mb-4 w-[calc(100vw-2.5rem)] sm:w-[390px] rounded-[24px] bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-[18px] border border-black/8 dark:border-white/12 shadow-[0_16px_45px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden font-sans text-ink"
          >
            {/* Premium Header Gradient */}
            <div className="bg-gradient-to-r from-[#0F9D58] to-[#128C7E] p-5 text-white relative flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base text-white border border-white/30 shadow-inner">
                    AP
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#0F9D58] rounded-full shadow-sm"></span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base tracking-tight text-white leading-tight">
                    Let's Connect
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-100/90 font-medium mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>Arun Pandian • Usually replies in minutes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleWidget}
                aria-label="Close WhatsApp chat popup"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chatbot Content Area (Matte Finish) */}
            <div className="p-5 space-y-4.5 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-sm max-h-[75vh] overflow-y-auto">
              {/* Bot Greeting Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F9D58] to-[#128C7E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-600/20">
                  <WhatsAppIcon size={16} className="fill-current text-white" />
                </div>
                <div className="space-y-1.5 max-w-[85%]">
                  <div className="bg-surface dark:bg-zinc-800/90 border border-black/6 dark:border-white/10 p-4 rounded-[20px] rounded-tl-xs shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-sm text-ink leading-relaxed">
                    <p className="font-semibold text-ink tracking-tight">Hi Arun! I'm contacting you regarding:</p>
                    <p className="text-xs text-ink-soft/90 mt-1 font-normal">What would you like to discuss today?</p>
                  </div>
                  <span className="text-[10px] text-ink-soft/70 pl-1 font-mono">Just now</span>
                </div>
              </div>

              {/* Step 1: Main Options Menu */}
              {activeStep === 'menu' && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 pt-1"
                >
                  {/* Option 1: Discuss a Project */}
                  <button
                    onClick={handleProjectSelect}
                    className="w-full group p-4 rounded-[20px] border border-black/6 dark:border-white/10 bg-surface dark:bg-zinc-900/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:shadow-[0_8px_25px_rgba(15,157,88,0.12)] text-left transition-all duration-200 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink group-hover:text-[#0F9D58] dark:group-hover:text-emerald-400 transition-colors">
                          Discuss a Project
                        </div>
                        <div className="text-xs text-ink-soft mt-0.5">Data analysis, dashboards, or insights</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-[#0F9D58] group-hover:text-white transition-all shadow-xs">
                      Chat
                    </span>
                  </button>

                  {/* Option 2: Company / Opportunity */}
                  <button
                    onClick={() => setActiveStep('company')}
                    className="w-full group p-4 rounded-[20px] border border-black/6 dark:border-white/10 bg-surface dark:bg-zinc-900/80 hover:border-teal-500/50 hover:bg-teal-500/5 hover:shadow-[0_8px_25px_rgba(18,140,126,0.12)] text-left transition-all duration-200 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink group-hover:text-[#128C7E] dark:group-hover:text-teal-400 transition-colors">
                          Company / Opportunity
                        </div>
                        <div className="text-xs text-ink-soft mt-0.5">Data role, hiring, or collaboration</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-[#128C7E] group-hover:text-white transition-all shadow-xs">
                      Customize
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Step 2: Custom Company Name Flow */}
              {activeStep === 'company' && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5 pt-1"
                >
                  <form onSubmit={handleCompanySubmit} className="space-y-3.5">
                    <div className="bg-surface dark:bg-zinc-900/90 border border-black/6 dark:border-white/10 p-3.5 rounded-[18px] shadow-xs space-y-2">
                      <label htmlFor="company-input" className="block text-xs font-semibold text-ink-soft">
                        Enter Company / Organization Name:
                      </label>
                      <input
                        id="company-input"
                        ref={companyInputRef}
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corp or Google"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-black/10 dark:border-white/15 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-[#0F9D58] transition-all"
                      />
                    </div>

                    <div className="bg-emerald-500/8 dark:bg-emerald-400/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-ink-soft space-y-1.5">
                      <div className="font-semibold text-[#0F9D58] dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Live Message Preview:
                      </div>
                      <p className="italic text-ink leading-relaxed text-xs">
                        "{companyName.trim()
                          ? `Hi Arun, I'm reaching out from ${companyName.trim()} regarding a potential opportunity.`
                          : `Hi Arun, I'm reaching out from a company regarding a potential opportunity. I would like to discuss further.`}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveStep('menu')}
                        className="p-2.5 rounded-full border border-black/10 dark:border-white/15 bg-surface dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-ink-soft hover:text-ink transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        title="Back to options"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-[#0F9D58] to-[#128C7E] hover:from-[#0d8a4d] hover:to-[#0f7a6e] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 active:scale-98"
                      >
                        <span>Open WhatsApp</span>
                        <Send size={15} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Premium Footer */}
            <div className="px-5 py-3 bg-surface/90 dark:bg-zinc-900/90 border-t border-black/6 dark:border-white/10 text-xs text-ink-soft flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles size={13} className="text-[#0F9D58]" /> Direct WhatsApp Chat
              </span>
              <span className="font-mono text-xs text-ink-soft/80 font-semibold">+91 8248960558</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button with Soft Glow */}
      <div className="relative">
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 z-10 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 text-white text-[10px] font-bold items-center justify-center shadow-xs">
              1
            </span>
          </span>
        )}

        <motion.button
          ref={buttonRef}
          onClick={toggleWidget}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-expanded={isOpen}
          aria-label="Contact Arun on WhatsApp"
          className={`group flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/30 ${
            isOpen
              ? 'bg-ink text-bg shadow-lg border border-line'
              : 'bg-gradient-to-tr from-[#0F9D58] to-[#25D366] text-white shadow-[0_10px_30px_rgba(15,157,88,0.4)] hover:shadow-[0_14px_38px_rgba(15,157,88,0.55)]'
          }`}
        >
          {isOpen ? (
            <X size={24} className="transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <WhatsAppIcon size={28} className="fill-current text-white transition-transform group-hover:scale-110 drop-shadow-xs" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
