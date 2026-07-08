import React from 'react';
import { useContent } from '../context/ContentProvider';
import logoImg from '../assets/logo.jpg';

export default function Logo({ size = 30, className = '', title }) {
  const { settings } = useContent();
  const dynamicLogo = settings?.branding?.logoUrl;

  return (
    <img
      src={dynamicLogo || logoImg}
      alt={title || "Arun Pandian Logo"}
      style={{ width: size, height: size }}
      className={`object-contain rounded-md ${!dynamicLogo ? 'invert brightness-125 contrast-125' : ''} ${className}`}
    />
  );
}
