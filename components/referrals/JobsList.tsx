'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, Code2, ArrowUpRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import type { Job } from '@/types/referral';

interface JobsListProps {
  onJobClick: (jobId: string, jobRef: string) => void;
}

const DESC_CHAR_LIMIT = 150;

export default function JobsList({ onJobClick }: JobsListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescs, setExpandedDescs] = useState<Set<string>>(new Set());

  const supabase = getSupabaseBrowser();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, company, description, tech_stack, experience_min, experience_max, location_type, employment_type, posted_at, apply_by, is_active, job_location, job_id')
      .eq('is_active', true)
      .order('posted_at', { ascending: false });

    if (!error && data) {
      setJobs(data as Job[]);
    }
    setLoading(false);
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Realtime subscription for job updates
  useEffect(() => {
    const channel = supabase
      .channel('jobs-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newJob = payload.new as Job;
            if (newJob.is_active !== false) {
              setJobs((prev) => [newJob, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Job;
            setJobs((prev) => {
              if (updated.is_active === false) {
                return prev.filter((j) => j.id !== updated.id);
              }
              const exists = prev.find((j) => j.id === updated.id);
              if (exists) {
                return prev.map((j) => (j.id === updated.id ? updated : j));
              }
              return [updated, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setJobs((prev) => prev.filter((j) => j.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const toggleDesc = (jobId: string) => {
    setExpandedDescs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading positions...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <Briefcase size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No Open Positions Right Now
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Check back soon! You can still submit a referral request using the form above with a job URL or description.
        </p>
        <button
          onClick={fetchJobs}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {jobs.length} position{jobs.length !== 1 ? 's' : ''} available
        </p>
        <button
          onClick={fetchJobs}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          <Loader2 size={12} className={loading ? 'animate-spin' : 'hidden'} />
          Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {jobs.map((job, i) => {
          const isLong = (job.description?.length ?? 0) > DESC_CHAR_LIMIT;
          const expanded = expandedDescs.has(job.id);
          return (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group glass-card rounded-2xl p-6 flex flex-col h-full glow-on-hover"
            >
              {/* Header — clickable to fill referral form */}
              <div
                className="cursor-pointer"
                onClick={() => onJobClick(job.id, `${job.title} — ${job.company}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onJobClick(job.id, `${job.title} — ${job.company}`);
                  }
                }}
                aria-label={`Apply for ${job.title} at ${job.company}. Click to fill referral form.`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-sm text-brand-600 dark:text-brand-400 font-medium mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg text-slate-400 group-hover:text-brand-500 group-hover:bg-brand-500/10 transition-all shrink-0">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>

              {/* Description with Show more / less */}
              {job.description && (
                <div className="mt-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {expanded || !isLong
                      ? job.description
                      : `${job.description.slice(0, DESC_CHAR_LIMIT)}…`}
                  </p>
                  {isLong && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleDesc(job.id); }}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {expanded ? (
                        <><ChevronUp size={12} /> Show less</>
                      ) : (
                        <><ChevronDown size={12} /> Show more</>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Meta */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                {job.job_location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {job.job_location}
                  </span>
                )}
                {job.job_id && (
                  <span className="inline-flex items-center gap-1 font-mono">
                    ID: {job.job_id}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Briefcase size={12} />
                  {job.employment_type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {job.experience_min}–{job.experience_max} yrs
                </span>
                {!job.job_location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {job.location_type}
                  </span>
                )}
              </div>

              {/* Tech Stack */}
              {job.tech_stack && job.tech_stack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/50 dark:border-white/5">
                  {job.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium bg-brand-500/5 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-500/20"
                    >
                      <Code2 size={10} />
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Posted {formatDate(job.posted_at)}</span>
                {job.apply_by && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Apply by {formatDate(job.apply_by)}
                  </span>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
