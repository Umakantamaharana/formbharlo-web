'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '../../types';
import {
  Briefcase,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Save,
} from 'lucide-react';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'GENERATED' | 'UNPUBLISHED'>('ALL');
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch {
      setError('Error loading jobs. Ensure your GITHUB_PAT is set correctly in environment variables.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(`status-${id}`);
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchJobs();
    } catch {
      alert('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateLink = async (id: string, newLink: string) => {
    setActionLoading(`link-${id}`);
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_link', id, link: newLink }),
      });
      if (!res.ok) throw new Error('Update failed');
      alert('Link updated and pushed to backend repository successfully!');
      fetchJobs();
    } catch {
      alert('Failed to update link');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    const title = (job.website_content?.title || '').toLowerCase();
    const id = String(job.id);
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || title.includes(query) || id.includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl">
              <Briefcase size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FormBharlo Job Management Console</h1>
              <p className="text-xs text-slate-400">Total Records: {jobs.length} &bull; Manage live status and application URLs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold py-2.5 px-4 rounded-xl border border-rose-800/40 transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/50 border border-rose-800 text-rose-200 text-sm p-4 rounded-2xl">
            {error}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by ID or Job Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {(['ALL', 'PUBLISHED', 'GENERATED', 'UNPUBLISHED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            <RefreshCw className="animate-spin mx-auto mb-2 text-blue-400" size={24} />
            Loading job records...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
            No jobs found matching your filter criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-850 border-b border-slate-800">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 font-bold">#{job.id}</span>
                      <h2 className="text-base font-bold text-white line-clamp-1">
                        {job.website_content?.title || 'Untitled Notification'}
                      </h2>
                    </div>
                    {job.href && (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Source URL: <span className="truncate max-w-md">{job.href}</span> <ExternalLink size={11} />
                      </a>
                    )}
                  </div>

                  {/* Status Badges & Quick Action */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        job.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : job.status === 'GENERATED'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {job.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {job.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handleUpdateStatus(job.id, 'PUBLISHED')}
                          disabled={actionLoading === `status-${job.id}`}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === `status-${job.id}` ? 'Saving...' : 'Publish'}
                        </button>
                      )}
                      {job.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleUpdateStatus(job.id, 'UNPUBLISHED')}
                          disabled={actionLoading === `status-${job.id}`}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-1.5 px-3 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                        >
                          Unpublish
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Form & Details */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/60">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Application Target URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        defaultValue={job.website_content?.actual_link}
                        id={`link-input-${job.id}`}
                        placeholder="https://..."
                      />
                      <button
                        onClick={() =>
                          handleUpdateLink(
                            job.id,
                            (document.getElementById(`link-input-${job.id}`) as HTMLInputElement).value
                          )
                        }
                        disabled={actionLoading === `link-${job.id}`}
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <Save size={13} /> Save Link
                      </button>
                    </div>

                    <div className="pt-2">
                      <span className="block text-xs font-bold text-slate-400 mb-1">Content Preview</span>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 max-h-32 overflow-y-auto font-mono whitespace-pre-wrap">
                        {job.website_content?.markdown_content || 'No content provided.'}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Content Posts */}
                  <div className="space-y-3">
                    <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Generated Social Snippets
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {Object.entries(job.social_posts || {}).map(([platform, text]) => (
                        <div key={platform} className="bg-slate-800/60 border border-slate-700/60 p-2.5 rounded-xl">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] font-bold uppercase text-blue-400">{platform}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(text as string);
                                alert(`Copied ${platform} post!`);
                              }}
                              className="text-[10px] text-slate-400 hover:text-white bg-slate-700 px-2 py-0.5 rounded"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 line-clamp-2">{text as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
