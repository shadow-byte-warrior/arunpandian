import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, RotateCcw, ChevronDown, Check, Pipette, Type, Sliders } from 'lucide-react';
import { useThemeStore } from '../../../theme/store';
import { presets, SITE_FONTS, EFFECT_STYLES, CURSOR_STYLES, type ThemeState } from '../../../theme/presets';

// ── Helpers ──────────────────────────────────────────────────────────────────

function isValidHex(hex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function contrastColor(hex: string): string {
  if (!isValidHex(hex)) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#000000' : '#ffffff';
}

// ── Color token fields ────────────────────────────────────────────────────────

const COLOR_FIELDS: { key: Extract<keyof ThemeState['colors'], string>; label: string; hint: string }[] = [
  { key: 'primary',    label: 'Accent',     hint: 'CTA buttons, links, highlights' },
  { key: 'background', label: 'Background', hint: 'Page background' },
  { key: 'surface',    label: 'Surface',    hint: 'Cards, panels, inputs' },
  { key: 'text',       label: 'Text',       hint: 'Body text color' },
  { key: 'muted',      label: 'Muted',      hint: 'Secondary / placeholder text' },
  { key: 'border',     label: 'Border',     hint: 'Dividers, outlines' },
];

// ── Editable color row ────────────────────────────────────────────────────────

interface ColorRowProps {
  label: string;
  hint: string;
  value: string;
  onChange: (hex: string) => void;
}

function ColorRow({ label, hint, value, onChange }: ColorRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  // Keep draft in sync when value changes externally (preset switch)
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const commitDraft = () => {
    const normalized = draft.startsWith('#') ? draft : `#${draft}`;
    if (isValidHex(normalized)) {
      onChange(normalized);
      setDraft(normalized);
    } else {
      setDraft(value); // revert
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitDraft();
    if (e.key === 'Escape') { setDraft(value); setEditing(false); }
  };

  return (
    <div className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
      {/* Color swatch + native color picker trigger */}
      <button
        onClick={() => colorRef.current?.click()}
        className="relative h-7 w-7 shrink-0 rounded-md border border-white/10 shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        style={{ background: isValidHex(value) ? value : '#888' }}
        title={`Pick ${label}`}
      >
        <input
          ref={colorRef}
          type="color"
          value={isValidHex(value) ? value : '#888888'}
          onChange={(e) => { onChange(e.target.value); setDraft(e.target.value); }}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          tabIndex={-1}
        />
      </button>

      {/* Label + hex input */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 leading-none mb-0.5">{label}</div>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={handleKeyDown}
            className="w-full text-[11px] font-mono text-slate-200 bg-[#111] border border-blue-500 rounded px-1 py-0.5 outline-none"
            autoFocus
          />
        ) : (
          <button
            onClick={() => { setEditing(true); setDraft(value); }}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors text-left"
            title={hint}
          >
            {isValidHex(value) ? value.toUpperCase() : value}
          </button>
        )}
      </div>

      {/* Mini preview chip showing how accent looks on bg */}
      <div
        className="shrink-0 h-5 w-5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: value }}
        title={hint}
      />
    </div>
  );
}

// ── Mini BG preview bar ───────────────────────────────────────────────────────

function BgPreview({ colors }: { colors: ThemeState['colors'] }) {
  const bg = colors.background || '#fff';
  const surface = colors.surface || '#f0f0f0';
  const text = colors.text || '#000';
  const primary = colors.primary || '#2563eb';
  const muted = colors.muted || '#888';
  const border = colors.border || '#e4e4e7';

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)] mb-3"
      style={{ background: bg }}
    >
      {/* Simulated navbar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: surface, borderBottom: `1px solid ${border}` }}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: primary }} />
          <div className="h-1.5 w-12 rounded-full" style={{ background: muted, opacity: 0.4 }} />
        </div>
        <div
          className="px-2.5 py-0.5 rounded-full text-[8px] font-bold"
          style={{
            background: primary,
            color: contrastColor(primary),
            fontSize: '7px',
          }}
        >
          CTA
        </div>
      </div>

      {/* Simulated hero content */}
      <div className="px-4 py-3 space-y-1.5">
        <div className="h-2 w-3/4 rounded-full" style={{ background: text, opacity: 0.85 }} />
        <div className="h-1.5 w-1/2 rounded-full" style={{ background: muted, opacity: 0.5 }} />
        <div className="h-1.5 w-2/3 rounded-full" style={{ background: muted, opacity: 0.35 }} />
        <div className="flex gap-1.5 pt-1">
          <div
            className="h-5 w-12 rounded-md"
            style={{ background: primary }}
          />
          <div
            className="h-5 w-12 rounded-md border"
            style={{ borderColor: border, background: surface }}
          />
        </div>
      </div>

      {/* Simulated card strip */}
      <div
        className="flex gap-2 px-4 pb-3"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-lg p-2 space-y-1"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            <div className="h-1.5 rounded-full w-full" style={{ background: text, opacity: 0.6 }} />
            <div className="h-1 rounded-full w-3/4" style={{ background: muted, opacity: 0.4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Preset card ───────────────────────────────────────────────────────────────

function PresetCard({ name, preset, isActive, onApply }: {
  name: string;
  preset: ThemeState;
  isActive: boolean;
  onApply: () => void;
}) {
  const colors = [preset.colors.background, preset.colors.primary, preset.colors.text, preset.colors.surface];

  return (
    <button
      onClick={onApply}
      title={name}
      className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all text-left ${
        isActive
          ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
          : 'border-[#2a2a2a] hover:border-[#404040] hover:bg-white/[0.03]'
      }`}
    >
      {/* Color dots */}
      <div className="flex gap-0.5 shrink-0">
        {colors.map((c, i) => (
          <span
            key={i}
            className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-sm"
            style={{ background: c }}
          />
        ))}
      </div>

      <span className={`text-[10px] truncate leading-tight transition-colors ${
        isActive ? 'text-blue-300 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
      }`}>
        {name.split(' (')[0]}
      </span>

      {isActive && (
        <Check size={10} className="ml-auto shrink-0 text-blue-400" />
      )}
    </button>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionHeader({ children, icon: Icon, action }: {
  children: React.ReactNode;
  icon?: any;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-1.5 border-t border-white/[0.06] first:border-0 first:pt-0">
      {Icon && <Icon size={10} className="text-slate-600 shrink-0" />}
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex-1">{children}</span>
      {action}
    </div>
  );
}

// ── Font select ───────────────────────────────────────────────────────────────

function FontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
    >
      {!SITE_FONTS.some((g) => g.fonts.some((f) => f.stack === value)) && value && (
        <option value={value}>{value.split(',')[0]}</option>
      )}
      {SITE_FONTS.map((group) => (
        <optgroup key={group.site} label={group.site} className="text-slate-400">
          {group.fonts.map((f) => (
            <option key={`${group.site}-${f.name}`} value={f.stack}>
              {f.name} · {f.role}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

// ── Tab system ────────────────────────────────────────────────────────────────

type PanelTab = 'colors' | 'type' | 'effects';
const PANEL_TABS: { id: PanelTab; label: string; icon: any }[] = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'type',   label: 'Type',   icon: Type },
  { id: 'effects',label: 'Effects',icon: Sliders },
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function ThemePanel() {
  const { theme, updateColors, updateTypography, updateLayout, applyPreset } = useThemeStore();
  const [activeTab, setActiveTab] = useState<PanelTab>('colors');
  const [presetsOpen, setPresetsOpen] = useState(true);

  // Find which preset (if any) is currently active
  const activePreset = Object.entries(presets).find(([, p]) =>
    p.colors.primary === theme.colors.primary &&
    p.colors.background === theme.colors.background
  )?.[0] ?? null;

  const handleReset = useCallback(() => {
    applyPreset('Default');
  }, [applyPreset]);

  return (
    <div className="text-sm flex flex-col h-full">

      {/* ── Inner Tab bar ── */}
      <div className="flex gap-0.5 p-1.5 bg-[#111] rounded-xl mb-3 border border-[#1f1f1f]">
        {PANEL_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === id
                ? 'bg-[#1f1f1f] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>

      {/* ── COLORS TAB ── */}
      {activeTab === 'colors' && (
        <div className="space-y-0.5">

          {/* BG + color live preview */}
          <BgPreview colors={theme.colors} />

          {/* Preset toggle header */}
          <button
            onClick={() => setPresetsOpen((v) => !v)}
            className="flex items-center gap-2 w-full py-1.5 group"
          >
            <Palette size={10} className="text-slate-600" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex-1 text-left">Color Presets</span>
            <ChevronDown
              size={12}
              className={`text-slate-600 transition-transform duration-200 ${presetsOpen ? '' : '-rotate-90'}`}
            />
          </button>

          {presetsOpen && (
            <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-white/[0.06]">
              {Object.entries(presets).map(([name, preset]) => (
                <PresetCard
                  key={name}
                  name={name}
                  preset={preset}
                  isActive={activePreset === name}
                  onApply={() => applyPreset(name)}
                />
              ))}
            </div>
          )}

          {/* Color tokens */}
          <SectionHeader
            action={
              <button
                onClick={handleReset}
                title="Reset to Default"
                className="flex items-center gap-1 text-[9px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                <RotateCcw size={9} /> Reset
              </button>
            }
          >
            Colors
          </SectionHeader>

          <div className="space-y-0.5 bg-[#111] rounded-xl border border-[#1a1a1a] p-1.5">
            {COLOR_FIELDS.map(({ key, label, hint }) => (
              <ColorRow
                key={key}
                label={label}
                hint={hint}
                value={(theme.colors as any)[key] || '#000000'}
                onChange={(hex) => updateColors({ [key]: hex } as any)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── TYPE TAB ── */}
      {activeTab === 'type' && (
        <div className="space-y-3">
          {/* Heading font */}
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-3 space-y-2.5">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Heading Font</div>
            <FontSelect
              value={theme.typography.headingFont}
              onChange={(v) => updateTypography({ headingFont: v })}
            />
            <div
              className="text-2xl font-bold text-slate-100 leading-tight truncate"
              style={{ fontFamily: theme.typography.headingFont, fontWeight: theme.typography.headingWeight }}
            >
              Hello World
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Weight</div>
                <select
                  value={theme.typography.headingWeight}
                  onChange={(e) => updateTypography({ headingWeight: e.target.value })}
                  className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {['400','500','600','700','800','900'].map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Size</div>
                <input
                  type="text"
                  value={theme.typography.headingSize}
                  onChange={(e) => updateTypography({ headingSize: e.target.value })}
                  className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Body font */}
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-3 space-y-2.5">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Body Font</div>
            <FontSelect
              value={theme.typography.fontFamily}
              onChange={(v) => updateTypography({ fontFamily: v })}
            />
            <div
              className="text-sm text-slate-400 leading-relaxed"
              style={{ fontFamily: theme.typography.fontFamily, fontWeight: theme.typography.bodyWeight }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Weight</div>
                <select
                  value={theme.typography.bodyWeight}
                  onChange={(e) => updateTypography({ bodyWeight: e.target.value })}
                  className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {['300','400','500','600','700'].map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Size</div>
                <input
                  type="text"
                  value={theme.typography.bodySize}
                  onChange={(e) => updateTypography({ bodySize: e.target.value })}
                  className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EFFECTS TAB ── */}
      {activeTab === 'effects' && (
        <div className="space-y-3">

          {/* Animation */}
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-3 space-y-2">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Animation Package</div>
            <select
              value={theme.layout?.animationStyle || 'default'}
              onChange={(e) => updateLayout({ animationStyle: e.target.value as any })}
              className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {EFFECT_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Cursor */}
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-3 space-y-2">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Custom Cursor</div>
            <select
              value={theme.layout?.cursorStyle || 'default'}
              onChange={(e) => updateLayout({ cursorStyle: e.target.value as any })}
              className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {CURSOR_STYLES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Corner Radius + Border style */}
          <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-3 space-y-3">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Shape</div>

            {/* Radius presets */}
            <div className="space-y-1.5">
              <div className="text-[9px] text-slate-600 font-semibold uppercase">Corner Radius</div>
              <div className="flex gap-1.5 flex-wrap">
                {['0px', '4px', '8px', '1rem', '1.5rem', '2rem'].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateLayout({ radius: r })}
                    className={`px-2 py-1 text-[10px] rounded border transition-all ${
                      theme.layout?.radius === r
                        ? 'border-blue-500 text-blue-300 bg-blue-500/10'
                        : 'border-[#2a2a2a] text-slate-500 hover:border-[#404040] hover:text-slate-300'
                    }`}
                    style={{ borderRadius: r === '0px' ? '2px' : r }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={theme.layout?.radius || '1rem'}
                onChange={(e) => updateLayout({ radius: e.target.value })}
                className="w-full text-[11px] border border-[#2a2a2a] rounded-lg px-2 py-1.5 bg-[#151515] text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                placeholder="e.g. 1rem, 8px"
              />
            </div>

            {/* Scroll style */}
            <div className="space-y-1.5">
              <div className="text-[9px] text-slate-600 font-semibold uppercase">Projects Scroll</div>
              <div className="flex gap-1.5">
                {(['grid', 'horizontal', 'vertical', 'masonry', 'bento'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateLayout({ projectsScroll: s })}
                    className={`flex-1 py-1 text-[9px] rounded border capitalize transition-all ${
                      theme.layout?.projectsScroll === s
                        ? 'border-blue-500 text-blue-300 bg-blue-500/10'
                        : 'border-[#2a2a2a] text-slate-600 hover:text-slate-300 hover:border-[#404040]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
