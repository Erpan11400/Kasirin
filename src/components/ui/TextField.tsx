import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
export type TextFieldSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  secondaryLabel?: React.ReactNode;
  icon?: React.ReactNode | React.ElementType;
  leftIcon?: React.ReactNode | React.ElementType;
  rightElement?: React.ReactNode;
  rightIcon?: React.ReactNode | React.ElementType;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  inputSize?: TextFieldSize;
}

const sizeStyles: Record<TextFieldSize, { input: string; icon: string }> = {
  sm: {
    input: 'py-1.5 text-xs rounded-lg',
    icon: 'w-4 h-4',
  },
  md: {
    input: 'py-2.5 text-sm rounded-xl',
    icon: 'w-[18px] h-[18px]',
  },
  lg: {
    input: 'py-3.5 text-base rounded-xl',
    icon: 'w-5 h-5',
  },
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      secondaryLabel,
      icon,
      leftIcon,
      rightElement,
      rightIcon,
      error,
      helperText,
      type = 'text',
      inputSize = 'md',
      required,
      disabled,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    // Menghubungkan left icon (bisa via prop `leftIcon` atau `icon`)
    const resolvedLeftIcon = leftIcon || icon;
    // Menghubungkan right icon (bisa via prop `rightElement` atau `rightIcon`)
    const resolvedRightElement = rightElement || rightIcon;

    // Helper untuk render icon yang bisa berupa komponen React (LucideIcon) atau JSX element
    const renderIcon = (
      iconElement?: React.ReactNode | React.ElementType,
      defaultClassName?: string
    ) => {
      if (!iconElement) return null;
      if (React.isValidElement(iconElement)) return iconElement;
      if (typeof iconElement === 'function' || typeof iconElement === 'object') {
        const IconComponent = iconElement as React.ElementType;
        return <IconComponent className={defaultClassName} size={18} />;
      }
      return iconElement;
    };

    const hasLeft = Boolean(resolvedLeftIcon);
    const hasRight = Boolean(resolvedRightElement);

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {/* Label & Secondary Label Header */}
        {(label || secondaryLabel) && (
          <div className="flex justify-between items-center text-xs font-semibold text-[#131b2e]">
            {label && (
              <label htmlFor={id} className="flex items-center gap-1 cursor-pointer">
                <span>{label}</span>
                {required && <span className="text-red-500">*</span>}
              </label>
            )}
            {secondaryLabel && (
              <span className="text-[#64748B] font-normal">{secondaryLabel}</span>
            )}
          </div>
        )}

        {/* Input Wrapper Container */}
        <div className="relative flex items-center w-full">
          {/* Left Icon */}
          {hasLeft && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#64748B]">
              {renderIcon(resolvedLeftIcon, sizeStyles[inputSize].icon)}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            className={cn(
              // Default Base styles
              'w-full bg-slate-50 border border-slate-200 text-[#131b2e] placeholder-[#64748B] outline-none transition-all duration-200',
              'focus:bg-white focus:border-[#006948] focus:ring-2 focus:ring-[#006948]/20',
              'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
              // Padding dinamis berdasarkan ada/tidaknya icon
              hasLeft ? 'pl-11' : 'pl-3.5',
              hasRight ? 'pr-11' : 'pr-3.5',
              // Size styling
              sizeStyles[inputSize].input,
              // Error state styling
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900',
              // Custom className dari pemanggil
              className
            )}
            {...props}
          />

          {/* Right Icon / Right Element (e.g. eye button toggle, search clear) */}
          {hasRight && (
            <div className="absolute right-3.5 flex items-center">
              {renderIcon(resolvedRightElement, sizeStyles[inputSize].icon)}
            </div>
          )}
        </div>

        {/* Error atau Helper Text di bawah input */}
        {error ? (
          <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#64748B] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;