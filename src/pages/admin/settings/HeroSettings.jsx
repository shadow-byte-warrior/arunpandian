import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, GripVertical, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import { TextField, TextArea, EyeToggle } from '../../../components/admin/ui/FormInputs';
import SaveActionPanel from '../../../components/admin/ui/SaveActionPanel';
import SectionCard from '../../../components/admin/ui/SectionCard';
import { useSiteSettings } from '../../../components/admin/hooks/useSiteSettings';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const heroSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  badge: z.string().min(1, 'Badge is required'),
  headlineAccent: z.string().min(1, 'Accent is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  primaryCta: z.object({
    label: z.string().min(1, 'Label is required'),
    href: z.string().min(1, 'Link is required'),
  }),
  secondaryCta: z.object({
    label: z.string().min(1, 'Label is required'),
    href: z.string().min(1, 'Link is required'),
  }),
  videoSrc: z.string().min(1, 'Video source is required'),
  videoCaption: z.string().min(1, 'Caption is required'),
  videoSubCaption: z.string().min(1, 'Sub-caption is required'),
  story: z.array(z.object({
    k: z.string().min(1, 'Letter is required'),
    label: z.string().min(1, 'Label is required')
  })),
  credentials: z.array(z.object({
    value: z.string().min(1, 'Value is required'),
    label: z.string().min(1, 'Label is required')
  })),
  // Per-element public visibility: true = hidden from visitors
  hidden: z.object({
    badge: z.boolean(),
    subtitle: z.boolean(),
    headlineAccent: z.boolean(),
    name: z.boolean(),
    role: z.boolean(),
    primaryCta: z.boolean(),
    secondaryCta: z.boolean(),
    videoCaption: z.boolean(),
    videoSubCaption: z.boolean(),
    story: z.boolean(),
    credentials: z.boolean(),
  }).partial().optional(),
});

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div {...attributes} {...listeners} className="mt-3 cursor-grab text-slate-400 hover:text-slate-700">
        <GripVertical size={20} />
      </div>
      <div className="flex-1">
        {props.children}
      </div>
    </div>
  );
}

