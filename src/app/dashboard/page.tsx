'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ReportSummary {
  id: string;
  title: string;
  idea: string;
  createdAt: string;
  score: number;
  industry: string;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    topIndustry: 'None',
  });

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      if (Array.isArray(data)) {
        setReports(data);
        computeStats(data);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (data: ReportSummary[]) => {
    if (data.length === 0) {
      setStats({ total: 0, average: 0, topIndustry: 'None' });
      return;
    }
    const total = data.length;
    const average = Math.round(
      data.reduce((acc, curr) => acc + curr.score, 0) / total
    );

    // Compute top industry
    const industries: Record<string, number> = {};
    data.forEach((r) => {
      industries[r.industry] = (industries[r.industry] || 0) + 1;
    });
    let top = 'None';
    let max = 0;
    for (const [ind, count] of Object.entries(industries)) {
      if (count > max) {
        max = count;
        top = ind;
      }
    }

    setStats({ total, average, topIndustry: top });
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (response.ok) {
        const updated = reports.filter((r) => r.id !== id);
        setReports(updated);
        computeStats(updated);
        // Increment attempts count by 1 in localStorage to refund attempts
        const savedAttempts = localStorage.getItem('validateai_attempts');
        const attemptsVal = savedAttempts ? parseInt(savedAttempts, 10) : 2;
        const newAttempts = Math.min(2, attemptsVal + 1);
        localStorage.setItem('validateai_attempts', newAttempts.toString());
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success border-success/20 bg-success/5';
    if (score >= 60) return 'text-accent-secondary border-accent-primary/20 bg-accent-primary/5';
    if (score >= 40) return 'text-warning border-warning/20 bg-warning/5';
    return 'text-danger border-danger/20 bg-danger/5';
  };

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans">
      {/* TopNavBar */}
      <nav className="bg-bg-secondary/80 backdrop-blur-md w-full sticky top-0 z-50 border-b border-border-primary shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-accent-primary hover:text-accent-secondary transition-colors">
              ValidateAI
            </Link>
            <div className="hidden md:flex items-center gap-6 ml-6">
              <Link href="/dashboard" className="text-sm text-text-primary font-semibold transition-colors">Dashboard</Link>
              <Link href="/new" className="text-sm text-text-secondary hover:text-text-primary transition-colors">New Validation</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/new" className="bg-accent-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-accent-secondary transition-colors">
              + New Report
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-10 py-10">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Validations</h1>
          <p className="text-text-secondary text-sm">View, manage, and audit your startup idea reports.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent-primary/10 text-accent-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">bar_chart</span>
            </div>
            <div>
              <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1">Total Reports</div>
              <div className="text-2xl font-bold text-text-primary font-mono">{stats.total}</div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">grade</span>
            </div>
            <div>
              <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1">Average Score</div>
              <div className="text-2xl font-bold text-success font-mono">{stats.average}/100</div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">category</span>
            </div>
            <div>
              <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1">Top Sector</div>
              <div className="text-lg font-bold text-text-primary truncate max-w-[180px]">{stats.topIndustry}</div>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        {loading ? (
          /* Loading State */
          <div className="space-y-4">
            <div className="h-20 bg-bg-secondary border border-border-primary animate-pulse rounded-xl"></div>
            <div className="h-20 bg-bg-secondary border border-border-primary animate-pulse rounded-xl"></div>
            <div className="h-20 bg-bg-secondary border border-border-primary animate-pulse rounded-xl"></div>
          </div>
        ) : reports.length === 0 ? (
          /* Empty State */
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-12 text-center shadow-md">
            <div className="w-16 h-16 bg-bg-tertiary text-text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">lightbulb_outline</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Reports Yet</h3>
            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
              You haven&apos;t run any validation reports. Input a startup idea to get instant structural score ratings, market analysis, competitor metrics, and strategic roadmaps.
            </p>
            <Link href="/new" className="bg-accent-primary text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-secondary transition-colors inline-flex items-center gap-2">
              Create First Report
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          /* List of Reports */
          <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden shadow-md divide-y divide-border-primary">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="block hover:bg-bg-card-hover transition-colors p-6 flex justify-between items-center group"
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-text-primary text-lg group-hover:text-accent-primary transition-colors">
                      {report.title}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded border border-border-primary bg-bg-tertiary text-text-secondary font-medium">
                      {report.industry}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
                    {report.idea}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`border px-3 py-1.5 rounded-lg text-sm font-bold font-mono ${getScoreColor(report.score)}`}>
                    {report.score} / 100
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    className="w-10 h-10 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors flex items-center justify-center"
                    title="Delete Report"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
