import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div
        className="h-full w-full flex-1 bg-emerald-600 transition-all duration-300 ease-in-out dark:bg-emerald-500"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </div>
  );
}
