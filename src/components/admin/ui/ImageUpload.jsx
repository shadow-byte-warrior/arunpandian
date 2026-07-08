import React, { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Upload, X, Loader2, Link as LinkIcon, FileVideo } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ url, onUpload, folder = 'uploads', label = 'Image', accept = 'image/*' }) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrl, setManualUrl] = useState(url || '');
  const fileInputRef = useRef(null);

  const isVideo = url?.match(/\.(mp4|webm|ogg)$/i) || accept.includes('video');

  const handleFileProcess = async (file) => {
    if (!file) return;

    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      toast.error('Only images are allowed');
      return;
    }
    if (accept.includes('video') && !file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      toast.error('Only media files are allowed');
      return;
    }

    try {
      setUploading(true);
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
      setManualUrl(data.publicUrl);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading file: ' + error.message);
      console.error(error);
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  const handleFileChange = (event) => {
    handleFileProcess(event.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onUpload(manualUrl.trim());
      toast.success('Media URL set!');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-slate-700">{label}</label>
      
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
          {isVideo ? (
            <video 
              src={url} 
              autoPlay muted loop playsInline
              className="w-full h-40 object-cover"
            />
          ) : (
            <img 
              src={url} 
              alt="Uploaded preview" 
              className="w-full h-40 object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                onUpload('');
                setManualUrl('');
              }}
              className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
              title="Remove media"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label 
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
              ) : accept.includes('video') ? (
                <FileVideo className={`w-8 h-8 mb-2 ${isDragging ? 'text-teal-500' : 'text-slate-400'}`} />
              ) : (
                <Upload className={`w-8 h-8 mb-2 ${isDragging ? 'text-teal-500' : 'text-slate-400'}`} />
              )}
              <p className="mb-2 text-sm text-slate-500 font-medium text-center px-4">
                {uploading ? 'Uploading...' : isDragging ? 'Drop file here' : 'Click or drag to upload'}
              </p>
              <p className="text-[10px] text-slate-400 text-center px-2">
                {accept.includes('video') ? 'MP4, WEBM, PNG, JPG (MAX. 50MB)' : 'PNG, JPG, WEBP (MAX. 5MB)'}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept={accept} 
              onChange={handleFileChange} 
              disabled={uploading}
              ref={fileInputRef}
            />
          </label>

          <div className="relative flex items-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center w-full">
              <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase">Or provide URL</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon size={16} />
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit(e);
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-shadow"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!manualUrl.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
