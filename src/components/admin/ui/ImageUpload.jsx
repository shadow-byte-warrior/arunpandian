import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ url, onUpload, folder = 'uploads', label = 'Image' }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Only images are allowed');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
      onUpload(data.publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700">{label}</label>
      
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
          <img 
            src={url} 
            alt="Uploaded preview" 
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onUpload('')}
              className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
            )}
            <p className="mb-2 text-sm text-slate-500 font-medium">
              {uploading ? 'Uploading...' : 'Click to upload'}
            </p>
            <p className="text-xs text-slate-400">PNG, JPG, WEBP (MAX. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
