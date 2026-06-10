'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calculator, 
  Lightbulb, 
  Target, 
  Trophy, 
  BookOpen, 
  User, 
  Settings, 
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Carbon Calculator', href: '/calculator', icon: Calculator },
    { name: 'AI Insights', href: '/insights', icon: Lightbulb },
    { name: 'Goals Tracker', href: '/goals', icon: Target },
    { name: 'Eco Challenges', href: '/challenges', icon: Trophy },
    { name: 'Education Hub', href: '/education', icon: BookOpen },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] hidden md:flex flex-col py-6 px-4 space-y-7 shrink-0 transition-colors">
      {/* Short branding/tagline inside sidebar */}
      <div className="flex items-center space-x-2 px-3 text-emerald-700 dark:text-emerald-450">
        <Leaf className="h-5 w-5 animate-bounce" />
        <span className="text-xs font-bold uppercase tracking-wider">Sustainability Panel</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group",
                isActive 
                  ? "bg-emerald-55 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold" 
                  : "text-slate-650 hover:bg-slate-50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-105", 
                isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
