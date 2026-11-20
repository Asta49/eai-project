import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none font-body',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-forest text-white',
        forest:
          'border-transparent bg-forest text-white',
        sage:
          'border-transparent bg-sage-light text-forest-dark',
        coral:
          'border-transparent bg-coral-light text-coral-dark',
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
        purple:
          'border-transparent bg-pastel-purple text-pastel-purpleText',
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
