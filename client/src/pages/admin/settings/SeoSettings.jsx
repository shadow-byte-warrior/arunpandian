import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { TextField, TextArea } from '../../../components/admin/ui/FormInputs';
import SaveActionPanel from '../../../components/admin/ui/SaveActionPanel';
import SectionCard from '../../../components/admin/ui/SectionCard';
import { useSiteSettings } from '../../../components/admin/hooks/useSiteSettings';

const seoSchema = z.object({
  metaTitle: z.string().min(1, 'Title is required'),
  metaDescription: z.string().min(1, 'Description is required'),
  keywords: z.string(),
  ogImage: z.string(),
  twitterHandle: z.string(),
});

export default function SeoSettings() {
  const { fetchSettings, saveSettings, loading: initLoading } = useSiteSettings('seo');
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
      twitterHandle: ''
    }
  });

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) {
        form.reset(data);
      }
    });
  }, []);

  const onSubmit = async (values) => {
    setIsSaving(true);
    const success = await saveSettings(values);
    if (success) {
      form.reset(values);
    }
    setIsSaving(false);
  };

  if (initLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={24} /></div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-8 pb-32">
      <div>
        <h1 className="font-bold text-2xl text-slate-800">SEO Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage how your portfolio appears on search engines and social media.</p>
      </div>

      <SectionCard title="Basic Meta Tags">
        <div className="space-y-6">
          <TextField 
            label="Meta Title" 
            placeholder="Arun Pandian - Data Analyst"
            {...form.register('metaTitle')} 
            error={form.formState.errors.metaTitle?.message} 
          />
          <TextArea 
            label="Meta Description" 
            rows={3}
            placeholder="A brief description of your portfolio and expertise..."
            {...form.register('metaDescription')} 
            error={form.formState.errors.metaDescription?.message} 
          />
          <TextField 
            label="Keywords (Comma separated)" 
            placeholder="Data Analyst, SQL, Python, Portfolio"
            {...form.register('keywords')} 
            error={form.formState.errors.keywords?.message} 
          />
        </div>
      </SectionCard>

      <SectionCard title="Social Graph & Open Graph">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField 
            label="Open Graph Image URL (og:image)" 
            className="md:col-span-2"
            placeholder="https://yourdomain.com/og-image.jpg"
            {...form.register('ogImage')} 
            error={form.formState.errors.ogImage?.message} 
          />
          <TextField 
            label="Twitter Handle" 
            placeholder="@arunpandian"
            {...form.register('twitterHandle')} 
            error={form.formState.errors.twitterHandle?.message} 
          />
        </div>
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
