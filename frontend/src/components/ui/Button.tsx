import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant.
   * - 'neural': Default style.
   * - 'growth': Gradient style for emphasis.
   * - 'outline': Outlined button.
   * - 'ghost': Minimal, no background.
   */
  variant?: 'neural' | 'growth' | 'outline' | 'ghost';
  /**
   * Button size.
   * - 'sm': Small
   * - 'md': Medium (default)
   * - 'lg': Large
   */
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'neural',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neural-500/20';
  
  const variantClasses = {
    neural: 'btn-neural text-white',
    growth: 'bg-growth-gradient text-white hover:shadow-lg hover:shadow-growth-500/25 hover:scale-105',
    outline: 'border-2 border-neural-500 text-neural-500 hover:bg-neural-500 hover:text-white',
    ghost: 'text-neural-500 hover:bg-neural-50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};