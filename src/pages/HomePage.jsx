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


  // ─── Custom Cursor State ───
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const layout = settings?.theme?.layout || {};
  const cursorStyle = layout.cursorStyle || 'default';

  useEffect(() => {
    if (cursorStyle === 'default' || cursorStyle === 'none' || isPreview || typeof window === 'undefined') return;
    const updateCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [role="button"], [data-edit-id]')) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };
    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [cursorStyle, isPreview]);

  // ── Theme: apply admin-configured tokens as CSS variables (live) ──
  const theme = settings?.theme;
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const colors = theme.colors || {};
    const themeLayout = theme.layout || {};

    const vars = {
      '--color-primary': colors.primary || theme.accentColor || '#2563EB',
      '--color-background': colors.background || theme.bgColor || '#FAFAFA',
      '--color-surface': colors.surface || theme.surfaceColor || '#FFFFFF',
      '--color-text': colors.text || theme.inkColor || '#09090B',
      '--color-muted': colors.muted || '#71717A',
      '--color-border': colors.border || '#E4E4E7',
      '--color-accent': colors.accent || colors.primary || theme.accentColor || '#2563EB',
      '--color-ink': colors.text || theme.inkColor || '#09090B',
      '--color-bg': colors.background || theme.bgColor || '#FAFAFA',
      '--radius-base': themeLayout.radius || theme.radius || '1rem',
      '--border-custom': themeLayout.borderStyle || 'none',
    };

    for (const [k, v] of Object.entries(vars)) {
      if (v) root.style.setProperty(k, v);
    }

    // Dynamic Google Fonts Loader (Body and Heading fonts)
    const loadFont = (fontName, elementId, cssVarName1, cssVarName2, fallbackStack) => {
      if (!fontName) return;
      const cleanFont = fontName.split(',')[0].replace(/['"]/g, '').trim();
      const id = `theme-font-${elementId}`;
      let link = document.getElementById(id);
      const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFont)}:wght@300;400;500;600;700;800;900&display=swap`;
      if (!link) {
        link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      if (link.href !== href) link.href = href;
      root.style.setProperty(cssVarName1, `'${cleanFont}', ${fallbackStack}`);
      root.style.setProperty(cssVarName2, `'${cleanFont}', ${fallbackStack}`);
    };

    if (theme.fontFamily) {
      loadFont(theme.fontFamily, 'body', '--font-sans', '--font-primary', 'system-ui, sans-serif');
    }
    if (theme.headingFont) {
      loadFont(theme.headingFont, 'heading', '--font-display', '--font-heading', 'system-ui, sans-serif');
    } else if (theme.fontFamily) {
      const cleanBody = theme.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      root.style.setProperty('--font-display', `'${cleanBody}', system-ui, sans-serif`);
      root.style.setProperty('--font-heading', `'${cleanBody}', system-ui, sans-serif`);
    }

    return () => {
      Object.keys(vars).forEach((k) => root.style.removeProperty(k));
      root.style.removeProperty('--font-sans');
      root.style.removeProperty('--font-primary');
      root.style.removeProperty('--font-display');
      root.style.removeProperty('--font-heading');
      root.style.removeProperty('--border-custom');
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

  const animationStyle = theme?.layout?.animationStyle || 'default';

  return (
    <div className={`grain bg-bg text-ink min-h-screen relative awwwards-preset-${animationStyle}`}>
      {/* Custom Styles Injector for Awwwards animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-element { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .awwwards-preset-joyrush .custom-element-button { background-color: var(--color-primary); color: #2C0E1E; border: 3px solid #2C0E1E; box-shadow: 4px 4px 0px #2C0E1E; border-radius: 9999px; }
        .awwwards-preset-joyrush .custom-element-button:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #2C0E1E; }
        .awwwards-preset-k95 { font-family: var(--font-primary); }
        .awwwards-preset-k95 .custom-element-button { background: transparent; color: var(--color-text); border: 1px solid var(--color-border); border-radius: 0px; text-transform: uppercase; letter-spacing: 0.1em; }
        .awwwards-preset-k95 .custom-element-button:hover { background: var(--color-text); color: var(--color-background); }
        .awwwards-preset-juliencalot { background-image: radial-gradient(circle at 10% 20%, rgba(255, 42, 84, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%); }
        .awwwards-preset-depoluxe { text-transform: uppercase; }
        .awwwards-preset-depoluxe .custom-element-button { border: 1px solid var(--color-primary); color: var(--color-primary); background: transparent; border-radius: 0px; font-weight: 800; letter-spacing: 0.2em; }
        .awwwards-preset-depoluxe .custom-element-button:hover { background: var(--color-primary); color: var(--color-background); }
        .awwwards-preset-monolog { letter-spacing: 0.05em; line-height: 1.8; }
        .awwwards-preset-monolog .custom-element-button { border-bottom: 1px solid var(--color-primary); border-radius: 0px; background: transparent; color: var(--color-text); padding: 4px 0px; }
        .awwwards-preset-radian { background-color: #000; color: #fff; }
        .awwwards-preset-radian .custom-element-button { background: var(--color-primary); color: #000; border-radius: 4px; font-weight: 900; }
        .awwwards-preset-radian .custom-element-button:hover { box-shadow: 0 0 15px var(--color-primary); }
      ` }} />

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

      {/* Dynamic Custom Section */}
      {settings?.custom_elements && Object.values(settings.custom_elements).some((e) => e.section === 'custom_section') && (
        <section id="custom-section" className="py-24 sm:py-32 bg-bg border-b border-line">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <span className="text-xs font-mono tracking-[0.25em] text-accent uppercase">06 — Custom Section</span>
            <div className="mt-8 space-y-6">
              {renderCustomElements('custom_section', settings.custom_elements)}
            </div>
          </div>
        </section>
      )}

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

      {/* Custom Awwwards Cursors */}
      {cursorStyle !== 'default' && cursorStyle !== 'none' && !isPreview && (
        <div
          className="fixed pointer-events-none z-[9999] rounded-full transition-transform duration-100 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: `translate(-50%, -50%) scale(${hovered ? 1.4 : 1})`,
            ...getCursorStyles(cursorStyle)
          }}
        />
      )}
    </div>
  );
}

