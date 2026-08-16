import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'text';
}

const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'rounded-full bg-[#31E6A1] text-[#0B0D0C] px-6 py-3 text-sm hover:bg-[#31E6A1]/90 active:scale-[0.98]',
  ghost: 'rounded-full border border-[#F3F1EA]/20 text-[#F3F1EA] px-6 py-3 text-sm hover:border-[#F3F1EA]/40 hover:bg-[#F3F1EA]/5',
  text: 'text-[#F3F1EA] text-sm underline-offset-4 hover:underline hover:text-[#31E6A1] px-0 py-0',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => (
  <button className={`${base} ${variants[variant]} ${className}`} {...props}>
    {children}
  </button>
);
