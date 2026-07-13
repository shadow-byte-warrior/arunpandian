import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Monitor, Laptop, Tablet, Smartphone, Undo2, Redo2, Save, Eye,
  Palette, Layout, Zap, Wand2, Loader2, MousePointer2,
  Grid3X3, Layers, Globe, RefreshCw, X, PanelLeft, PanelRight,
} from 'lucide-react';
import { useThemeStore } from '../../theme/store';
import { useSiteSettings } from '../../components/admin/hooks/useSiteSettings';
import { useEditorStore, overridesToCss } from '../../editor/editorStore';
import { useContent } from '../../context/ContentProvider';
import toast from 'react-hot-toast';
import ThemePanel from './studio/ThemePanel';
import StructurePanel from './studio/StructurePanel';
import ScrollStudio from './studio/ScrollStudio';
import ScraperPanel from './studio/ScraperPanel';
import Inspector from './canvas/Inspector';

type Tab = 'theme' | 'structure' | 'motion' | 'scraper';
type DeviceKey = 'desktop' | 'laptop' | 'tablet' | 'mobile';

const DEVICES: { id: DeviceKey; icon: any; label: string; width: number | null }[] = [
  { id: 'desktop', icon: Monitor, label: 'Desktop', width: null },
  { id: 'laptop', icon: Laptop, label: 'Laptop', width: 1280 },
  { id: 'tablet', icon: Tablet, label: 'Tablet', width: 834 },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', width: 390 },
];

const RIGHT_TABS: { id: Tab; icon: any; label: string; color: string; activeColor: string }[] = [
  { id: 'theme',     icon: Palette,  label: 'Theme',     color: 'text-slate-500',       activeColor: 'text-blue-600' },
  { id: 'structure', icon: Layout,   label: 'Structure', color: 'text-slate-500',       activeColor: 'text-purple-600' },
  { id: 'motion',    icon: Zap,      label: 'Motion',    color: 'text-slate-500',       activeColor: 'text-amber-600' },
  { id: 'scraper',   icon: Wand2,    label: 'Scraper',   color: 'text-slate-500',       activeColor: 'text-emerald-600' },
];

