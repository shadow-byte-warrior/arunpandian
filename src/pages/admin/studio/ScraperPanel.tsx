import React, { useState } from 'react';
import { Search, Loader2, Globe, CheckCircle2, AlertCircle, Link, Palette, Type, Grid, Wand2 } from 'lucide-react';
import { useThemeStore } from '../../../theme/store';

// ── Design pattern categories returned from the scraper ──
interface DesignBlueprint {
  url: string;
  colors: { bg: string; accent: string; text: string; surface: string }[];
  fonts: { heading: string; body: string }[];
  navbarStyle: string;
  heroLayout: string;
  cardStyle: string;
  scrollEffect: string;
  animationStyle: string;
  components: string[];
  borderRadius: string;
  spacing: string;
}

// ── Lightweight CSS-metadata extractor (client side via CORS proxies) ──
async function fetchWithFallbacks(url: string): Promise<string> {
  const proxies = [
    // 1. corsproxy.io (returns raw HTML)
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    // 2. codetabs proxy (returns raw HTML)
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    // 3. allOrigins proxy (returns JSON with contents)
    (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
  ];

  let lastError: any = null;
  for (const getProxyUrl of proxies) {
    try {
      const proxyUrl = getProxyUrl(url);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
      
      const contentType = res.headers.get('content-type') || '';
      
      // allOrigins returns JSON { contents: "..." }
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json.contents) return json.contents;
      }
      
      // corsproxy.io and codetabs return raw HTML
      const html = await res.text();
      if (html) return html;
    } catch (e) {
      lastError = e;
      continue; // Try the next proxy
    }
  }
  
  throw new Error(lastError?.message || 'Network error: All scraper proxies failed to fetch the URL.');
}

