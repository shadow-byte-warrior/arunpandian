import React, { useState } from 'react';
import { useEditorStore } from '../../../editor/editorStore';
import { Type, LayoutGrid, Paintbrush, MousePointerClick, FileText, Sparkles, RotateCcw } from 'lucide-react';
import { FONTS, FONT_CATEGORIES } from '../../../editor/fonts';

type Tab = 'content' | 'type' | 'layout' | 'style' | 'effects';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'type', label: 'Type', icon: Type },
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'style', label: 'Style', icon: Paintbrush },
  { id: 'effects', label: 'Effects', icon: MousePointerClick },
];

function rgbToHex(input: string): string {
  if (!input) return '#000000';
  if (input.startsWith('#')) return input;
  const m = input.match(/rgba?\(([^)]+)\)/);
  if (!m) return '#000000';
  const [r, g, b] = m[1].split(',').map((n) => parseInt(n.trim(), 10));
  const hex = (n: number) => Math.max(0, Math.min(255, n || 0)).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function numStr(v: string): string {
  const n = parseFloat(v);
  return Number.isFinite(n) ? String(Math.round(n)) : '';
}

function getContentAt(content: any, path: string) {
  return path.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), content);
}

// ── Module-scope control rows (stable identity → inputs keep focus) ──
const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 py-1.5">
    <label className="w-24 shrink-0 text-xs text-slate-500">{label}</label>
    <div className="flex flex-1 items-center justify-end gap-2">{children}</div>
  </div>
);

const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-slate-100 px-4 py-3">
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{title}</div>
    {children}
  </div>
);

const NumRow: React.FC<{ label: string; value: string; unit?: string; onSet: (v: string | null) => void }> = ({ label, value, unit = 'px', onSet }) => (
  <Row label={label}>
    <input
      type="number"
      value={value}
      onChange={(e) => onSet(e.target.value === '' ? null : `${e.target.value}${unit}`)}
      className="w-20 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500"
    />
    <span className="w-5 text-[10px] text-slate-400">{unit}</span>
  </Row>
);

const ColorRow: React.FC<{ label: string; value: string; onSet: (v: string | null) => void }> = ({ label, value, onSet }) => (
  <Row label={label}>
    <input
      type="text"
      value={value}
      onChange={(e) => onSet(e.target.value || null)}
      className="w-24 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-blue-500"
    />
    <input
      type="color"
      value={rgbToHex(value)}
      onChange={(e) => onSet(e.target.value)}
      className="h-7 w-7 shrink-0 cursor-pointer rounded border border-slate-200 p-0"
    />
  </Row>
);