export default function Studio() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme, updateLayout, applyPreset } = useThemeStore();
  const { saveSettings } = useSiteSettings('theme');
  const { settings } = useContent() as any;

  const enabled = useEditorStore((s) => s.enabled);
  const setEnabled = useEditorStore((s) => s.setEnabled);
  const toggleEnabled = useEditorStore((s) => s.toggleEnabled);
  const overrides = useEditorStore((s) => s.overrides);
  const content = useEditorStore((s) => s.content);
  const selected = useEditorStore((s) => s.selected);
  const setSelected = useEditorStore((s) => s.setSelected);
  const setContent = useEditorStore((s) => s.setContent);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('theme');
  const [device, setDevice] = useState<DeviceKey>('desktop');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const pushTheme = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SYNC_THEME', theme: themeRef.current }, '*');
  }, []);

  const pushEditorState = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'EDITOR_MODE', enabled }, '*');
    iframeRef.current?.contentWindow?.postMessage({ type: 'EDITOR_STYLE', css: overridesToCss(overrides) }, '*');
    iframeRef.current?.contentWindow?.postMessage({ type: 'PREVIEW_OVERRIDE', payload: { settings: content } }, '*');
  }, [enabled, overrides, content]);

  useEffect(() => { pushTheme(); }, [theme, pushTheme]);

  useEffect(() => {
    const handle = (e: MessageEvent) => {
      const d = e.data || {};
      if (d.type === 'THEME_STUDIO_READY' || d.type === 'EDITOR_RUNTIME_READY') {
        pushTheme();
        pushEditorState();
      }
      if (d.type === 'EDITOR_SELECTED') setSelected(d.info);
      if (d.type === 'EDITOR_CLEARED') setSelected(null);
      if (d.type === 'EDITOR_CONTENT' && d.path) setContent(d.path, d.value);
    };
    window.addEventListener('message', handle);
    return () => window.removeEventListener('message', handle);
  }, [pushTheme, pushEditorState, setSelected, setContent]);

  useEffect(() => { pushEditorState(); }, [enabled, overrides, content, pushEditorState]);

  const handleIframeLoad = () => {
    pushTheme();
    pushEditorState();
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try { await saveSettings(theme); } finally { setIsSaving(false); }
  };

  const deviceWidth = DEVICES.find((d) => d.id === device)?.width;
  const canvasWidth = deviceWidth ? `${deviceWidth}px` : '100%';
  const canvasMaxWidth = deviceWidth ? `${deviceWidth}px` : '100%';

  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden select-none">

      {/* ── LEFT PANEL ── */}
      {leftOpen && (
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Library</span>
            <button onClick={() => setLeftOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <PanelLeft size={13} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 py-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Sections</span>
            </div>
            {[
              { anchor: '#hero',     label: 'Hero',       dot: 'bg-blue-500' },
              { anchor: '#about',    label: 'About',      dot: 'bg-purple-500' },
              { anchor: '#skills',   label: 'Skills',     dot: 'bg-amber-500' },
              { anchor: '#timeline', label: 'Experience', dot: 'bg-emerald-500' },
              { anchor: '#projects', label: 'Projects',   dot: 'bg-red-500' },
              { anchor: '#blog',     label: 'Blog',       dot: 'bg-cyan-500' },
              { anchor: 'footer',    label: 'Footer',     dot: 'bg-slate-400' },
            ].map(({ anchor, label, dot }) => (
              <button key={anchor} onClick={() => {
                iframeRef.current?.contentWindow?.postMessage({ type: 'PREVIEW_SCROLL', anchor }, '*');
              }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-left">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                {label}
              </button>
            ))}

            <div className="px-3 py-1.5 mt-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Quick Presets</span>
            </div>
            {['Haoqi Design (haoqi.design)', 'Radian (rideradian.com)', 'Karol Binkowski (karolbinkow.ski)', 'Metropolitan Luxe (Awwwards)', 'Depoluxe (depoluxe.xyz)', 'Joy Rush (drinkjoyrush.com)'].map((name) => (
              <button key={name} onClick={() => applyPreset(name)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-left">
                <Grid3X3 size={11} className="text-slate-400 shrink-0" />
                {name.split(' (')[0]}
              </button>
            ))}

            <div className="px-3 py-1.5 mt-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Layers</span>
            </div>
            {['Navbar', 'Hero · Headline', 'Hero · Subtitle', 'About · Card', 'Skills · Grid', 'Projects · List', 'Footer'].map((layer) => (
              <button key={layer}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all text-left cursor-pointer">
                <Layers size={10} className="text-slate-300 shrink-0" />
                {layer}
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* ── CENTER ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Toolbar */}
        <header className="flex items-center gap-2 px-3 h-11 bg-white border-b border-slate-200 shrink-0 shadow-sm">
          {/* Left */}
          <div className="flex items-center gap-2">
            {!leftOpen && (
              <button onClick={() => setLeftOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
                <PanelLeft size={14} />
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-500 to-violet-600" />
              <span className="text-[12px] font-bold text-slate-700 tracking-tight">Design OS</span>
            </div>
          </div>

          {/* Center: Device switcher */}
          <div className="flex-1 flex items-center justify-center gap-0.5">
            {DEVICES.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setDevice(id)} title={label}
                className={`p-1.5 rounded-lg transition-all ${
                  device === id
                    ? 'bg-slate-100 text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}>
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setIframeKey(k => k + 1)} title="Refresh preview"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
              <RefreshCw size={13} />
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button onClick={undo} disabled={!canUndo} title="Undo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Undo2 size={14} />
            </button>
            <button onClick={redo} disabled={!canRedo} title="Redo"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <Redo2 size={14} />
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button onClick={toggleEnabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                enabled
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {enabled ? <MousePointer2 size={12} /> : <Eye size={12} />}
              {enabled ? 'Editing' : 'Preview'}
            </button>
            <button onClick={handlePublish} disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-[11px] font-bold transition-all shadow-sm">
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {isSaving ? 'Saving…' : 'Publish'}
            </button>
            {!rightOpen && (
              <button onClick={() => setRightOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all ml-1">
                <PanelRight size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-6"
          style={{
            background: '#f1f5f9',
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}>
          <div
            className="relative bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300"
            style={{
              width: canvasWidth,
              maxWidth: canvasMaxWidth,
              minHeight: '100%',
              borderRadius: device === 'mobile' ? '28px' : '8px',
            }}
          >
            {device === 'mobile' && (
              <div className="absolute top-0 inset-x-0 flex justify-center z-10 pointer-events-none">
                <div className="h-6 w-24 bg-black rounded-b-2xl" />
              </div>
            )}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src="/?preview=1"
              onLoad={handleIframeLoad}
              className="w-full border-0"
              style={{
                height: device === 'mobile' ? '812px' : device === 'tablet' ? '1024px' : '100vh',
                minHeight: '600px',
              }}
              title="Design OS Preview"
            />
          </div>
        </div>

        {/* Status Bar */}
        <footer className="flex items-center justify-between px-4 h-6 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3 text-[9px] text-slate-400">
            <span>{device === 'desktop' ? 'Full Width' : `${deviceWidth}px`}</span>
            {selected && (
              <>
                <span>·</span>
                <span className="text-blue-500">{selected.name}</span>
                <span>·</span>
                <span className="capitalize text-slate-400">{selected.kind}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 text-[9px] text-slate-400">
            <span>{enabled ? '● Edit mode' : '○ Preview mode'}</span>
            {enabled && <span className="text-blue-500 animate-pulse">Click any element to select</span>}
          </div>
        </footer>
      </main>

      {/* ── RIGHT PANEL ── */}
      {rightOpen && (
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-sm">
          {/* Tab Bar */}
          <div className="flex items-center border-b border-slate-100 px-1 pt-1 gap-0.5 shrink-0 bg-white">
            {RIGHT_TABS.map(({ id, icon: Icon, label, color, activeColor }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-t transition-all text-[9px] font-bold uppercase tracking-wider ${
                  activeTab === id
                    ? `bg-slate-50 border-b-2 border-blue-500 ${activeColor}`
                    : `${color} hover:text-slate-600`
                }`}>
                <Icon size={12} />
                {label}
              </button>
            ))}
            <button onClick={() => setRightOpen(false)} className="ml-auto px-2 pb-1 text-slate-400 hover:text-slate-600 transition-colors self-start mt-1">
              <X size={12} />
            </button>
          </div>

          {/* Selected element bar */}
          {selected && enabled && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-blue-50">
              <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-blue-700 truncate">{selected.name}</p>
                <p className="text-[9px] text-slate-500 capitalize">{selected.kind}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={11} />
              </button>
            </div>
          )}

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {selected && enabled ? (
              <Inspector />
            ) : (
              <>
                {activeTab === 'theme'     && <ThemePanel />}
                {activeTab === 'structure' && <StructurePanel />}
                {activeTab === 'motion'    && <ScrollStudio />}
                {activeTab === 'scraper'   && <ScraperPanel />}
              </>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
