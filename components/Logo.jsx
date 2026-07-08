import React from 'react';
import logoImg from '../assets/logo.jpg';

export default function Logo({ size = 30, className = '', title }) {
  return (
    <img
      src={logoImg}
      alt={title || "Arun Pandian Logo"}
      style={{ width: size, height: size }}
      className={`object-contain rounded-md invert brightness-125 contrast-125 ${className}`}
    />
  );
}
