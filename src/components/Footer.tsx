import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500 font-bold text-xl">
              <Leaf className="h-6 w-6" />
              <span className="tracking-tight text-slate-900 dark:text-white">Carbon<span className="text-emerald-600 dark:text-emerald-500">Wise</span></span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Empowering individuals and households to track, analyze, and reduce their carbon footprint through smart tracking, automated challenges, and personalized AI sustainability insights.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  Carbon Calculator
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">
                  Education Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Contact & Legal</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-slate-500 dark:text-slate-400">
                Email: contact@carbonwise.eco
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} CarbonWise. All rights reserved. Built for a greener tomorrow.
          </p>
          <div className="flex space-x-6 text-sm text-slate-400 dark:text-slate-500">
            <span>Climate Action Certified</span>
            <span>&bull;</span>
            <span>Eco-Friendly Hosting</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
