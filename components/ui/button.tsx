import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#F04D7E] text-white hover:bg-[#D83868] shadow-md shadow-rose-300/30',
        forest:
          'bg-[#F04D7E] text-white hover:bg-[#D83868] shadow-md shadow-rose-300/30',
        pink:
          'bg-[#F04D7E] text-white hover:bg-[#D83868] shadow-md shadow-rose-300/30',
        purple:
          'bg-[#6C70EB] text-white hover:bg-[#585CD6] shadow-md shadow-indigo-300/30',
        sage:
          'bg-[#6C70EB] text-white hover:bg-[#585CD6] shadow-md shadow-indigo-300/30',
        coral:
          'bg-[#F04D7E] text-white hover:bg-[#D83868] shadow-md shadow-rose-300/30',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-xs',
        outlineForest:
          'border-2 border-[#F04D7E] bg-transparent text-[#F04D7E] hover:bg-[#F04D7E] hover:text-white',
        secondary:
          'bg-[#EEF0FF] text-[#6C70EB] hover:bg-[#EEF0FF]/80 font-bold',
        ghost:
          'hover:bg-rose-50/70 text-slate-700 hover:text-brand-pink',
        link:
          'text-[#6C70EB] underline-offset-4 hover:underline p-0 h-auto font-medium',
        pcos:
          'bg-[#F04D7E] text-white hover:bg-[#D83868] shadow-md',
        teal:
          'bg-[#6C70EB] text-white hover:bg-[#585CD6] shadow-sm',
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
