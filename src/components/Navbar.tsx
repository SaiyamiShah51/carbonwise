'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Leaf, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 w-full transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500 font-bold text-xl">
              <Leaf className="h-6 w-6 animate-pulse" />
              <span className="tracking-tight text-slate-900 dark:text-white">Carbon<span className="text-emerald-600 dark:text-emerald-500">Wise</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about')
                  ? 'text-emerald-600 dark:text-emerald-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-450'
              }`}
            >
              About
            </Link>
            <Link
              href="/education"
              className={`text-sm font-medium transition-colors ${
                isActive('/education')
                  ? 'text-emerald-600 dark:text-emerald-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-450'
              }`}
            >
              Education
            </Link>

            {status === 'authenticated' ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="flex items-center space-x-1 text-sm text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="max-w-[100px] truncate font-medium">{session.user?.name}</span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-1 text-sm text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-450 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              status !== 'loading' && (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-450 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about')
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              About
            </Link>
            <Link
              href="/education"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/education')
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Education
            </Link>
            
            <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

            {status === 'authenticated' ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard')
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Profile ({session.user?.name})
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              status !== 'loading' && (
                <div className="grid grid-cols-2 gap-2 px-3 py-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2 border border-slate-350 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