// ─── Visual Editor Dynamic Custom Element Renderer ───
export function renderCustomElements(sectionName, elementsDict) {
  if (!elementsDict) return null;
  const els = Object.values(elementsDict)
    .filter((e) => e.section === sectionName)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return els.map((el) => {
    const commonProps = {
      key: el.id,
      'data-edit-id': el.id,
      'data-edit-name': el.name,
      'data-edit-kind': el.kind,
      'data-edit-path': el.path,
      className: `custom-element custom-element-${el.kind} my-4 transition-all duration-300 inline-block w-full`,
    };

    switch (el.kind) {
      case 'heading':
        return (
          <h3 {...commonProps} className={`${commonProps.className} font-display font-bold text-2xl sm:text-4xl text-ink leading-tight`}>
            {el.value}
          </h3>
        );
      case 'text':
        return (
          <p {...commonProps} className={`${commonProps.className} text-base text-ink-soft leading-relaxed`}>
            {el.value}
          </p>
        );
      case 'button':
        return (
          <div key={el.id} className="my-4">
            <a
              href={el.href || '#'}
              {...commonProps}
              className={`custom-element-button inline-flex items-center justify-center px-6 py-3 rounded-full bg-ink text-white font-semibold hover:bg-accent text-sm transition-all duration-300`}
            >
              {el.value}
            </a>
          </div>
        );
      case 'link':
        return (
          <div key={el.id} className="my-4">
            <a
              href={el.href || '#'}
              {...commonProps}
              className={`text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1`}
            >
              {el.value}
            </a>
          </div>
        );
      case 'image':
        return (
          <img
            src={el.value}
            alt={el.name}
            {...commonProps}
            className={`${commonProps.className} max-w-md h-auto rounded-lg border border-line object-cover shadow-md`}
          />
        );
      default:
        return null;
    }
  });
}

function getCursorStyles(style) {
  switch (style) {
    case 'dot':
      return {
        width: '8px',
        height: '8px',
        backgroundColor: 'var(--color-primary)',
        boxShadow: '0 0 8px var(--color-primary)',
      };
    case 'bubble':
      return {
        width: '32px',
        height: '32px',
        border: '2px solid var(--color-primary)',
        backgroundColor: 'rgba(255, 92, 138, 0.08)',
      };
    case 'invert':
      return {
        width: '24px',
        height: '24px',
        backgroundColor: '#ffffff',
        mixBlendMode: 'difference',
      };
    case 'crosshair':
      return {
        width: '16px',
        height: '16px',
        border: '1.5px solid var(--color-primary)',
        borderRadius: '0px',
      };
    default:
      return {};
  }
}