const FontRow: React.FC<{ value: string; onSet: (v: string | null) => void }> = ({ value, onSet }) => (
  <Row label="Family">
    <select
      value={value}
      onChange={(e) => onSet(e.target.value || null)}
      className="w-40 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500"
    >
      <option value="">Default</option>
      {FONT_CATEGORIES.map((cat) => (
        <optgroup key={cat} label={cat}>
          {FONTS.filter((f) => f.cat === cat).map((f) => (
            <option key={f.name} value={f.stack}>{f.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  </Row>
);

const SelectRow: React.FC<{ label: string; value: string; options: string[]; onSet: (v: string | null) => void }> = ({ label, value, options, onSet }) => (
  <Row label={label}>
    <select
      value={value}
      onChange={(e) => onSet(e.target.value || null)}
      className="w-32 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 outline-none focus:border-blue-500"
    >
      <option value="">—</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </Row>
);

export default function Inspector() {
  const selected = useEditorStore((s) => s.selected);
  const overrides = useEditorStore((s) => s.overrides);
  const content = useEditorStore((s) => s.content);
  const setStyle = useEditorStore((s) => s.setStyle);
  const setContent = useEditorStore((s) => s.setContent);
  const clearElementStyles = useEditorStore((s) => s.clearElementStyles);
  const [tab, setTab] = useState<Tab>('content');

  if (!selected) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm text-slate-400">
        <Sparkles size={22} className="mb-2 text-slate-300" />
        Select an element on the canvas to edit it.
      </div>
    );
  }

  const id = selected.id;
  const raw = (prop: string) => overrides[id]?.[prop] ?? selected.computed[prop] ?? '';
  const set = (prop: string) => (v: string | null) => setStyle(id, prop, v);

  const contentValue =
    (selected.path ? getContentAt(content, selected.path) : undefined) ?? selected.text ?? '';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-800">{selected.name}</div>
            <div className="truncate text-[11px] text-slate-400">
              {selected.kind}{selected.path ? ` · ${selected.path}` : ''}
            </div>
          </div>
          <button
            onClick={() => clearElementStyles(id)}
            title="Reset this element's style overrides"
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-slate-200">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                tab === t.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'content' && (
          <Group title="Content">
            {selected.path ? (
              selected.kind === 'image' ? (
                <input
                  type="text"
                  placeholder="Image URL"
                  value={String(contentValue)}
                  onChange={(e) => setContent(selected.path!, e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-blue-500"
                />
              ) : (
                <textarea
                  rows={4}
                  value={String(contentValue)}
                  onChange={(e) => setContent(selected.path!, e.target.value)}
                  className="w-full resize-y rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-blue-500"
                />
              )
            ) : (
              <p className="text-xs text-slate-400">
                No directly editable text. Double-click text on the canvas to edit it inline.
              </p>
            )}
          </Group>
        )}

        {tab === 'type' && (
          <>
            <Group title="Font">
              <FontRow value={raw('font-family')} onSet={set('font-family')} />
              <NumRow label="Size" value={numStr(raw('font-size'))} onSet={set('font-size')} />
              <SelectRow label="Weight" value={raw('font-weight')} onSet={set('font-weight')} options={['300', '400', '500', '600', '700', '800', '900']} />
            </Group>
            <Group title="Spacing">
              <NumRow label="Letter" value={numStr(raw('letter-spacing'))} onSet={set('letter-spacing')} />
              <NumRow label="Line height" value={numStr(raw('line-height'))} onSet={set('line-height')} />
            </Group>
            <Group title="Alignment">
              <SelectRow label="Align" value={raw('text-align')} onSet={set('text-align')} options={['left', 'center', 'right', 'justify']} />
              <SelectRow label="Transform" value={raw('text-transform')} onSet={set('text-transform')} options={['none', 'uppercase', 'lowercase', 'capitalize']} />
              <ColorRow label="Color" value={raw('color')} onSet={set('color')} />
            </Group>
          </>
        )}

        {tab === 'layout' && (
          <>
            <Group title="Size">
              <NumRow label="Width" value={numStr(raw('width'))} onSet={set('width')} />
              <NumRow label="Height" value={numStr(raw('height'))} onSet={set('height')} />
            </Group>
            <Group title="Padding">
              <NumRow label="Top" value={numStr(raw('padding-top'))} onSet={set('padding-top')} />
              <NumRow label="Right" value={numStr(raw('padding-right'))} onSet={set('padding-right')} />
              <NumRow label="Bottom" value={numStr(raw('padding-bottom'))} onSet={set('padding-bottom')} />
              <NumRow label="Left" value={numStr(raw('padding-left'))} onSet={set('padding-left')} />
            </Group>
            <Group title="Margin">
              <NumRow label="Top" value={numStr(raw('margin-top'))} onSet={set('margin-top')} />
              <NumRow label="Right" value={numStr(raw('margin-right'))} onSet={set('margin-right')} />
              <NumRow label="Bottom" value={numStr(raw('margin-bottom'))} onSet={set('margin-bottom')} />
              <NumRow label="Left" value={numStr(raw('margin-left'))} onSet={set('margin-left')} />
            </Group>
            <Group title="Display">
              <SelectRow label="Display" value={raw('display')} onSet={set('display')} options={['block', 'flex', 'inline-flex', 'grid', 'inline-block', 'none']} />
            </Group>
          </>
        )}

        {tab === 'style' && (
          <>
            <Group title="Background">
              <ColorRow label="Background" value={raw('background-color')} onSet={set('background-color')} />
            </Group>
            <Group title="Border">
              <NumRow label="Width" value={numStr(raw('border-top-width'))} onSet={set('border-width')} />
              <ColorRow label="Color" value={raw('border-color')} onSet={set('border-color')} />
              <NumRow label="Radius" value={numStr(raw('border-radius'))} onSet={set('border-radius')} />
            </Group>
            <Group title="Effects">
              <NumRow label="Opacity" value={raw('opacity')} unit="" onSet={set('opacity')} />
              <SelectRow label="Shadow" value={raw('box-shadow')} onSet={set('box-shadow')} options={['none', '0 1px 2px rgba(0,0,0,0.05)', '0 4px 6px rgba(0,0,0,0.1)', '0 10px 15px rgba(0,0,0,0.1)', '0 20px 40px rgba(0,0,0,0.15)']} />
            </Group>
          </>
        )}

        {tab === 'effects' && (
          <Group title="Interaction states">
            <p className="text-xs leading-relaxed text-slate-400">
              Hover / active / focus styling and scroll + hover animations are on the roadmap.
              Base styles set here apply to the default state.
            </p>
          </Group>
        )}
      </div>
    </div>
  );
}