export default function HeroSettings() {
  const { fetchSettings, saveSettings, loading: initLoading } = useSiteSettings('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_video_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      form.setValue('videoSrc', publicUrl, { shouldDirty: true });
      toast.success('Video uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: '', role: '', badge: '', headlineAccent: '', subtitle: '',
      primaryCta: { label: '', href: '' }, secondaryCta: { label: '', href: '' },
      videoSrc: '', videoCaption: '', videoSubCaption: '',
      story: [], credentials: [],
      hidden: {}
    }
  });

  // Eye-toggle wiring: flips hidden.<key>, marks the form dirty so Save picks it up
  const eyeProps = (key) => ({
    siteVisible: !form.watch(`hidden.${key}`),
    onToggleVisible: () =>
      form.setValue(`hidden.${key}`, !form.getValues(`hidden.${key}`), { shouldDirty: true }),
  });

  const { fields: storyFields, append: appendStory, remove: removeStory, move: moveStory } = useFieldArray({
    control: form.control,
    name: "story"
  });

  const { fields: credFields, append: appendCred, remove: removeCred, move: moveCred } = useFieldArray({
    control: form.control,
    name: "credentials"
  });

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) {
        setInitialData(data);
        form.reset(data);
      }
    });
  }, []);

  const onSubmit = async (values) => {
    setIsSaving(true);
    // Keep headline array as is from initialData for now since it's just strings
    const finalData = { ...initialData, ...values };
    const success = await saveSettings(finalData);
    if (success) {
      form.reset(finalData);
    }
    setIsSaving(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event, type) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const items = type === 'story' ? storyFields : credFields;
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (type === 'story') moveStory(oldIndex, newIndex);
      else moveCred(oldIndex, newIndex);
    }
  };

  if (initLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={24} /></div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-8 pb-32">
      <div>
        <h1 className="font-bold text-2xl text-slate-800">Hero Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Configure the main landing section of your portfolio.</p>
      </div>

      <SectionCard title="General Information" description="Use the eye on each field to show or hide that element on the live site.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Name" {...eyeProps('name')} {...form.register('name')} error={form.formState.errors.name?.message} />
          <TextField label="Role" {...eyeProps('role')} {...form.register('role')} error={form.formState.errors.role?.message} />
          <TextField label="Badge Text" className="md:col-span-2" {...eyeProps('badge')} {...form.register('badge')} error={form.formState.errors.badge?.message} />
          <TextArea label="Subtitle" rows={3} className="md:col-span-2" {...eyeProps('subtitle')} {...form.register('subtitle')} error={form.formState.errors.subtitle?.message} />
          <TextField label="Headline Accent Word" {...eyeProps('headlineAccent')} {...form.register('headlineAccent')} error={form.formState.errors.headlineAccent?.message} />
        </div>
      </SectionCard>

      <SectionCard title="Call to Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm text-slate-700">Primary CTA</h3>
              <EyeToggle visible={!form.watch('hidden.primaryCta')} onToggle={eyeProps('primaryCta').onToggleVisible} label="Primary CTA" />
            </div>
            <TextField label="Label" {...form.register('primaryCta.label')} error={form.formState.errors.primaryCta?.label?.message} />
            <TextField label="URL / Link" {...form.register('primaryCta.href')} error={form.formState.errors.primaryCta?.href?.message} />
          </div>
          <div className="space-y-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm text-slate-700">Secondary CTA</h3>
              <EyeToggle visible={!form.watch('hidden.secondaryCta')} onToggle={eyeProps('secondaryCta').onToggleVisible} label="Secondary CTA" />
            </div>
            <TextField label="Label" {...form.register('secondaryCta.label')} error={form.formState.errors.secondaryCta?.label?.message} />
            <TextField label="URL / Link" {...form.register('secondaryCta.href')} error={form.formState.errors.secondaryCta?.href?.message} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Hero Media (Video)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2.5">
            <TextField label="Video URL" {...form.register('videoSrc')} error={form.formState.errors.videoSrc?.message} />
            <div className="flex items-center gap-4">
              <label className={`flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Upload Video File
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-500 font-medium">Supports .mp4, .webm, etc. Max 50MB. Uploads to Supabase.</span>
            </div>
          </div>
          <TextField label="Video Caption" {...eyeProps('videoCaption')} {...form.register('videoCaption')} error={form.formState.errors.videoCaption?.message} />
          <TextField label="Video Sub-caption" {...eyeProps('videoSubCaption')} {...form.register('videoSubCaption')} error={form.formState.errors.videoSubCaption?.message} />
        </div>
      </SectionCard>

      <SectionCard title="Hero Story Cards" action={<>
          <EyeToggle visible={!form.watch('hidden.story')} onToggle={eyeProps('story').onToggleVisible} label="story strip" />
          <button type="button" onClick={() => appendStory({ k: '', label: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Plus size={16} /> Add Card
          </button></>}>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'story')}>
          <SortableContext items={storyFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {storyFields.map((field, index) => (
                <SortableItem key={field.id} id={field.id}>
                  <div className="flex gap-4 items-start">
                    <TextField 
                      placeholder="Letter (e.g. S)" 
                      className="w-24" 
                      {...form.register(`story.${index}.k`)} 
                      error={form.formState.errors.story?.[index]?.k?.message} 
                    />
                    <TextField 
                      placeholder="Description" 
                      className="flex-1" 
                      {...form.register(`story.${index}.label`)} 
                      error={form.formState.errors.story?.[index]?.label?.message} 
                    />
                    <button type="button" onClick={() => removeStory(index)} className="mt-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </SortableItem>
              ))}
              {storyFields.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No story cards added.</p>}
            </div>
          </SortableContext>
        </DndContext>
      </SectionCard>

      <SectionCard title="Stats / Credentials" action={<>
          <EyeToggle visible={!form.watch('hidden.credentials')} onToggle={eyeProps('credentials').onToggleVisible} label="credentials strip" />
          <button type="button" onClick={() => appendCred({ value: '', label: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Plus size={16} /> Add Stat
          </button></>}>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'cred')}>
          <SortableContext items={credFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 gap-3">
              {credFields.map((field, index) => (
                <SortableItem key={field.id} id={field.id}>
                  <div className="flex gap-4 items-start">
                    <TextField 
                      placeholder="Value (e.g. 2026)" 
                      className="w-32" 
                      {...form.register(`credentials.${index}.value`)} 
                      error={form.formState.errors.credentials?.[index]?.value?.message} 
                    />
                    <TextField 
                      placeholder="Label" 
                      className="flex-1" 
                      {...form.register(`credentials.${index}.label`)} 
                      error={form.formState.errors.credentials?.[index]?.label?.message} 
                    />
                    <button type="button" onClick={() => removeCred(index)} className="mt-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </SortableItem>
              ))}
              {credFields.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No stats added.</p>}
            </div>
          </SortableContext>
        </DndContext>
      </SectionCard>

      <SaveActionPanel 
        isDirty={form.formState.isDirty} 
        isSaving={isSaving} 
        onDiscard={() => form.reset()} 
        onSave={form.handleSubmit(onSubmit)} 
      />
    </form>
  );
}
