'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Award, CheckCircle2, Key, Crop, Info, Mail, Menu, X, Send, MessageCircle, Sparkles, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/formbharloin';
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://whatsapp.com/channel/formbharlo';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={14} className="text-blue-500" /> },
    { label: 'Top Forms', href: '/?q=form#recruitment-feed-top', icon: <Briefcase size={14} className="text-blue-600" /> },
    { label: 'Career Guides', href: '/guides', icon: <BookOpen size={14} className="text-indigo-500" /> },
    { label: 'Photo Resizer', href: '/tools/image-resizer', icon: <Crop size={14} className="text-purple-500" /> },
    { label: 'Admit Cards', href: '/?q=admit#recruitment-feed-top', icon: <Award size={14} className="text-emerald-500" /> },
    { label: 'Results', href: '/?q=result#recruitment-feed-top', icon: <CheckCircle2 size={14} className="text-rose-500" /> },
    { label: 'About', href: '/about', icon: <Info size={14} className="text-slate-500" /> },
    { label: 'Contact', href: '/contact', icon: <Mail size={14} className="text-slate-500" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Notification / Community Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-100 to-indigo-50 dark:from-blue-900/40 dark:via-slate-900 dark:to-indigo-900/40 border-b border-slate-200 dark:border-slate-800/80 py-1.5 px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/30">
              <Sparkles size={11} /> 100% Free Govt Job Alerts
            </span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-400">
              Central &amp; State Govt Recruitment, Exam Dates, &amp; Admit Cards
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full transition-all shadow-xs"
            >
              <Send size={11} /> Telegram
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full transition-all shadow-xs"
            >
              <MessageCircle size={11} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              F
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                FORM<span className="text-blue-600">BHARLO</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                Har Sarkari Bharti, Ek Jagah
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 transition-all duration-200"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs"
            >
              Join Telegram
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
            >
              Join WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
