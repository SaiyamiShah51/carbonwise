import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

export function Alert({ children, variant = 'info', className }: AlertProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-sm leading-relaxed",
        variant === 'success' && "border-emerald-250 bg-emerald-50 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/25 dark:text-emerald-400",
        variant === 'error' && "border-rose-250 bg-rose-50 text-rose-800 dark:border-rose-800/30 dark:bg-rose-950/25 dark:text-rose-450",
        variant === 'warning' && "border-amber-250 bg-amber-50 text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/25 dark:text-amber-400",
        variant === 'info' && "border-blue-250 bg-blue-50 text-blue-800 dark:border-blue-800/30 dark:bg-blue-950/25 dark:text-blue-400",
        className
      )}
    >
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-bold leading-none tracking-tight", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs opacity-90", className)} {...props} />;
}
