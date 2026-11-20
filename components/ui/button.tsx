import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-forest text-white hover:bg-forest-light shadow-md shadow-forest/10',
        forest:
          'bg-forest text-white hover:bg-forest-light shadow-md shadow-forest/15',
        sage:
          'bg-sage text-forest-dark hover:bg-sage-dark hover:text-white shadow-sm',
        coral:
          'bg-coral text-white hover:bg-coral-dark shadow-md shadow-coral/20',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-xs',
        outlineForest:
          'border-2 border-forest bg-transparent text-forest hover:bg-forest hover:text-white',
        secondary:
          'bg-sage-light text-forest hover:bg-sage-light/80',
        ghost:
          'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
        link:
          'text-forest underline-offset-4 hover:underline p-0 h-auto font-medium',
        pcos:
          'bg-forest text-white hover:bg-forest-light shadow-md',
        teal:
          'bg-sage text-forest hover:bg-sage-dark hover:text-white shadow-sm',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-13 px-8 text-base shadow-lg',
        icon: 'h-10 w-10 p-0 rounded-full',
        pill: 'h-12 px-6 rounded-full text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
