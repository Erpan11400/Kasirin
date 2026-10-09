import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all duration-150 outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[#006948] text-white hover:bg-[#005238] active:bg-[#003d29] shadow-sm shadow-[#006948]/20 focus-visible:ring-[#006948]',
        default:
          'bg-[#006948] text-white hover:bg-[#005238] active:bg-[#003d29] shadow-sm shadow-[#006948]/20 focus-visible:ring-[#006948]',
        secondary:
          'bg-slate-100 text-[#131b2e] hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400',
        outline:
          'border border-slate-200 bg-transparent text-[#131b2e] hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400',
        ghost:
          'bg-transparent text-[#131b2e] hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
        danger:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/20 focus-visible:ring-red-600',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/20 focus-visible:ring-red-600',
        link: 'text-[#006948] underline-offset-4 hover:underline focus-visible:ring-[#006948]',
      },
      size: {
        default: 'h-10 px-4 text-sm rounded-xl gap-2',
        md: 'h-10 px-4 text-sm rounded-xl gap-2',
        sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
        xs: 'h-7 px-2.5 text-xs rounded-lg gap-1',
        lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
        icon: 'h-10 w-10 p-0 rounded-xl justify-center',
        'icon-sm': 'h-8 w-8 p-0 rounded-lg justify-center',
        'icon-lg': 'h-12 w-12 p-0 rounded-xl justify-center',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export type ButtonVariant =
  | 'primary'
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'destructive'
  | 'link';

export type ButtonSize =
  | 'default'
  | 'md'
  | 'sm'
  | 'xs'
  | 'lg'
  | 'icon'
  | 'icon-sm'
  | 'icon-lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      asChild = false,
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : 'button';
    const isDisabled = disabled || isLoading;

    if (asChild) {
      return (
        <Comp
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;