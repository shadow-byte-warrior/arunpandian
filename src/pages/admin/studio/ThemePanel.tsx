import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { useThemeStore } from '../../../theme/store';
import { presets, SITE_FONTS, EFFECT_STYLES, CURSOR_STYLES, type ThemeState } from '../../../theme/presets';

const COLOR_FIELDS: { key: Extract<keyof ThemeState['colors'], string>; label: string }[] = [
  { key: 'primary', label: 'Accent' },
  { key: 'background', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
  { key: 'muted', label: 'Muted' },
  { key: 'border', label: 'Border' },
];

const FontSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full text-[11px] border border-[#2a2a2a] rounded px-2 py-1.5 bg-[#1a1a1a] text-slate-200 focus:outline-none focus:border-blue-500">
    {!SITE_FONTS.some((g) => g.fonts.some((f) => f.stack === value)) && value && (
      <option value={value}>{value.split(',')[0]}</option>
    )}
    {SITE_FONTS.map((group) => (
      <optgroup key={group.site} label={group.site} className="text-slate-400">
        {group.fonts.map((f) => (
          <option key={`${group.site}-${f.name}`} value={f.stack}>{f.name} · {f.role}</option>
        ))}
      </optgroup>
    ))}
  </select>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{children}</label>
);

const SectionHeader = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-2 pt-4 pb-2 border-t border-[#1f1f1f] first:border-0 first:pt-0">
    {Icon && <Icon size={11} className="text-slate-500" />}
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{children}</span>
  </div>
);

export default function ThemePanel() {
  const { theme, updateColors, updateTypography, updateLayout, applyPreset } = useThemeStore();

  return (
    <div className="space-y-1 text-sm">
      {/* Quick Presets */}
      <SectionHeader icon={Palette}>Color Presets</SectionHeader>
      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(presets).map(([name, preset]) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            title={name}
            className="group relative flex items-center gap-2 px-2.5 py-2 rounded-lg border border-[#2a2a2a] hover:border-blue-500/60 hover:bg-[#1f1f1f] transition-all text-left"
          >
            <div className="flex gap-0.5 shrink-0">
              <span className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ background: preset.colors.background }} />
              <span className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ background: preset.colors.primary }} />
              <span className="h-3.5 w-3.5 rounded-full border border-black/20" style={{ background: preset.colors.text }} />
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-slate-200 truncate leading-tight">{name.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      {/* Colors */}
      <SectionHeader>Colors</SectionHeader>
      <div className="grid grid-cols-2 gap-2">
        {COLOR_FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-[#2a2a2a] bg-[#1a1a1a]">
              <input
                type="color"
                value={(theme.colors as any)[key] || '#000000'}
                onChange={(e) => updateColors({ [key]: e.target.value } as any)}
                className="h-4 w-4 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-[10px] font-mono text-slate-400">{(theme.colors as any)[key]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Typography */}
      <SectionHeader>Typography</SectionHeader>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label>Heading Font</Label>
          <FontSelect value={theme.typography.headingFont} onChange={(v) => updateTypography({ headingFont: v })} />
        </div>
        <div className="space-y-1">
          <Label>Body Font</Label>
          <FontSelect value={theme.typography.fontFamily} onChange={(v) => updateTypography({ fontFamily: v })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>Body Weight</Label>
            <select value={theme.typography.bodyWeight} onChange={(e) => updateTypography({ bodyWeight: e.target.value })}
              className="w-full text-[11px] border border-[#2a2a2a] rounded px-2 py-1.5 bg-[#1a1a1a] text-slate-200">
              {['300','400','500','600','700'].map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Heading Weight</Label>
            <select value={theme.typography.headingWeight} onChange={(e) => updateTypography({ headingWeight: e.target.value })}
              className="w-full text-[11px] border border-[#2a2a2a] rounded px-2 py-1.5 bg-[#1a1a1a] text-slate-200">
              {['400','500','600','700','800','900'].map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Effects */}
      <SectionHeader>Effects</SectionHeader>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label>Animation Package</Label>
          <select value={theme.layout?.animationStyle || 'default'} onChange={(e) => updateLayout({ animationStyle: e.target.value as any })}
            className="w-full text-[11px] border border-[#2a2a2a] rounded px-2 py-1.5 bg-[#1a1a1a] text-slate-200">
            {EFFECT_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Custom Cursor</Label>
          <select value={theme.layout?.cursorStyle || 'default'} onChange={(e) => updateLayout({ cursorStyle: e.target.value as any })}
            className="w-full text-[11px] border border-[#2a2a2a] rounded px-2 py-1.5 bg-[#1a1a1a] text-slate-200">
            {CURSOR_STYLES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Corner Radius</Label>
          <input type="text" value={theme.layout?.radius || '1rem'} onChange={(e) => updateLayout({ radius: e.target.value })}
            className="w-full text-[11px] border border-[#2a2a2a] rounded px-2 py-1.5 bg-[#1a1a1a] text-slate-200 focus:outline-none focus:border-blue-500" />
        </div>
      </div>
    </div>
  );
}