async function analyzeUrl(url: string): Promise<DesignBlueprint> {
  // Use advanced fallback scraper
  const html = await fetchWithFallbacks(url);

  // ── Parse meta colors from HTML/CSS ──
  const colorMatches = html.match(/#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)/g) || [];
  const uniqueColors = [...new Set(colorMatches)].slice(0, 12);
  const bgColor = uniqueColors.find(c => /f[a-f0-9]{5}/i.test(c)) || '#ffffff';
  const accentColor = uniqueColors.find(c => !/fff|000|eee|ddd|ccc/i.test(c)) || '#2563eb';

  // ── Detect font families ──
  const fontMatches = html.match(/font-family:\s*['"]?([^;'"]+)/g) || [];
  const fonts = fontMatches.map(f => f.replace('font-family:', '').replace(/['"]/g, '').trim()).filter(Boolean);
  const headingFont = fonts[0] || 'Inter, sans-serif';
  const bodyFont = fonts[1] || fonts[0] || 'Inter, sans-serif';

  // ── Detect navbar type ──
  const hasFixedNav = /position:\s*fixed|position:\s*sticky/.test(html);
  const hasGlassNav = /backdrop-filter|blur\(/.test(html);
  const navbarStyle = hasGlassNav ? 'Glassy (vividmotion-style)' : hasFixedNav ? 'Floating Fixed' : 'Standard Top';

  // ── Detect grid / layout ──
  const hasGrid = /display:\s*grid/.test(html);
  const hasFlexbox = /display:\s*flex/.test(html);
  const hasMasonry = /masonry|columns:\s*\d/.test(html);

  // ── Detect animation patterns ──
  const hasGsap = /gsap|ScrollTrigger/.test(html);
  const hasFramer = /framer-motion|motion\.div/.test(html);
  const hasLottie = /lottie/.test(html);
  const hasThreeJs = /three\.js|THREE\.|@react-three/.test(html);
  const animStyle = hasGsap ? 'GSAP ScrollTrigger' : hasFramer ? 'Framer Motion' : hasThreeJs ? 'Three.js 3D' : hasLottie ? 'Lottie' : 'CSS Animations';

  // ── Detect border radius ──
  const radiusMatch = html.match(/border-radius:\s*([\d.]+(?:px|rem|%|em))/);
  const borderRadius = radiusMatch ? radiusMatch[1] : '8px';

  // ── Detect scroll effects ──
  const hasParallax = /parallax|translateY/.test(html);
  const hasSnapScroll = /scroll-snap/.test(html);
  const scrollEffect = hasSnapScroll ? 'Snap Scroll' : hasParallax ? 'Parallax Scroll' : 'Standard Scroll';

  // ── Detect card components ──
  const components: string[] = [];
  if (/<nav/i.test(html)) components.push('Navbar');
  if (/<section|<main/i.test(html)) components.push('Hero Section');
  if (hasGrid || hasMasonry) components.push('Grid / Masonry Cards');
  if (hasFlexbox) components.push('Flex Layout');
  if (/<footer/i.test(html)) components.push('Footer');
  if (/<form/i.test(html)) components.push('Contact Form');
  if (/slider|swiper|carousel/i.test(html)) components.push('Slider / Carousel');
  if (/<video/i.test(html)) components.push('Video Background');
  if (hasThreeJs) components.push('3D Scene (Three.js)');
  if (/cursor/i.test(html)) components.push('Custom Cursor');

  return {
    url,
    colors: [
      { bg: bgColor, accent: accentColor, text: '#111111', surface: '#f5f5f5' },
      ...uniqueColors.slice(0, 3).map(c => ({ bg: c, accent: c, text: '#111', surface: '#fff' })),
    ],
    fonts: [{ heading: headingFont, body: bodyFont }],
    navbarStyle,
    heroLayout: hasThreeJs ? '3D Immersive Hero' : /parallax/i.test(html) ? 'Parallax Portrait' : 'Standard Hero',
    cardStyle: hasMasonry ? 'Masonry' : hasGrid ? 'Grid Cards' : 'Flex Cards',
    scrollEffect,
    animationStyle: animStyle,
    components,
    borderRadius,
    spacing: '1.5rem',
  };
}

export default function ScraperPanel() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DesignBlueprint | null>(null);
  const [error, setError] = useState('');
  const { updateColors, updateTypography, updateLayout } = useThemeStore();

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const normalized = url.startsWith('http') ? url : `https://${url}`;
      const blueprint = await analyzeUrl(normalized);
      setResult(blueprint);
    } catch (e: any) {
      setError(e.message || 'Could not reach the URL. Try another site.');
    } finally {
      setLoading(false);
    }
  };

  const applyColor = (c: { bg: string; accent: string; text: string; surface: string }) => {
    updateColors({ background: c.bg, primary: c.accent, text: c.text, surface: c.surface });
  };

  const applyFonts = (f: { heading: string; body: string }) => {
    updateTypography({ headingFont: f.heading, fontFamily: f.body });
  };

  const applyAll = () => {
    if (!result) return;
    if (result.colors[0]) applyColor(result.colors[0]);
    if (result.fonts[0]) applyFonts(result.fonts[0]);
    updateLayout({ radius: result.borderRadius });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Wand2 size={14} className="text-purple-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">AI Inspiration Scraper</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Paste any website URL to extract its design patterns — colors, fonts, layouts, animations. No assets are copied.
        </p>
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#2a2a2a] rounded-lg focus-within:border-blue-500 transition-colors">
          <Globe size={13} className="text-slate-500 shrink-0" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="https://example.com"
            className="flex-1 bg-transparent text-[12px] text-slate-200 placeholder-slate-600 outline-none"
          />
        </div>
        <button
          onClick={analyze}
          disabled={loading || !url.trim()}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-[11px] font-semibold text-white shrink-0"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-1.5">
        {['pelizzari.com', 'karolbinkow.ski', 'haoqi.design', 'vividmotion.co', 'tol.is', 'pxpush.com'].map((site) => (
          <button key={site} onClick={() => { setUrl(`https://${site}`); }}
            className="px-2 py-1 text-[10px] rounded border border-[#2a2a2a] text-slate-500 hover:text-slate-200 hover:border-[#3a3a3a] transition-all">
            {site}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-[#2a2a2a] border-t-purple-500 animate-spin" />
            <Globe size={14} className="absolute inset-0 m-auto text-purple-400" />
          </div>
          <p className="text-[11px] text-slate-500">Extracting design metadata…</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="text-[11px] font-semibold text-slate-300">Blueprint extracted</span>
            </div>
            <button onClick={applyAll}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors">
              Apply All
            </button>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Palette size={11} className="text-slate-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Detected Colors</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {result.colors.slice(0, 4).map((c, i) => (
                <button key={i} onClick={() => applyColor(c)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-[#2a2a2a] hover:border-purple-500/50 transition-all">
                  <div className="flex gap-1">
                    <span className="h-4 w-4 rounded-full border border-white/10" style={{ background: c.bg }} />
                    <span className="h-4 w-4 rounded-full border border-white/10" style={{ background: c.accent }} />
                    <span className="h-4 w-4 rounded-full border border-white/10" style={{ background: c.text }} />
                  </div>
                  <span className="text-[10px] text-slate-500 hover:text-slate-300">Apply</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Type size={11} className="text-slate-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Detected Fonts</span>
            </div>
            {result.fonts.slice(0, 2).map((f, i) => (
              <button key={i} onClick={() => applyFonts(f)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-[#2a2a2a] hover:border-purple-500/50 text-left transition-all">
                <div>
                  <p className="text-[11px] text-slate-300">{f.heading.split(',')[0]}</p>
                  <p className="text-[10px] text-slate-600">{f.body.split(',')[0]}</p>
                </div>
                <span className="text-[10px] text-purple-400">Apply</span>
              </button>
            ))}
          </div>

          {/* Detected Components */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Grid size={11} className="text-slate-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Detected Components</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.components.map((c) => (
                <span key={c} className="px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] text-slate-400">{c}</span>
              ))}
            </div>
          </div>

          {/* Design Metadata */}
          <div className="space-y-1.5 p-3 rounded-lg bg-[#111] border border-[#1f1f1f]">
            {[
              ['Navbar', result.navbarStyle],
              ['Hero', result.heroLayout],
              ['Cards', result.cardStyle],
              ['Scroll', result.scrollEffect],
              ['Animation', result.animationStyle],
              ['Border Radius', result.borderRadius],
            ].map(([key, val]) => (
              <div key={key} className="flex items-center justify-between text-[10px]">
                <span className="text-slate-600">{key}</span>
                <span className="text-slate-300 font-mono">{val}</span>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-slate-600 italic">
            Only design metadata extracted. No images, logos, text or copyrighted assets are copied.
          </p>
        </div>
      )}
    </div>
  );
}
