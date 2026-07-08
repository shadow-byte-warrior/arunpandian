import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Timeline from '../components/Timeline';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import ContactForm from '../components/ContactForm';
import Welcome from '../components/Welcome';
import Parallax from '../components/Parallax';
import SliceReveal from '../components/SliceReveal';
import Logo from '../components/Logo';
import { ArrowUp, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentProvider';
import CanvasRuntime from '../editor/CanvasRuntime';
import StyleOverrides from '../editor/StyleOverrides';

export default function HomePage() {
  const { settings, projects, blogs } = useContent();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // When rendered inside the admin live-preview iframe, skip the intro animation
  // so edits are visible immediately.
  const isPreview =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('preview') === '1';

  const [intro, setIntro] = useState(!isPreview);

  // Admin can disable the welcome intro entirely
  const welcomeEnabled = settings?.welcome?.enabled !== false;
  useEffect(() => {
    if (!welcomeEnabled && intro) setIntro(false);
  }, [welcomeEnabled, intro]);

  useEffect(() => {
    if (!intro) {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      return;
    }
    document.body.style.overflow = 'hidden';
    const safety = setTimeout(() => setIntro(false), 9000);
    return () => {
      clearTimeout(safety);
      document.body.style.overflow = '';
    };
  }, [intro]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // ── Theme: apply admin-configured tokens as CSS variables (live) ──
  const theme = settings?.theme;
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const vars = {
      '--color-accent': theme.accentColor,
      '--color-ink': theme.inkColor,
      '--color-bg': theme.bgColor,
      '--color-surface': theme.surfaceColor,
    };
    for (const [k, v] of Object.entries(vars)) {
      if (v) root.style.setProperty(k, v);
    }
    // Font: Space Grotesk & Archivo ship with the site; load others on demand
    if (theme.fontFamily) {
      if (!['Space Grotesk', 'Archivo'].includes(theme.fontFamily)) {
        const id = 'theme-font-link';
        let link = document.getElementById(id);
        const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.fontFamily)}:wght@300;400;500;600;700&display=swap`;
        if (!link) {
          link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
        if (link.href !== href) link.href = href;
      }
      root.style.setProperty('--font-sans', `'${theme.fontFamily}', system-ui, sans-serif`);
    }
    return () => {
      // Restore stylesheet defaults when leaving the public page (e.g. into /admin)
      Object.keys(vars).forEach((k) => root.style.removeProperty(k));
      root.style.removeProperty('--font-sans');
    };
  }, [theme]);

  // ── SEO: document title + meta tags from admin settings (live) ──
  const seo = settings?.seo;
  useEffect(() => {
    if (!seo) return;
    if (seo.metaTitle) document.title = seo.metaTitle;
    const setMeta = (attr, name, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('name', 'description', seo.metaDescription);
    setMeta('name', 'keywords', seo.keywords);
    setMeta('property', 'og:title', seo.metaTitle);
    setMeta('property', 'og:description', seo.metaDescription);
    setMeta('property', 'og:image', seo.ogImage);
    setMeta('name', 'twitter:site', seo.twitterHandle);
  }, [seo]);

  const footerData = settings?.footer || {};
  const projectsSection = settings?.sections?.projects || {};
  const blogSection = settings?.sections?.blog || {};

  return (
    <div className="grain bg-bg text-ink min-h-screen relative">
      <StyleOverrides />
      {isPreview && <CanvasRuntime />}

      <AnimatePresence>
        {intro && welcomeEnabled && !isPreview && <Welcome key="welcome" onDone={() => setIntro(false)} />}
      </AnimatePresence>

      <Navbar />

      <Hero />
      <About />
      <Skills />
      <Timeline />

      {/* Projects Section */}
      <section id="projects" className="py-24 sm:py-32 bg-bg">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Parallax speed={26} className="mb-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span data-edit-id="projects.label" data-edit-name="Projects · Eyebrow" data-edit-kind="text" data-edit-path="sections.projects.label" className="text-xs font-mono tracking-[0.25em] text-accent uppercase">{projectsSection.label}</span>
                <h2 data-edit-id="projects.title" data-edit-name="Projects · Title" data-edit-kind="heading" data-edit-path="sections.projects.title" className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">{projectsSection.title}</h2>
              </div>
              <p data-edit-id="projects.subtitle" data-edit-name="Projects · Subtitle" data-edit-kind="text" data-edit-path="sections.projects.subtitle" className="text-sm text-ink-soft max-w-xs">{projectsSection.subtitle}</p>
            </div>
          </Parallax>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {projects?.map((project, i) => (
              <SliceReveal key={project._id || project.title} delay={(i % 2) * 0.12}>
                <ProjectCard project={project} />
              </SliceReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 sm:py-32 bg-surface border-y border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Parallax speed={26} className="mb-14">
            <span data-edit-id="blog.label" data-edit-name="Writing · Eyebrow" data-edit-kind="text" data-edit-path="sections.blog.label" className="text-xs font-mono tracking-[0.25em] text-accent uppercase">{blogSection.label}</span>
            <h2 data-edit-id="blog.title" data-edit-name="Writing · Title" data-edit-kind="heading" data-edit-path="sections.blog.title" className="mt-3 font-display font-extrabold text-3xl sm:text-5xl text-ink tracking-tight">{blogSection.title}</h2>
          </Parallax>

          <div className="grid md:grid-cols-3 gap-6">
            {blogs?.map((blog, i) => (
              <SliceReveal key={blog._id || blog.title} delay={(i % 3) * 0.12} className="h-full">
                <BlogCard blog={blog} />
              </SliceReveal>
            ))}
          </div>
        </div>
      </section>

      <ContactForm />

      {/* Footer */}
      <footer className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <Logo size={40} className="text-white mb-5" title="AP monogram" />
              <h3 data-edit-id="footer.name" data-edit-name="Footer · Name" data-edit-kind="heading" data-edit-path="footer.name" className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight">{footerData.name}</h3>
              <p data-edit-id="footer.tagline" data-edit-name="Footer · Tagline" data-edit-kind="text" data-edit-path="footer.tagline" className="mt-3 text-white/60 max-w-sm">{footerData.tagline}</p>
            </div>
            <div className="flex gap-6 text-sm text-white/70">
              <a href={footerData.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href={footerData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href={`mailto:${footerData.email}`} className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/40 font-mono">
            <span>&copy; {new Date().getFullYear()} {footerData.name}. {footerData.copyright}</span>
            <div className="flex items-center gap-4">
              <span>Designed &amp; developed in {footerData.designYear}</span>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-white/30 hover:text-white/70 hover:border-white/30 transition-all duration-300 cursor-pointer"
                aria-label="Admin dashboard"
              >
                <Lock size={10} />
                <span className="text-[10px] tracking-wider uppercase">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 p-3.5 bg-ink hover:bg-accent text-white rounded-full shadow-lg z-50 cursor-pointer focus:outline-none transition-colors"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
