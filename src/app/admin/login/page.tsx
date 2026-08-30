'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid administrator password');
      }
    } catch {
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/30 mb-2">
            <Briefcase size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Career135 Management
          </h2>
          <p className="text-xs text-slate-400">
            Authorized administrator credentials required
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Admin Access Key
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
            &larr; Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
