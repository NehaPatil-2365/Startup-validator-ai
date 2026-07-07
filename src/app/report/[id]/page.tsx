'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectionsChart, FundsChart, RadarScoreChart } from '@/components/report/Charts';
import ReactMarkdown from 'react-markdown';

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  const router = useRouter();
  const id = params.id;
  const isNew = id.startsWith('new-');

  const getSafeArray = (field: any, defaultKey?: string): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'object') {
      if (defaultKey && Array.isArray(field[defaultKey])) {
        return field[defaultKey];
      }
      for (const key of Object.keys(field)) {
        if (Array.isArray(field[key])) {
          return field[key];
        }
      }
      const values = Object.values(field);
      if (values.length > 0 && values.every(v => typeof v === 'object')) {
        return values;
      }
    }
    return [];
  };

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Initializing validation analysis...');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Active report data
  const [report, setReport] = useState<any>(null);
  
  // Section load tracking for skeletons
  const [loadedSections, setLoadedSections] = useState<Record<string, boolean>>({
    startup: false,
    marketAnalysis: false,
    scores: false,
    executiveSummary: false,
    swot: false,
    similarBusinesses: false,
    competitors: false,
    businessModel: false,
    financials: false,
    roadmap: false,
    risks: false,
    investorPitch: false,
    goToMarket: false,
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('summary');
  const [exportOpen, setExportOpen] = useState(false);

  // AI Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load existing report or stream new validation
  useEffect(() => {
    if (isNew) {
      // Stream pipeline from API
      streamValidation();
    } else {
      // Fetch completed report from DB
      fetchReport();
    }
  }, [id]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`);
      if (!response.ok) {
        throw new Error("Failed to retrieve validation report.");
      }
      const data = await response.json();
      setReport(data);
      
      // Mark all sections as loaded
      const allLoaded = { ...loadedSections };
      Object.keys(allLoaded).forEach(k => { allLoaded[k] = true; });
      setLoadedSections(allLoaded);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not retrieve report.");
    } finally {
      setLoading(false);
    }
  };

  const streamValidation = async () => {
    try {
      const pendingDataStr = sessionStorage.getItem(`validateai_pending_${id}`);
      if (!pendingDataStr) {
        throw new Error("No pending startup validation details found.");
      }

      const payload = JSON.parse(pendingDataStr);
      setLoading(true);

      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server failed to initialize validation stream.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Unable to read streaming output.");
      }

      let buffer = '';
      let partialReport: any = {
        startup: {},
        scores: {},
        executiveSummary: {},
        marketAnalysis: {},
        similarBusinesses: [],
        competitors: [],
        swot: {},
        businessModel: {},
        financials: {},
        roadmap: [],
        risks: [],
        investorPitch: {},
        goToMarket: {},
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse SSE format:
          // event: [name]
          // data: [JSON string]
          const eventMatch = line.match(/^event:\s*(.+)$/m);
          const dataMatch = line.match(/^data:\s*(.+)$/m);

          if (eventMatch && dataMatch) {
            const eventType = eventMatch[1].trim();
            const eventData = JSON.parse(dataMatch[1].trim());

            if (eventType === 'status') {
              setStatusMessage(eventData.message);
            } else if (eventType === 'section') {
              const sectionKey = eventData.key;
              partialReport = {
                ...partialReport,
                [sectionKey]: eventData.data
              };
              setReport({ ...partialReport });
              setLoadedSections(prev => ({
                ...prev,
                [sectionKey]: true
              }));
            } else if (eventType === 'error') {
              console.warn("Section stream error:", eventData.message);
            } else if (eventType === 'complete') {
              const savedId = eventData.reportId;
              sessionStorage.removeItem(`validateai_pending_${id}`);
              
              // Simulate brief finalize delay
              setStatusMessage("Finalizing analysis dashboard...");
              await new Promise(r => setTimeout(r, 800));
              
              // Redirect to static page
              router.replace(`/report/${savedId}`);
              return;
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Validation pipeline failed.");
      setLoading(false);
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userMsg = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          reportData: report,
          chatHistory: chatHistory,
        }),
      });

      if (!response.ok) throw new Error("AI failed to respond.");

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, I had trouble processing that request. Please try again." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Convert report to Markdown and download
  const handleExportMarkdown = () => {
    if (!report) return;

    let md = `# ${report.startup?.name || 'Startup'} - Validation Report\n\n`;
    md += `**Industry**: ${report.startup?.industry || ''}\n`;
    md += `**Overall Score**: ${report.scores?.overall?.score || 0}/100 (${report.scores?.overall?.label || ''})\n\n`;
    md += `## Executive Summary\n\n${report.executiveSummary?.overview || ''}\n\n`;
    md += `*Hook*: "${report.executiveSummary?.hook || ''}"\n\n`;
    
    if (report.executiveSummary?.keyInsights) {
      md += `### Key Insights\n\n`;
      report.executiveSummary.keyInsights.forEach((insight: string) => {
        md += `- ${insight}\n`;
      });
      md += `\n`;
    }
    
    md += `**Recommendation**: ${report.executiveSummary?.recommendation || ''}\n\n`;
    
    // Convert SWOT
    if (report.swot) {
      md += `## SWOT Analysis\n\n`;
      md += `### Strengths\n`;
      getSafeArray(report.swot.strengths).forEach((s: any) => md += `- **${s.point}**: ${s.detail}\n`);
      md += `\n### Weaknesses\n`;
      getSafeArray(report.swot.weaknesses).forEach((w: any) => md += `- **${w.point}**: ${w.detail}\n`);
      md += `\n### Opportunities\n`;
      getSafeArray(report.swot.opportunities).forEach((o: any) => md += `- **${o.point}**: ${o.detail}\n`);
      md += `\n### Threats\n`;
      getSafeArray(report.swot.threats).forEach((t: any) => md += `- **${t.point}**: ${t.detail}\n`);
      md += `\n`;
    }

    // Convert Roadmap
    if (report.roadmap) {
      md += `## Roadmap Timeline\n\n`;
      getSafeArray(report.roadmap).forEach((phase: any) => {
        md += `### ${phase.phase} (${phase.timeline})\n`;
        md += `Estimated Cost: ${phase.estimatedCost || 'N/A'}\n\n`;
        md += `**Goals**:\n`;
        getSafeArray(phase.goals).forEach((g: string) => md += `- ${g}\n`);
        md += `\n**Milestones**:\n`;
        getSafeArray(phase.keyMilestones).forEach((m: string) => md += `- ${m}\n`);
        md += `\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(report.startup?.name || 'startup').toLowerCase()}-validation-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (!report) return;
    const text = `Startup: ${report.startup?.name}\nOverall Score: ${report.scores?.overall?.score}/100\nExecutive Summary: ${report.executiveSummary?.overview}`;
    navigator.clipboard.writeText(text);
    alert("Report summary copied to clipboard!");
  };

  // Score styling helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success border-success/30 bg-success/5';
    if (score >= 60) return 'text-accent-secondary border-accent-primary/30 bg-accent-primary/5';
    if (score >= 40) return 'text-warning border-warning/30 bg-warning/5';
    return 'text-danger border-danger/30 bg-danger/5';
  };

  // Render loading overlay if generating/fetching
  if (isNew && loading && !loadedSections.executiveSummary) {
    return (
      <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col justify-center items-center p-6 font-sans">
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-accent-primary/10 border-t-accent-primary animate-spin"></div>
            <div className="absolute inset-2 bg-bg-secondary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-accent-primary text-3xl animate-pulse">analytics</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-text-primary">Analyzing Startup Details</h2>
          <p className="text-text-secondary text-sm h-12 flex items-center justify-center max-w-sm mx-auto leading-relaxed">
            {statusMessage}
          </p>

          {/* Progress Indicators */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 text-left space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-secondary">AI Pipeline Stages</span>
              <span className="font-mono text-accent-secondary">
                {Object.values(loadedSections).filter(Boolean).length}/13 sections done
              </span>
            </div>
            
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-primary transition-all duration-300"
                style={{ width: `${(Object.values(loadedSections).filter(Boolean).length / 13) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-text-secondary pt-2">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${loadedSections.startup ? 'text-success' : 'text-text-tertiary animate-pulse'}`}>
                  {loadedSections.startup ? 'check_circle' : 'circle'}
                </span>
                <span>Startup profile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${loadedSections.marketAnalysis ? 'text-success' : 'text-text-tertiary animate-pulse'}`}>
                  {loadedSections.marketAnalysis ? 'check_circle' : 'circle'}
                </span>
                <span>Market Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${loadedSections.businessModel ? 'text-success' : 'text-text-tertiary'}`}>
                  {loadedSections.businessModel ? 'check_circle' : 'circle'}
                </span>
                <span>Revenue models</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${loadedSections.financials ? 'text-success' : 'text-text-tertiary'}`}>
                  {loadedSections.financials ? 'check_circle' : 'circle'}
                </span>
                <span>Financial stats</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${loadedSections.roadmap ? 'text-success' : 'text-text-tertiary'}`}>
                  {loadedSections.roadmap ? 'check_circle' : 'circle'}
                </span>
                <span>Strategic Roadmap</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${loadedSections.scores ? 'text-success' : 'text-text-tertiary'}`}>
                  {loadedSections.scores ? 'check_circle' : 'circle'}
                </span>
                <span>Weighted Scores</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col justify-center items-center p-6 font-sans">
        <div className="w-full max-w-md text-center p-8 bg-bg-secondary border border-border-primary rounded-xl shadow-xl">
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl">error_outline</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-3">Analysis Failed</h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            {errorMsg}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/new" className="bg-accent-primary text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-accent-secondary transition-colors">
              Try Again
            </Link>
            <Link href="/dashboard" className="bg-bg-tertiary text-text-secondary text-sm font-semibold px-6 py-2.5 rounded-lg border border-border-primary hover:bg-bg-card-hover transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col justify-center items-center p-6 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-accent-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col font-sans relative pb-28">
      {/* TopNavBar */}
      <nav className="bg-bg-secondary/80 backdrop-blur-md w-full sticky top-0 z-50 border-b border-border-primary shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-text-secondary hover:text-text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <span className="text-text-tertiary">/</span>
            <span className="text-sm font-bold text-text-primary truncate max-w-[200px]">
              {report.startup?.name} Validation
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Export Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setExportOpen(!exportOpen)}
                className="bg-bg-tertiary border border-border-primary text-text-secondary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-bg-card-hover transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Report</span>
                <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
              </button>
              
              {exportOpen && (
                <>
                  {/* Invisible backdrop to close the dropdown when clicking outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
                  
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-bg-secondary border border-border-primary rounded-lg shadow-xl py-1.5 z-50 divide-y divide-border-primary">
                    <button 
                      onClick={() => {
                        handleExportMarkdown();
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">markdown</span>
                      Download Markdown
                    </button>
                    <button 
                      onClick={() => {
                        handleCopyToClipboard();
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      Copy Summary
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                        setExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      Print Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Score Cards (3/4 of the width on lg) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Header Row */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xs px-2 py-0.5 rounded border border-accent-primary/20 bg-accent-primary/10 text-accent-secondary font-bold uppercase tracking-wider">
                {report.startup?.industry}
              </span>
              <span className="text-xs text-text-tertiary">
                Validated on {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary">{report.startup?.name} Analysis</h1>
            <p className="text-text-secondary text-sm mt-1">{report.startup?.idea}</p>
          </div>

          {/* 6 Score Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Overall Score */}
            <div className={`border p-4 rounded-xl flex flex-col justify-between shadow-sm ${getScoreColor(report.scores?.overall?.score)}`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Overall Score</div>
              <div className="text-3xl font-extrabold font-mono mb-1">{report.scores?.overall?.score}</div>
              <div className="text-xs font-bold">{report.scores?.overall?.label}</div>
            </div>

            {/* Innovation */}
            <div className={`border p-4 rounded-xl flex flex-col justify-between shadow-sm ${getScoreColor(report.scores?.innovation?.score)}`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Innovation</div>
              <div className="text-3xl font-extrabold font-mono mb-1">{report.scores?.innovation?.score}</div>
              <div className="text-xs font-bold">{report.scores?.innovation?.label}</div>
            </div>

            {/* Market Potential */}
            <div className={`border p-4 rounded-xl flex flex-col justify-between shadow-sm ${getScoreColor(report.scores?.marketPotential?.score)}`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Market Pot.</div>
              <div className="text-3xl font-extrabold font-mono mb-1">{report.scores?.marketPotential?.score}</div>
              <div className="text-xs font-bold">{report.scores?.marketPotential?.label}</div>
            </div>

            {/* Scalability */}
            <div className={`border p-4 rounded-xl flex flex-col justify-between shadow-sm ${getScoreColor(report.scores?.scalability?.score)}`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Scalability</div>
              <div className="text-3xl font-extrabold font-mono mb-1">{report.scores?.scalability?.score}</div>
              <div className="text-xs font-bold">{report.scores?.scalability?.label}</div>
            </div>

            {/* Risk Score */}
            <div className={`border p-4 rounded-xl flex flex-col justify-between shadow-sm ${
              report.scores?.risk?.score > 60 ? 'text-danger border-danger/30 bg-danger/5' :
              report.scores?.risk?.score > 40 ? 'text-warning border-warning/30 bg-warning/5' :
              'text-success border-success/30 bg-success/5'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Risk Score</div>
              <div className="text-3xl font-extrabold font-mono mb-1">{report.scores?.risk?.score}</div>
              <div className="text-xs font-bold">{report.scores?.risk?.label}</div>
            </div>

            {/* Investment Readiness */}
            <div className={`border p-4 rounded-xl flex flex-col justify-between shadow-sm ${getScoreColor(report.scores?.investmentReadiness?.score)}`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Invest. Ready</div>
              <div className="text-3xl font-extrabold font-mono mb-1">{report.scores?.investmentReadiness?.score}</div>
              <div className="text-xs font-bold">{report.scores?.investmentReadiness?.label}</div>
            </div>
          </div>

          {/* Details Section Tab Bar */}
          <div className="border-b border-border-primary">
            <div className="flex gap-6 overflow-x-auto no-scrollbar py-1">
              {[
                { label: 'Executive Summary', id: 'summary' },
                { label: 'Market Analysis', id: 'market' },
                { label: 'Similar Businesses', id: 'similar' },
                { label: 'SWOT Analysis', id: 'swot' },
                { label: 'Business Model', id: 'model' },
                { label: 'Financials', id: 'financials' },
                { label: 'Strategic Roadmap', id: 'roadmap' },
                { label: 'Investor Pitch', id: 'pitch' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-semibold pb-3 border-b-2 transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'border-accent-primary text-text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-md min-h-[300px]">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="border-l-4 border-accent-primary pl-4 py-1.5 italic text-text-primary font-medium text-lg leading-relaxed">
                  &ldquo;{report.executiveSummary?.hook}&rdquo;
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-text-primary text-base">Overview</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{report.executiveSummary?.overview}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border-primary">
                  {getSafeArray(report.executiveSummary?.keyInsights).map((insight: string, idx: number) => (
                    <div key={idx} className="bg-bg-tertiary/40 border border-border-primary/50 p-4 rounded-lg flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent-primary/10 text-accent-secondary flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-text-secondary text-xs leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-accent-primary/5 border border-accent-primary/15 p-4 rounded-lg mt-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent-secondary mb-1">AI Recommendation</div>
                  <p className="text-text-secondary text-sm leading-relaxed">{report.executiveSummary?.recommendation}</p>
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-6">
                <h3 className="font-bold text-text-primary text-lg border-b border-border-primary pb-3">Market Sizing (TAM/SAM/SOM)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                    <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">Total Addressable Market (TAM)</div>
                    <div className="text-xl font-extrabold text-text-primary font-mono">{report.marketAnalysis?.marketSize?.tam}</div>
                    <div className="text-3xs text-text-tertiary mt-2">AI estimate of global scope</div>
                  </div>
                  <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                    <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">Serviceable Addressable (SAM)</div>
                    <div className="text-xl font-extrabold text-text-primary font-mono">{report.marketAnalysis?.marketSize?.sam}</div>
                    <div className="text-3xs text-text-tertiary mt-2">Targeted industry segment</div>
                  </div>
                  <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                    <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">Serviceable Obtainable (SOM)</div>
                    <div className="text-xl font-extrabold text-accent-primary font-mono">{report.marketAnalysis?.marketSize?.som}</div>
                    <div className="text-3xs text-text-tertiary mt-2">Realistic short-term capture</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border-primary">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm mb-3">Key Market Trends</h4>
                    <ul className="space-y-2.5">
                      {getSafeArray(report.marketAnalysis?.trends).map((trend: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-text-secondary">
                          <span className="material-symbols-outlined text-accent-secondary text-sm shrink-0">trending_up</span>
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-text-primary text-sm mb-3">Unmet Market Gaps</h4>
                    <ul className="space-y-2.5">
                      {getSafeArray(report.marketAnalysis?.marketGaps).map((gap: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-text-secondary">
                          <span className="material-symbols-outlined text-warning text-sm shrink-0">warning_amber</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-bg-tertiary/50 border border-border-primary/80 p-4 rounded-xl mt-4">
                  <h4 className="font-bold text-text-primary text-sm mb-2">Target Audience Segment</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{report.marketAnalysis?.targetAudience}</p>
                </div>
              </div>
            )}

            {activeTab === 'similar' && (
              <div className="space-y-6">
                <h3 className="font-bold text-text-primary text-lg border-b border-border-primary pb-3">Similar Companies & Historical Context</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm divide-y divide-border-primary">
                    <thead>
                      <tr className="text-text-secondary font-semibold text-xs uppercase tracking-wider">
                        <th className="pb-3">Company</th>
                        <th className="pb-3">Stage</th>
                        <th className="pb-3">Model</th>
                        <th className="pb-3">Outcome</th>
                        <th className="pb-3">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary">
                      {getSafeArray(report.similarBusinesses).map((biz: any, idx: number) => (
                        <tr key={idx} className="text-text-secondary hover:text-text-primary transition-colors">
                          <td className="py-4 font-bold text-text-primary">{biz.company}</td>
                          <td className="py-4">{biz.stage}</td>
                          <td className="py-4 font-mono text-xs">{biz.businessModel}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-2xs font-bold border ${
                              biz.outcome.toLowerCase().includes('fail') || biz.outcome.toLowerCase().includes('shut')
                                ? 'bg-danger/5 border-danger/20 text-danger'
                                : 'bg-success/5 border-success/20 text-success'
                            }`}>
                              {biz.outcome}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-3xs font-semibold ${
                              biz.isVerified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>
                              {biz.isVerified ? 'Verified' : 'AI Estimate'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-6 border-t border-border-primary space-y-4">
                  <h4 className="font-bold text-text-primary text-sm">Key Historical Lessons</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getSafeArray(report.similarBusinesses).map((biz: any, idx: number) => (
                      <div key={idx} className="bg-bg-tertiary/40 border border-border-primary/50 p-4 rounded-lg">
                        <div className="font-bold text-text-primary text-xs mb-1">{biz.company} Lesson</div>
                        <p className="text-text-secondary text-xs leading-relaxed">{biz.keyLessons}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'swot' && (
              <div className="space-y-6">
                <h3 className="font-bold text-text-primary text-lg border-b border-border-primary pb-3">SWOT Analysis Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="border border-success/15 bg-success/5 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-success font-bold text-sm">
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                      <span>Strengths (Internal)</span>
                    </div>
                    <ul className="space-y-3">
                      {getSafeArray(report.swot?.strengths).map((s: any, idx: number) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed">
                          <strong className="text-text-primary">{s.point}</strong>: {s.detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="border border-danger/15 bg-danger/5 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-danger font-bold text-sm">
                      <span className="material-symbols-outlined text-sm">thumb_down</span>
                      <span>Weaknesses (Internal)</span>
                    </div>
                    <ul className="space-y-3">
                      {getSafeArray(report.swot?.weaknesses).map((w: any, idx: number) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed">
                          <strong className="text-text-primary">{w.point}</strong>: {w.detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="border border-accent-primary/15 bg-accent-primary/5 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-accent-secondary font-bold text-sm">
                      <span className="material-symbols-outlined text-sm">explore</span>
                      <span>Opportunities (External)</span>
                    </div>
                    <ul className="space-y-3">
                      {getSafeArray(report.swot?.opportunities).map((o: any, idx: number) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed">
                          <strong className="text-text-primary">{o.point}</strong>: {o.detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="border border-warning/15 bg-warning/5 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-warning font-bold text-sm">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <span>Threats (External)</span>
                    </div>
                    <ul className="space-y-3">
                      {getSafeArray(report.swot?.threats).map((t: any, idx: number) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed">
                          <strong className="text-text-primary">{t.point}</strong>: {t.detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'model' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-primary pb-3">
                  <h3 className="font-bold text-text-primary text-lg">Proposed Business Model</h3>
                  <span className="bg-accent-primary/10 border border-accent-primary/20 text-accent-secondary font-mono text-xs px-3 py-1 rounded-lg">
                    {report.businessModel?.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-text-primary text-sm">Revenue Streams</h4>
                    <div className="space-y-3">
                      {getSafeArray(report.businessModel?.revenueStreams).map((stream: any, idx: number) => (
                        <div key={idx} className="bg-bg-tertiary border border-border-primary p-4 rounded-xl">
                          <div className="font-bold text-text-primary text-sm mb-1">{stream.stream}</div>
                          <p className="text-text-secondary text-xs leading-relaxed">{stream.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl space-y-4">
                      <h4 className="font-bold text-text-primary text-sm border-b border-border-primary pb-2">Unit Economics (Estimates)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-3xs text-text-secondary font-semibold uppercase tracking-wider">Cust. Acquisition Cost (CAC)</div>
                          <div className="text-lg font-bold text-text-primary font-mono mt-1">{report.businessModel?.unitEconomics?.cac}</div>
                        </div>
                        <div>
                          <div className="text-3xs text-text-secondary font-semibold uppercase tracking-wider">Lifetime Value (LTV)</div>
                          <div className="text-lg font-bold text-success font-mono mt-1">{report.businessModel?.unitEconomics?.ltv}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-3xs text-text-secondary font-semibold uppercase tracking-wider">Payback Period</div>
                          <div className="text-sm font-bold text-text-primary mt-1">{report.businessModel?.unitEconomics?.paybackPeriod}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-bg-tertiary/40 border border-border-primary/80 p-4 rounded-xl">
                      <h4 className="font-bold text-text-primary text-xs mb-1">Pricing Strategy</h4>
                      <p className="text-text-secondary text-xs leading-relaxed">{report.businessModel?.pricingStrategy}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <h3 className="font-bold text-text-primary text-lg border-b border-border-primary pb-3">3-Year Projections</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Financial area chart */}
                  <div className="lg:col-span-2 bg-bg-tertiary border border-border-primary rounded-xl p-4">
                    <div className="text-xs font-semibold text-text-secondary mb-4 flex items-center gap-4">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent-primary rounded-full"></span> Revenue</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-success rounded-full"></span> Profit</span>
                    </div>
                    <ProjectionsChart data={report.financials?.projections || []} />
                  </div>

                  <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm border-b border-border-primary pb-2 mb-3">Key Capital Stats</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="text-3xs text-text-secondary font-semibold uppercase tracking-wider">Funding Needed</div>
                          <div className="text-sm font-bold text-text-primary mt-0.5">{report.financials?.fundingNeeded}</div>
                        </div>
                        <div>
                          <div className="text-3xs text-text-secondary font-semibold uppercase tracking-wider">Break-Even Timeline</div>
                          <div className="text-sm font-bold text-text-primary mt-0.5">{report.financials?.breakEvenTimeline}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-3xs text-text-tertiary border-t border-border-primary pt-3 mt-4">
                      * Projections are algorithmic forecasts and subject to operational variance.
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <h4 className="font-bold text-text-primary text-sm">Core Assumptions</h4>
                  <ul className="space-y-2">
                    {getSafeArray(report.financials?.keyAssumptions).map((asmp: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-xs text-text-secondary leading-relaxed">
                        <span className="text-accent-secondary shrink-0">•</span>
                        <span>{asmp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-6">
                <h3 className="font-bold text-text-primary text-lg border-b border-border-primary pb-3">Strategic Implementation Roadmap</h3>
                <div className="space-y-6 relative pl-6 border-l border-border-primary ml-3">
                  {getSafeArray(report.roadmap).map((phase: any, idx: number) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-accent-primary bg-bg-primary flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary"></span>
                      </span>
                      
                      <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl space-y-3">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h4 className="font-bold text-text-primary text-base">{phase.phase}</h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-secondary font-semibold font-mono">
                            {phase.timeline}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="font-semibold text-text-primary mb-1.5">Action Goals:</div>
                            <ul className="space-y-1 text-text-secondary list-disc pl-4">
                              {getSafeArray(phase.goals).map((g: string, gIdx: number) => (
                                <li key={gIdx}>{g}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="font-semibold text-text-primary mb-1.5">Key Milestones:</div>
                            <ul className="space-y-1 text-text-secondary list-disc pl-4">
                              {getSafeArray(phase.keyMilestones).map((m: string, mIdx: number) => (
                                <li key={mIdx}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {phase.estimatedCost && (
                          <div className="text-3xs text-text-tertiary border-t border-border-primary pt-2.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">payments</span>
                            <span>Est. Capital Allocation: {phase.estimatedCost}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pitch' && (
              <div className="space-y-6">
                <h3 className="font-bold text-text-primary text-lg border-b border-border-primary pb-3">Investor Pitch Structure</h3>
                <div className="space-y-4">
                  <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                    <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">Elevator Pitch</div>
                    <p className="text-base text-text-primary font-medium italic leading-relaxed">&ldquo;{report.investorPitch?.elevatorPitch}&rdquo;</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                      <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1.5">Problem Statement</div>
                      <p className="text-xs text-text-secondary leading-relaxed">{report.investorPitch?.problemStatement}</p>
                    </div>

                    <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                      <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1.5">Proposed Solution</div>
                      <p className="text-xs text-text-secondary leading-relaxed">{report.investorPitch?.solution}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-primary pt-6">
                    <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">Target Ask</div>
                        <div className="text-2xl font-extrabold text-accent-primary font-mono">{report.investorPitch?.askAmount}</div>
                      </div>
                      <div className="text-3xs text-text-tertiary mt-6">
                        <strong>Why Now?</strong> {report.investorPitch?.whyNow}
                      </div>
                    </div>

                    <div className="bg-bg-tertiary border border-border-primary p-5 rounded-xl">
                      <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-3">Proposed Use of Funds</div>
                      <FundsChart data={report.investorPitch?.useOfFunds || []} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Standalone Radar Score and AI Chat Dock */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rating Distribution Bar Chart */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-md">
            <h3 className="font-bold text-text-primary text-sm mb-3">Score breakdown</h3>
            <RadarScoreChart scores={report.scores} />
          </div>

          {/* AI Chat Drawer Button */}
          <button
            onClick={() => setChatOpen(true)}
            className="w-full bg-accent-primary text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-accent-primary/20 hover:bg-accent-secondary transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">forum</span>
            <span>Ask Startup Advisor AI</span>
          </button>
        </div>
      </main>

      {/* Floating Collapsible AI Chat Dock */}
      {chatOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-bg-secondary border-l border-border-primary shadow-2xl z-50 flex flex-col font-sans transition-transform duration-300">
          <div className="p-4 border-b border-border-primary flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-secondary">smart_toy</span>
              <span className="font-bold text-text-primary text-sm">Startup Advisor AI</span>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Chat bubbles */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            <div className="bg-bg-tertiary/50 border border-border-primary/50 text-xs text-text-secondary p-3 rounded-lg leading-relaxed">
              Hi! I&apos;m your startup advisor. I have loaded the full data structure of <strong>{report.startup?.name}</strong>. Feel free to ask me questions like:
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>&ldquo;How can we optimize our pricing?&rdquo;</li>
                <li>&ldquo;Suggest roadmap improvements&rdquo;</li>
                <li>&ldquo;What are our primary competitor weaknesses?&rdquo;</li>
              </ul>
            </div>

            {chatHistory.map((chat, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${chat.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div 
                  className={`px-4 py-2.5 rounded-lg text-xs leading-relaxed ${
                    chat.role === 'user'
                      ? 'bg-accent-primary text-white'
                      : 'bg-bg-tertiary border border-border-primary text-text-secondary'
                  }`}
                >
                  {chat.role === 'user' ? (
                    chat.content
                  ) : (
                    <div className="prose prose-invert prose-xs">
                      <ReactMarkdown>{chat.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="mr-auto items-start max-w-[85%] flex gap-2">
                <div className="bg-bg-tertiary border border-border-primary px-4 py-2.5 rounded-lg text-xs text-text-tertiary flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick chips bar */}
          <div className="px-4 py-3 border-t border-border-primary flex gap-2 overflow-x-auto no-scrollbar">
            {[
              "Improve pricing",
              "Rewrite pitch",
              "Suggest features",
            ].map(chip => (
              <button
                key={chip}
                onClick={() => {
                  setChatMessage(chip);
                }}
                className="px-2.5 py-1 rounded-full border border-border-primary hover:border-border-hover bg-bg-tertiary/50 hover:bg-bg-tertiary text-text-secondary text-3xs font-semibold shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleChatSend} className="p-4 border-t border-border-primary flex gap-2 bg-bg-secondary">
            <input
              type="text"
              required
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-accent-primary text-white px-3 py-2 rounded-lg hover:bg-accent-secondary transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
