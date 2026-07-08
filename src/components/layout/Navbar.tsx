import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Logo from '../ui/Logo';

export default function Navbar() {
  const brandName = 'Arun Pandian';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['hero', 'about', 'skills', 'timeline', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#timeline' },
    { name: 'Work', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];
  
  const ctaLabel = 'Résumé';
  const ctaHref = '/resume.pdf';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className={`flex items-center justify-between rounded-2xl transition-all duration-500 ${scrolled ? 'bg-surface/80 backdrop-blur-xl border border-line shadow-[0_8px_30px_-12px_rgba(9,9,11,0.15)] px-5 py-2.5' : 'bg-transparent px-1'}`}>
          <a href="#hero" className="flex items-center gap-2.5 group" aria-label={`${brandName} — home`}>
            <Logo size={30} className="text-[#1E293B] transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="font-display font-bold tracking-tight text-ink">{brandName}</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-slate-200" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                  )}
                </a>
              );
            })}
            <a href={ctaHref} download className="ml-2 px-4 py-2 rounded-full bg-ink text-white text-sm font-semibold hover:bg-accent transition-colors">
              {ctaLabel}
            </a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-ink p-1" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <motion.div style={{ scaleX: progress }} className="origin-left h-0.5 bg-accent mt-2 mx-auto max-w-7xl" />

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden mx-5 mt-2 rounded-2xl bg-surface/95 backdrop-blur-xl border border-line shadow-xl p-3"
        >
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 font-medium">
              {link.name}
            </a>
          ))}
          <a href={ctaHref} download className="block mt-1 text-center px-4 py-2.5 rounded-xl bg-ink text-white font-semibold">
            {ctaLabel}
          </a>
        </motion.div>
      )}
    </nav>
  );
}
