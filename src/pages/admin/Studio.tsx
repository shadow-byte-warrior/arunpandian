import React, { useRef, useEffect, useState } from 'react';
import { useThemeStore } from '../../theme/store';
import { presets } from '../../theme/presets';
import { useSiteSettings } from '../../components/admin/hooks/useSiteSettings';
import toast from 'react-hot-toast';

export default function Studio() {
  const { theme, updateColors, updateTypography, applyPreset } = useThemeStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { saveSettings } = useSiteSettings('theme');
  const [isSaving, setIsSaving] = useState(false);

  // Keep the latest theme in a ref so the handshake listener always sends
  // current values without needing to re-bind the listener on every edit.
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const pushTheme = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'SYNC_THEME', theme: themeRef.current },
      '*'
    );
  };

  // Sync theme to iframe whenever it changes (live edits)
  useEffect(() => {
    pushTheme();
  }, [theme]);

  // The preview iframe announces when its React tree is mounted and listening.
  // Responding here guarantees the initial theme lands even if the iframe wasn't
  // ready when onLoad fired (avoids a lost first message).
  useEffect(() => {
    const handleReady = (event: MessageEvent) => {
      if (event.data?.type === 'THEME_STUDIO_READY') {
        pushTheme();
      }
    };
    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, []);

  // Force sync on iframe load
  const handleIframeLoad = () => {
    pushTheme();
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await saveSettings(theme);
    } finally {
      setIsSaving(false);
    }
  };

  const fontOptions = [
    'Space Grotesk, sans-serif',
    'Inter, sans-serif',
    'Archivo, sans-serif',
    'Orbitron, sans-serif',
    'Playfair Display, serif',
    'Roboto Mono, monospace'
  ];

  return (
    <div className="flex h-full w-full bg-slate-900 overflow-hidden">
      {/* Studio Sidebar (Controls) */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-800">Theme Studio</h2>
          <p className="text-xs text-slate-500">Live preview editor</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Presets */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(presets).map(preset => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-slate-700"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Typography</h3>
            
            {/* Font Family Selection */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500 block">Body Font Family</label>
              <select 
                value={theme.typography.fontFamily}
                onChange={(e) => updateTypography({ fontFamily: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 bg-white text-slate-850"
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font.split(',')[0]}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 block">Heading Font Family</label>
              <select 
                value={theme.typography.headingFont}
                onChange={(e) => updateTypography({ headingFont: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 bg-white text-slate-850"
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font.split(',')[0]}</option>
                ))}
              </select>
            </div>

            {/* Font Sizes */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Body Size</label>
                <div className="flex items-center border border-slate-200 rounded px-2 py-1">
                  <input 
                    type="number"
                    value={parseInt(theme.typography.bodySize) || 16}
                    onChange={(e) => updateTypography({ bodySize: `${e.target.value}px` })}
                    className="w-full text-sm border-0 p-0 focus:ring-0 text-slate-850"
                  />
                  <span className="text-xs text-slate-450 ml-1">px</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Heading Size</label>
                <div className="flex items-center border border-slate-200 rounded px-2 py-1">
                  <input 
                    type="number"
                    value={parseInt(theme.typography.headingSize) || 48}
                    onChange={(e) => updateTypography({ headingSize: `${e.target.value}px` })}
                    className="w-full text-sm border-0 p-0 focus:ring-0 text-slate-850"
                  />
                  <span className="text-xs text-slate-450 ml-1">px</span>
                </div>
              </div>
            </div>

            {/* Font Weights */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Body Weight</label>
                <select 
                  value={theme.typography.bodyWeight}
                  onChange={(e) => updateTypography({ bodyWeight: e.target.value })}
                  className="w-full text-sm border border-slate-200 rounded px-2 py-1 bg-white text-slate-850"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Heading Weight</label>
                <select 
                  value={theme.typography.headingWeight}
                  onChange={(e) => updateTypography({ headingWeight: e.target.value })}
                  className="w-full text-sm border border-slate-200 rounded px-2 py-1 bg-white text-slate-850"
                >
                  <option value="400">Regular (450)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Colors</h3>
            <div className="space-y-2">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-slate-600 capitalize">{key}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 uppercase w-16">{value}</span>
                    <input 
                      type="color" 
                      value={value}
                      onChange={(e) => updateColors({ [key]: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <button 
            onClick={handlePublish}
            disabled={isSaving}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
          >
            {isSaving ? 'Publishing...' : 'Publish Theme'}
          </button>
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div className="flex-1 bg-slate-950 p-4 lg:p-8 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-[1280px] bg-white rounded-xl shadow-2xl overflow-hidden relative ring-1 ring-white/10 flex flex-col">
          {/* Browser Bar Mockup */}
          <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto h-6 w-1/2 bg-white rounded-md border border-slate-200 shadow-sm flex items-center px-3 text-[10px] text-slate-400 justify-center">
              Live Preview
            </div>
          </div>
          <iframe
            ref={iframeRef}
            src="/?preview=1"
            onLoad={handleIframeLoad}
            className="w-full h-full border-0 bg-white"
            title="Theme Preview"
          />
        </div>
      </div>
    </div>
  );
}
