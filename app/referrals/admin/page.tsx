'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, Download, ExternalLink, Briefcase, Users, X,
  ChevronDown, ChevronRight, Search, Calendar, CheckCircle, XCircle, Loader2,
  Brain, MessageSquare, Sparkles, Copy, Share2, AlertTriangle,
} from 'lucide-react';
import type { Job, ReferralRequest, ReferralAnalysis, CandidateFeedback } from '@/types/referral';

const inputCls = 'rounded-xl px-4 py-2.5 bg-white/[0.04] border border-white/10 text-[#f5f5f7] placeholder-[#424245] text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all w-full';

export default function AdminPage() {
  // Tabs
  const [tab, setTab] = useState<'jobs' | 'referrals'>('referrals');

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobForm, setJobForm] = useState({
    title: '', company: '', description: '', tech_stack: '',
    experience_min: '0', experience_max: '0', location_type: 'Remote',
    employment_type: 'Full-time', apply_by: '', is_active: true,
    job_location: '', job_id: '', job_link: '',
  });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);

  // AI Job Extraction state
  const [rawJdText, setRawJdText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<Record<string, unknown> | null>(null);
  const [extractionWarnings, setExtractionWarnings] = useState<string[]>([]);

  // Referrals state
  const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; label: string } | null>(null);

  // AI Analysis state
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // AI Feedback state
  const [generatingFeedbackId, setGeneratingFeedbackId] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'encouraging' | 'balanced' | 'constructive'>('balanced');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const jsonHeaders = { 'Content-Type': 'application/json' };

  const fetchJobs = useCallback(async () => {
    const res = await fetch('/api/admin/jobs');
    if (res.ok) {
      const json = await res.json();
      setJobs(json.data?.jobs ?? []);
    }
  }, []);

  const fetchReferrals = useCallback(async () => {
    const res = await fetch('/api/admin/referrals');
    if (res.ok) {
      const json = await res.json();
      setReferrals(json.data?.referrals ?? []);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchReferrals();
  }, [fetchJobs, fetchReferrals]);

  // Filtered referrals
  const filteredReferrals = useMemo(() => {
    let list = referrals;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((r) => new Date(r.created_at) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59');
      list = list.filter((r) => new Date(r.created_at) <= to);
    }
    return list;
  }, [referrals, searchQuery, dateFrom, dateTo]);

  // --- Jobs handlers ---
  const handleSaveJob = async () => {
    const body: Record<string, unknown> = {
      ...(editingJobId ? { id: editingJobId } : {}),
      title: jobForm.title, company: jobForm.company, description: jobForm.description,
      tech_stack: jobForm.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      experience_min: Number(jobForm.experience_min), experience_max: Number(jobForm.experience_max),
      location_type: jobForm.location_type, employment_type: jobForm.employment_type,
      apply_by: jobForm.apply_by || null, is_active: jobForm.is_active,
      job_location: jobForm.job_location || null,
      job_id: jobForm.job_id || null,
      job_link: jobForm.job_link || null,
    };

    // Include AI data if extraction was used
    if (rawJdText) body.raw_jd = rawJdText;
    if (extractionResult) body.ai_extracted_json = extractionResult;

    const method = editingJobId ? 'PATCH' : 'POST';
    const res = await fetch('/api/admin/jobs', { method, headers: jsonHeaders, body: JSON.stringify(body) });
    if (res.ok) { resetJobForm(); fetchJobs(); }
    else { const d = await res.json(); alert(d.error || 'Failed to save job'); }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this job post? This action cannot be undone.')) return;
    const res = await fetch('/api/admin/jobs', { method: 'DELETE', headers: jsonHeaders, body: JSON.stringify({ id }) });
    if (res.ok) fetchJobs();
  };

  const handleEditJob = (job: Job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title, company: job.company, description: job.description,
      tech_stack: job.tech_stack?.join(', ') || '',
      experience_min: String(job.experience_min), experience_max: String(job.experience_max),
      location_type: job.location_type, employment_type: job.employment_type,
      apply_by: job.apply_by?.slice(0, 10) || '', is_active: job.is_active !== false,
      job_location: job.job_location || '',
      job_id: job.job_id || '',
      job_link: job.job_link || '',
    });
    setRawJdText(job.raw_jd || '');
    setExtractionResult(job.ai_extracted_json as Record<string, unknown> | null);
    setExtractionWarnings([]);
    setShowJobForm(true);
  };

  const resetJobForm = () => {
    setEditingJobId(null); setShowJobForm(false);
    setJobForm({ title: '', company: '', description: '', tech_stack: '', experience_min: '0', experience_max: '0', location_type: 'Remote', employment_type: 'Full-time', apply_by: '', is_active: true, job_location: '', job_id: '', job_link: '' });
    setRawJdText(''); setExtractionResult(null); setExtractionWarnings([]);
  };

  // --- AI Job Extraction ---
  const handleExtractJob = async () => {
    if (!rawJdText.trim()) return;
    setExtracting(true);
    setExtractionWarnings([]);
    try {
      const res = await fetch('/api/ai/extract-job', {
        method: 'POST', headers: jsonHeaders, body: JSON.stringify({ raw_text: rawJdText }),
      });
      const json = await res.json();
      if (res.ok && json.data?.extracted) {
        const ext = json.data.extracted;
        setExtractionResult(ext);
        setExtractionWarnings(ext.warnings || []);
        // Auto-fill form
        setJobForm((prev) => ({
          ...prev,
          title: ext.title || prev.title,
          company: ext.company || prev.company,
          description: ext.description || prev.description,
          tech_stack: ext.tech_stack?.join(', ') || prev.tech_stack,
          experience_min: ext.experience_min != null ? String(ext.experience_min) : prev.experience_min,
          experience_max: ext.experience_max != null ? String(ext.experience_max) : prev.experience_max,
          location_type: ext.location_type || prev.location_type,
          employment_type: ext.employment_type || prev.employment_type,
          apply_by: ext.apply_by || prev.apply_by,
          job_location: ext.job_location || prev.job_location,
          job_id: ext.job_id || prev.job_id,
        }));
      } else {
        alert(json.error || 'Extraction failed');
      }
    } catch {
      alert('Extraction request failed');
    } finally {
      setExtracting(false);
    }
  };

  // --- Referral handlers ---
  const handleDeleteReferral = async (id: string) => {
    setDeletingId(id);
    // Optimistic removal
    setReferrals((prev) => prev.filter((r) => r.id !== id));
    setConfirmAction(null);
    setExpandedId(null);
    try {
      const res = await fetch(`/api/admin/referrals/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        // Refetch on failure
        fetchReferrals();
      }
    } catch {
      fetchReferrals();
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewResume = async (path: string) => {
    const res = await fetch('/api/admin/referrals', {
      method: 'POST', headers: jsonHeaders, body: JSON.stringify({ path }),
    });
    if (res.ok) {
      const json = await res.json();
      window.open(json.data?.url, '_blank');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admin/referrals?format=csv', '_blank');
  };

  // --- AI Analysis ---
  const handleAnalyze = async (referralId: string) => {
    setAnalyzingId(referralId);
    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST', headers: jsonHeaders, body: JSON.stringify({ referral_id: referralId }),
      });
      const json = await res.json();
      if (res.ok && json.data?.analysis) {
        setReferrals((prev) =>
          prev.map((r) => r.id === referralId ? { ...r, ai_analysis: json.data.analysis } : r)
        );
      } else {
        alert(json.error || 'Analysis failed');
      }
    } catch {
      alert('Analysis request failed');
    } finally {
      setAnalyzingId(null);
    }
  };

  // --- AI Feedback ---
  const handleGenerateFeedback = async (referralId: string) => {
    setGeneratingFeedbackId(referralId);
    try {
      const res = await fetch('/api/ai/generate-feedback', {
        method: 'POST', headers: jsonHeaders, body: JSON.stringify({ referral_id: referralId, tone: feedbackTone }),
      });
      const json = await res.json();
      if (res.ok && json.data?.feedback) {
        setReferrals((prev) =>
          prev.map((r) => r.id === referralId ? { ...r, feedback_payload: json.data.feedback } : r)
        );
      } else {
        alert(json.error || 'Feedback generation failed');
      }
    } catch {
      alert('Feedback request failed');
    } finally {
      setGeneratingFeedbackId(null);
    }
  };

  const handleShareFeedback = async (referralId: string) => {
    if (!confirm('Share this feedback with the candidate? This action cannot be undone.')) return;
    try {
      const res = await fetch('/api/ai/generate-feedback', {
        method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ referral_id: referralId }),
      });
      if (res.ok) {
        fetchReferrals();
      } else {
        const json = await res.json();
        alert(json.error || 'Failed to share feedback');
      }
    } catch {
      alert('Share request failed');
    }
  };

  const handleCopyFeedback = (feedback: CandidateFeedback) => {
    const text = [
      'Strengths:',
      ...feedback.strengths.map((s) => `  - ${s}`),
      '',
      'Growth Areas:',
      ...feedback.growth_areas.map((g) => `  - ${g}`),
      '',
      ...(feedback.suggestions.length > 0 ? ['Suggestions:', ...feedback.suggestions.map((s) => `  - ${s}`), ''] : []),
      feedback.message,
    ].join('\n');
    navigator.clipboard.writeText(text);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Match score badge color
  const scoreBadge = (score: number | null) => {
    if (score === null) return 'bg-slate-500/10 text-slate-500';
    if (score >= 70) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (score >= 40) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    return 'bg-red-500/10 text-red-500';
  };

  // Confidence badge
  const confidenceBadge = (meta: Record<string, unknown> | undefined) => {
    if (!meta?.confidence_score) return null;
    const score = meta.confidence_score as number;
    const color = score >= 0.7 ? 'text-emerald-500' : score >= 0.4 ? 'text-amber-500' : 'text-red-500';
    return (
      <span className={`text-[10px] ${color}`} title={`Model: ${meta.model_version ?? 'unknown'}`}>
        {Math.round(score * 100)}% confidence
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold text-[#f5f5f7] mb-8 tracking-tight">Referrals Admin</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button onClick={() => setTab('referrals')} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'referrals' ? 'bg-[#0071e3] text-white shadow-glow' : 'bg-white/[0.04] text-[#86868b] border border-white/10 hover:text-[#f5f5f7]'}`}>
              <Users size={16} /> Referrals ({referrals.length})
            </button>
            <button onClick={() => setTab('jobs')} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'jobs' ? 'bg-[#0071e3] text-white shadow-glow' : 'bg-white/[0.04] text-[#86868b] border border-white/10 hover:text-[#f5f5f7]'}`}>
              <Briefcase size={16} /> Jobs ({jobs.length})
            </button>
          </div>

          {/* ===================== REFERRALS TAB ===================== */}
          {tab === 'referrals' && (
            <div>
              {/* Toolbar: Search, Date Filter, CSV */}
              <div className="flex flex-wrap items-end gap-3 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#86868b] mb-1">Search</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Name or email..." className={`${inputCls} pl-9 w-full`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#86868b] mb-1">From</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#86868b] mb-1">To</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputCls} />
                </div>
                <button onClick={handleExportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#2997ff] hover:bg-[#2997ff]/10 transition-all border border-white/10 bg-white/[0.04]">
                  <Download size={14} /> CSV
                </button>
              </div>

              <p className="text-xs text-[#86868b] mb-4">{filteredReferrals.length} of {referrals.length} referrals shown</p>

              {/* Referral Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-xs text-[#86868b] border-b border-white/10">
                      <th className="py-3 px-3 w-8"></th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Mobile</th>
                      <th className="py-3 px-3">YOE</th>
                      <th className="py-3 px-3">Tech Stacks</th>
                      <th className="py-3 px-3">Job Ref</th>
                      <th className="py-3 px-3">AI</th>
                      <th className="py-3 px-3">Resume</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReferrals.map((r) => {
                      const isExpanded = expandedId === r.id;
                      const isDeleting = deletingId === r.id;
                      const jobRef = r.job_id_with_company || r.job_link || 'N/A';
                      const analysis = r.ai_analysis as ReferralAnalysis | null | undefined;
                      const feedback = r.feedback_payload as CandidateFeedback | null | undefined;
                      return (
                        <AnimatePresence key={r.id}>
                          {/* Main Row */}
                          <motion.tr
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isDeleting ? 0.3 : 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-3 px-3">
                              <button onClick={() => setExpandedId(isExpanded ? null : r.id)} className="p-1 rounded text-[#86868b] hover:text-[#0071e3] transition-colors" aria-label="Toggle details">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            </td>
                            <td className="py-3 px-3 text-xs text-[#86868b] whitespace-nowrap">{fmtDate(r.created_at)}</td>
                            <td className="py-3 px-3 font-medium text-[#f5f5f7] whitespace-nowrap">{r.name}</td>
                            <td className="py-3 px-3 text-[#a1a1a6]">{r.email}</td>
                            <td className="py-3 px-3 text-[#a1a1a6] whitespace-nowrap">{r.mobile}</td>
                            <td className="py-3 px-3 text-center text-[#f5f5f7]">{r.years_experience}</td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {r.tech_stacks?.slice(0, 3).map((t) => (
                                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#0071e3]/10 text-[#2997ff]">{t}</span>
                                ))}
                                {r.tech_stacks && r.tech_stacks.length > 3 && (
                                  <span className="text-[10px] text-[#86868b]">+{r.tech_stacks.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-xs text-[#86868b] max-w-[160px] truncate" title={jobRef}>{jobRef}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                {analysis && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${scoreBadge(analysis.match_score)}`}>
                                    {analysis.match_score !== null && analysis.match_score !== undefined ? `${analysis.match_score}%` : 'N/A'}
                                  </span>
                                )}
                                {feedback && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-[#af52de]">FB</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <button onClick={() => handleViewResume(r.resume_url)} className="inline-flex items-center gap-1 text-xs text-[#2997ff] hover:underline">
                                <ExternalLink size={10} /> View
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleAnalyze(r.id)}
                                  disabled={analyzingId === r.id}
                                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-[#2997ff] hover:bg-[#2997ff]/10 transition-all disabled:opacity-30"
                                  title="AI Analyze"
                                >
                                  {analyzingId === r.id ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
                                </button>
                                <button
                                  onClick={() => setConfirmAction({ id: r.id, label: 'Reoffered: Yes' })}
                                  disabled={isDeleting}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#30d158] hover:bg-[#30d158]/10 transition-all disabled:opacity-30"
                                  title="Reoffered: Yes — delete entry"
                                >
                                  <CheckCircle size={12} /> Yes
                                </button>
                                <button
                                  onClick={() => setConfirmAction({ id: r.id, label: 'Reoffered: No' })}
                                  disabled={isDeleting}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#ff453a] hover:bg-[#ff453a]/10 transition-all disabled:opacity-30"
                                  title="Reoffered: No — delete entry"
                                >
                                  <XCircle size={12} /> No
                                </button>
                              </div>
                            </td>
                          </motion.tr>

                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-white/[0.01]"
                            >
                              <td colSpan={11} className="px-6 py-4">
                                {/* Basic Details */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-xs mb-4">
                                  <div><span className="font-semibold text-[#86868b]">ID:</span> <span className="text-[#a1a1a6] font-mono text-[10px]">{r.id}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">Address:</span> <span className="text-[#f5f5f7]">{r.address || '—'}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">College:</span> <span className="text-[#f5f5f7]">{r.college || '—'}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">Education:</span> <span className="text-[#f5f5f7]">{r.latest_education || '—'}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">Job Link:</span> <span className="text-[#f5f5f7] break-all">{r.job_link || '—'}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">Job ID / Company:</span> <span className="text-[#f5f5f7]">{r.job_id_with_company || '—'}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">Resume Path:</span> <span className="text-[#f5f5f7] font-mono text-[10px] break-all">{r.resume_url}</span></div>
                                  <div><span className="font-semibold text-[#86868b]">All Tech:</span> <span className="text-[#f5f5f7]">{r.tech_stacks?.join(', ') || '—'}</span></div>
                                </div>

                                {/* AI Analysis Panel */}
                                {analysis && (
                                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Brain size={14} className="text-[#2997ff]" />
                                      <h4 className="text-sm font-semibold text-[#f5f5f7]">AI Analysis</h4>
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreBadge(analysis.match_score)}`}>
                                        {analysis.match_label}
                                        {analysis.match_score !== null && analysis.match_score !== undefined ? ` (${analysis.match_score}/100)` : ''}
                                      </span>
                                      {confidenceBadge(analysis._meta as unknown as Record<string, unknown>)}
                                    </div>

                                    <p className="text-xs text-[#a1a1a6] mb-3">{analysis.summary}</p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {analysis.skill_alignment?.matched?.map((s) => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#30d158]/10 text-[#30d158]">{s}</span>
                                      ))}
                                      {analysis.skill_alignment?.missing?.map((s) => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#ff453a]/10 text-[#ff453a]">{s}</span>
                                      ))}
                                      {analysis.skill_alignment?.additional?.map((s) => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#0071e3]/10 text-[#2997ff]">{s}</span>
                                      ))}
                                    </div>

                                    {/* Experience */}
                                    {analysis.experience_fit?.assessment && (
                                      <p className="text-[10px] text-[#86868b] mb-2">
                                        Experience: {analysis.experience_fit.candidate_years != null ? `${analysis.experience_fit.candidate_years} yrs` : '?'}
                                        {analysis.experience_fit.required_range ? ` / ${analysis.experience_fit.required_range} required` : ''}
                                        {' — '}{analysis.experience_fit.assessment}
                                      </p>
                                    )}

                                    {/* Highlights & Concerns */}
                                    <div className="grid sm:grid-cols-2 gap-3">
                                      {analysis.highlights?.length > 0 && (
                                        <div>
                                          <p className="text-[10px] font-semibold text-[#30d158] mb-1">Highlights</p>
                                          {analysis.highlights.map((h, i) => (
                                            <p key={i} className="text-[10px] text-[#a1a1a6] pl-2 border-l-2 border-[#30d158]/50 mb-1">{h}</p>
                                          ))}
                                        </div>
                                      )}
                                      {analysis.concerns?.length > 0 && (
                                        <div>
                                          <p className="text-[10px] font-semibold text-[#ff9f0a] mb-1">Concerns</p>
                                          {analysis.concerns.map((c, i) => (
                                            <p key={i} className="text-[10px] text-[#a1a1a6] pl-2 border-l-2 border-[#ff9f0a]/50 mb-1">{c}</p>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <p className="text-[9px] text-[#86868b] mt-2">
                                      Model: {(analysis._meta as unknown as Record<string, unknown>)?.model_version as string ?? 'unknown'}
                                      {' | Analyzed: '}{(analysis._meta as unknown as Record<string, unknown>)?.analyzed_at ? fmtDate((analysis._meta as unknown as Record<string, unknown>).analyzed_at as string) : '—'}
                                    </p>
                                  </div>
                                )}

                                {/* AI Feedback Panel */}
                                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare size={14} className="text-[#af52de]" />
                                    <h4 className="text-sm font-semibold text-[#f5f5f7]">Candidate Feedback</h4>
                                  </div>

                                  {!feedback ? (
                                    <div className="flex items-center gap-3">
                                      {/* Tone selector */}
                                      <div className="flex rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
                                        {(['encouraging', 'balanced', 'constructive'] as const).map((t) => (
                                          <button
                                            key={t}
                                            onClick={() => setFeedbackTone(t)}
                                            className={`px-3 py-1.5 text-[10px] font-medium transition-all ${feedbackTone === t ? 'bg-[#af52de] text-white' : 'text-[#86868b] hover:bg-white/[0.04]'}`}
                                          >
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                          </button>
                                        ))}
                                      </div>
                                      <button
                                        onClick={() => handleGenerateFeedback(r.id)}
                                        disabled={generatingFeedbackId === r.id}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#af52de] hover:bg-[#af52de]/90 transition-all disabled:opacity-50"
                                      >
                                        {generatingFeedbackId === r.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                        Generate Feedback
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      {/* Strengths */}
                                      {feedback.strengths?.length > 0 && (
                                        <div className="mb-2">
                                          <p className="text-[10px] font-semibold text-[#30d158] mb-1">Strengths</p>
                                          {feedback.strengths.map((s, i) => (
                                            <p key={i} className="text-[10px] text-[#a1a1a6] pl-2 border-l-2 border-[#30d158]/50 mb-1">{s}</p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Growth Areas */}
                                      {feedback.growth_areas?.length > 0 && (
                                        <div className="mb-2">
                                          <p className="text-[10px] font-semibold text-[#ff9f0a] mb-1">Growth Areas</p>
                                          {feedback.growth_areas.map((g, i) => (
                                            <p key={i} className="text-[10px] text-[#a1a1a6] pl-2 border-l-2 border-[#ff9f0a]/50 mb-1">{g}</p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Suggestions */}
                                      {feedback.suggestions?.length > 0 && (
                                        <div className="mb-2">
                                          <p className="text-[10px] font-semibold text-[#2997ff] mb-1">Suggestions</p>
                                          {feedback.suggestions.map((s, i) => (
                                            <p key={i} className="text-[10px] text-[#a1a1a6] pl-2 border-l-2 border-[#2997ff]/50 mb-1">{s}</p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Message */}
                                      <div className="bg-white/[0.04] border border-white/5 rounded-lg p-3 mt-2 mb-3">
                                        <p className="text-xs text-[#f5f5f7] whitespace-pre-line">{feedback.message}</p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#af52de]/10 text-[#af52de] capitalize font-medium">{feedback.tone}</span>
                                        <button
                                          onClick={() => handleCopyFeedback(feedback)}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#86868b] hover:text-[#0071e3] hover:bg-[#0071e3]/10 transition-all"
                                        >
                                          <Copy size={10} /> Copy
                                        </button>
                                        {!(feedback._meta as unknown as Record<string, unknown>)?.shared_at && (
                                          <button
                                            onClick={() => handleShareFeedback(r.id)}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#30d158] hover:bg-[#30d158]/10 transition-all"
                                          >
                                            <Share2 size={10} /> Share with Candidate
                                          </button>
                                        )}
                                        {Boolean((feedback._meta as unknown as Record<string, unknown>)?.shared_at) && (
                                          <span className="text-[10px] text-[#30d158]">
                                            Shared {fmtDate((feedback._meta as unknown as Record<string, unknown>).shared_at as string)}
                                          </span>
                                        )}
                                        {confidenceBadge(feedback._meta as unknown as Record<string, unknown>)}
                                      </div>

                                      {/* Re-generate with different tone */}
                                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                                        <span className="text-[10px] text-[#86868b]">Re-generate:</span>
                                        <div className="flex rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
                                          {(['encouraging', 'balanced', 'constructive'] as const).map((t) => (
                                            <button
                                              key={t}
                                              onClick={() => setFeedbackTone(t)}
                                              className={`px-2 py-1 text-[10px] font-medium transition-all ${feedbackTone === t ? 'bg-[#af52de] text-white' : 'text-[#86868b] hover:bg-white/[0.04]'}`}
                                            >
                                              {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                          ))}
                                        </div>
                                        <button
                                          onClick={() => handleGenerateFeedback(r.id)}
                                          disabled={generatingFeedbackId === r.id}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-[#af52de] hover:bg-[#af52de]/10 transition-all disabled:opacity-50"
                                        >
                                          {generatingFeedbackId === r.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                          Regenerate
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredReferrals.length === 0 && (
                <p className="text-center text-sm text-[#86868b] py-12">
                  {referrals.length === 0 ? 'No referral requests yet.' : 'No results match your filters.'}
                </p>
              )}
            </div>
          )}

          {/* ===================== JOBS TAB ===================== */}
          {tab === 'jobs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#f5f5f7] tracking-tight">Manage Jobs</h2>
                <button onClick={() => { resetJobForm(); setShowJobForm(true); }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-[#000000] bg-[#30d158] hover:bg-[#30d158]/90 transition-colors">
                  <Plus size={14} /> Add Job
                </button>
              </div>

              {showJobForm && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6 relative">
                  <button onClick={resetJobForm} className="absolute top-4 right-4 text-[#86868b] hover:text-[#f5f5f7]" aria-label="Close form"><X size={18} /></button>
                  <h3 className="font-semibold text-[#f5f5f7] mb-4">{editingJobId ? 'Edit Job' : 'New Job'}</h3>

                  {/* AI Job Extraction Section */}
                  <div className="mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-[#0071e3]" />
                      <span className="text-sm font-medium text-[#f5f5f7]">AI Job Extraction</span>
                      {extractionResult && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          (extractionResult as Record<string, unknown>).confidence === 'high' ? 'bg-[#30d158]/10 text-[#30d158]' :
                          (extractionResult as Record<string, unknown>).confidence === 'medium' ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]' :
                          'bg-[#ff453a]/10 text-[#ff453a]'
                        }`}>
                          {(extractionResult as Record<string, unknown>).confidence as string} confidence
                        </span>
                      )}
                      {extractionResult && confidenceBadge((extractionResult as Record<string, unknown>)._meta as Record<string, unknown>)}
                    </div>
                    <textarea
                      value={rawJdText}
                      onChange={(e) => setRawJdText(e.target.value)}
                      placeholder="Paste raw job description text here (max 10,000 chars)..."
                      rows={4}
                      maxLength={10000}
                      className={`${inputCls} resize-none w-full mb-2`}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#86868b]">{rawJdText.length}/10,000 chars</span>
                      <button
                        onClick={handleExtractJob}
                        disabled={extracting || !rawJdText.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#0071e3] hover:bg-[#0071e3]/90 transition-colors disabled:opacity-50"
                      >
                        {extracting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Extract with AI
                      </button>
                    </div>
                    {extractionWarnings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {extractionWarnings.map((w, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#ff9f0a]/10 text-[#ff9f0a]">
                            <AlertTriangle size={10} /> {w}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} placeholder="Job Title *" className={inputCls} />
                    <input value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} placeholder="Company *" className={inputCls} />
                    <input value={jobForm.job_id} onChange={(e) => setJobForm({ ...jobForm, job_id: e.target.value })} placeholder="Job ID *" className={inputCls} />
                    <input value={jobForm.job_location} onChange={(e) => setJobForm({ ...jobForm, job_location: e.target.value })} placeholder="Job Location" className={inputCls} />
                    <input value={jobForm.job_link} onChange={(e) => setJobForm({ ...jobForm, job_link: e.target.value })} placeholder="Job Link (URL)" className={`${inputCls} sm:col-span-2`} />
                    <input value={jobForm.tech_stack} onChange={(e) => setJobForm({ ...jobForm, tech_stack: e.target.value })} placeholder="Tech stack (comma-separated)" className={`${inputCls} sm:col-span-2`} />
                    <input type="number" value={jobForm.experience_min} onChange={(e) => setJobForm({ ...jobForm, experience_min: e.target.value })} placeholder="Min YOE" className={inputCls} />
                    <input type="number" value={jobForm.experience_max} onChange={(e) => setJobForm({ ...jobForm, experience_max: e.target.value })} placeholder="Max YOE" className={inputCls} />
                    <select value={jobForm.location_type} onChange={(e) => setJobForm({ ...jobForm, location_type: e.target.value })} className={inputCls}>
                      <option value="Remote" className="bg-[#1d1d1f] text-[#f5f5f7]">Remote</option>
                      <option value="Hybrid" className="bg-[#1d1d1f] text-[#f5f5f7]">Hybrid</option>
                      <option value="On-site" className="bg-[#1d1d1f] text-[#f5f5f7]">On-site</option>
                    </select>
                    <select value={jobForm.employment_type} onChange={(e) => setJobForm({ ...jobForm, employment_type: e.target.value })} className={inputCls}>
                      <option value="Full-time" className="bg-[#1d1d1f] text-[#f5f5f7]">Full-time</option>
                      <option value="Contract" className="bg-[#1d1d1f] text-[#f5f5f7]">Contract</option>
                      <option value="Internship" className="bg-[#1d1d1f] text-[#f5f5f7]">Internship</option>
                    </select>
                    <input type="date" value={jobForm.apply_by} onChange={(e) => setJobForm({ ...jobForm, apply_by: e.target.value })} className={inputCls} />
                    <label className="flex items-center gap-2 text-sm text-[#a1a1a6] cursor-pointer">
                      <input type="checkbox" checked={jobForm.is_active} onChange={(e) => setJobForm({ ...jobForm, is_active: e.target.checked })} className="w-4 h-4 rounded bg-white/[0.04] border-white/10" /> Active
                    </label>
                    <textarea value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Description" rows={3} className={`${inputCls} resize-none sm:col-span-2`} />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={handleSaveJob} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0071e3] hover:bg-[#0071e3]/90 transition-colors">{editingJobId ? 'Update' : 'Create'}</button>
                    <button onClick={resetJobForm} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#86868b] hover:bg-white/[0.04] hover:text-[#f5f5f7] transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {jobs.map((job) => {
                  const isExpired = job.apply_by && new Date(job.apply_by) < new Date();
                  const isVisuallyInactive = !job.is_active || isExpired;
                  return (
                    <div key={job.id} className={`bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between gap-4 transition-all ${isVisuallyInactive ? 'opacity-50' : ''}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#f5f5f7] text-sm truncate">{job.title}</h4>
                          {!job.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff453a]/10 text-[#ff453a]">Inactive</span>}
                          {isExpired && <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff9f0a]/10 text-[#ff9f0a]">Expired</span>}
                          {job.ai_extracted_json && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0071e3]/10 text-[#2997ff]">AI</span>}
                        </div>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          {job.company}
                          {job.job_location && ` · ${job.job_location}`}
                          {job.job_id && ` · ID: ${job.job_id}`}
                          {' · '}{job.location_type} · {job.employment_type} · {job.experience_min}–{job.experience_max} yrs
                          {job.apply_by && ` · Apply by: ${new Date(job.apply_by).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => handleEditJob(job)} className="p-2 rounded-lg text-[#86868b] hover:text-[#0071e3] hover:bg-[#0071e3]/10 transition-all" aria-label="Edit job"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteJob(job.id)} className="p-2 rounded-lg text-[#86868b] hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-all" aria-label="Delete job"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
                {jobs.length === 0 && <p className="text-center text-sm text-[#86868b] py-8">No jobs yet. Create one above.</p>}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1d1d1f] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full shadow-apple-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#f5f5f7] mb-2 tracking-tight">Confirm Action</h3>
              <p className="text-sm text-[#a1a1a6] mb-6">
                <strong>{confirmAction.label}</strong> — this will permanently delete this referral entry. This cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setConfirmAction(null)} className="px-4 py-2 rounded-xl text-sm font-semibold text-[#86868b] hover:bg-white/[0.04] hover:text-[#f5f5f7] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReferral(confirmAction.id)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors ${confirmAction.label.includes('Yes') ? 'bg-[#30d158] hover:bg-[#30d158]/90 text-black' : 'bg-[#ff453a] hover:bg-[#ff453a]/90'}`}
                >
                  {deletingId === confirmAction.id && <Loader2 size={12} className="animate-spin" />}
                  Delete Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
