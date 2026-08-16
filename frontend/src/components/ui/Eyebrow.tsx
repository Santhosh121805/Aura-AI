import React from 'react';

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs font-semibold tracking-[0.18em] uppercase text-[#31E6A1] ${className}`}>
    {children}
  </p>
);
