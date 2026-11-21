import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none font-body',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-brand-pink text-white shadow-xs',
        forest:
          'border-transparent bg-brand-pink text-white shadow-xs',
        pink:
          'border-transparent bg-brand-pink text-white shadow-xs',
        purple:
          'border-transparent bg-brand-purpleLight text-brand-purple',
        sage:
          'border-transparent bg-brand-purpleLight text-brand-purple',
        coral:
          'border-transparent bg-brand-pinkLight text-brand-pink',
        secondary:
          'border-transparent bg-slate-100 text-slate-700',
        destructive:
          'border-transparent bg-red-100 text-red-700',
        outline:
          'border-slate-200 text-slate-700 bg-white',
        success:
          'border-transparent bg-pastel-mint text-pastel-mintText',
        warning:
          'border-transparent bg-pastel-yellow text-pastel-yellowText',
        info:
          'border-transparent bg-pastel-blue text-pastel-blueText',
        teal:
          'border-transparent bg-sage-light text-forest',
        pcos:
          'border-transparent bg-sage-light text-forest-dark',
        peach:
          'border-transparent bg-pastel-peach text-pastel-peachText',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
