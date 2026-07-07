'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewValidationPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<number>(2);
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [industry, setIndustry] = useState('SaaS');
  const [targetMarket, setTargetMarket] = useState('');
  const [stage, setStage] = useState('Idea');
  const [teamSize, setTeamSize] = useState('');
  const [funding, setFunding] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check local storage attempts count
    const savedAttempts = localStorage.getItem('validateai_attempts');
    if (savedAttempts !== null) {
      setAttempts(parseInt(savedAttempts, 10));
    } else {
      localStorage.setItem('validateai_attempts', '2');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts <= 0) {
      setErrorMessage("You have used all your free attempts!");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // First, create the report shell or save the data locally.
      // We will perform the validation request and decrement the counter when the SSE starts.
      // Redirect to report page with query parameters to trigger streaming!
      
      const newAttempts = attempts - 1;
      localStorage.setItem('validateai_attempts', newAttempts.toString());
      setAttempts(newAttempts);

      // Create a temporary ID and pass parameters in session storage to trigger SSE on the report page
      const tempId = `new-${Date.now()}`;
      const payload = {
        name,
        idea,
        industry,
        targetMarket,
        stage,
        teamSize,
        funding
      };
      
      sessionStorage.setItem(`validateai_pending_${tempId}`, JSON.stringify(payload));
      router.push(`/report/${tempId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request.");
      setLoading(false);
    }
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
              <Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Dashboard</Link>
              <Link href="/new" className="text-sm text-text-primary font-semibold transition-colors">New Validation</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-bg-tertiary px-3 py-1.5 rounded-lg border border-border-primary text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-accent-secondary">bolt</span>
              <span>{attempts} free {attempts === 1 ? 'try' : 'tries'} left</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex justify-center items-center py-12 px-6">
        <div className="w-full max-w-2xl bg-bg-secondary border border-border-primary rounded-xl shadow-xl p-8 relative overflow-hidden">
          {attempts <= 0 ? (
            /* Tries Exhausted State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Validation Attempts Exhausted</h2>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed max-w-md mx-auto">
                You have used both of your free startup validation attempts. To test new ideas, please delete some of your past reports from the Dashboard to free up attempts, or upgrade to a premium account.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/dashboard" className="bg-bg-tertiary text-text-primary text-sm font-semibold px-6 py-3 rounded-lg border border-border-primary hover:bg-bg-card-hover transition-colors">
                  Go to Dashboard
                </Link>
                <Link href="/" className="bg-accent-primary text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-accent-secondary transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            /* Active Form State */
            <div>
              <div className="mb-8 border-b border-border-primary pb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Validate Your Idea</h2>
                <p className="text-text-secondary text-sm">
                  The more detail you provide about your product, target audience, and business model, the more accurate the AI output will be.
                </p>
              </div>

              {errorMessage && (
                <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg p-4 mb-6 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Startup Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., EcoTrack"
                    className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>

                {/* Core Idea */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="idea" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Describe Your Startup Idea *
                    </label>
                    <span className={`text-xs ${idea.length > 2000 ? 'text-danger' : 'text-text-tertiary'}`}>
                      {idea.length}/2000
                    </span>
                  </div>
                  <textarea
                    id="idea"
                    required
                    rows={5}
                    maxLength={2000}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Provide a detailed description of what your startup does, the problem it solves, and how it works..."
                    className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    >
                      <option value="SaaS">SaaS</option>
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="CleanTech">CleanTech</option>
                      <option value="FoodTech">FoodTech</option>
                      <option value="PropTech">PropTech</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Stage */}
                  <div>
                    <label htmlFor="stage" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Current Stage
                    </label>
                    <select
                      id="stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    >
                      <option value="Idea">Idea</option>
                      <option value="MVP">MVP</option>
                      <option value="Early Traction">Early Traction</option>
                      <option value="Growth">Growth</option>
                    </select>
                  </div>
                </div>

                {/* Target Market */}
                <div>
                  <label htmlFor="targetMarket" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Target Market *
                  </label>
                  <input
                    type="text"
                    id="targetMarket"
                    required
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    placeholder="e.g., Small business owners in India, Gen-Z consumers"
                    className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team Size */}
                  <div>
                    <label htmlFor="teamSize" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Team Size (Optional)
                    </label>
                    <input
                      type="text"
                      id="teamSize"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="e.g., Solo founder, 3 co-founders"
                      className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                  </div>

                  {/* Funding */}
                  <div>
                    <label htmlFor="funding" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Existing Funding (Optional)
                    </label>
                    <input
                      type="text"
                      id="funding"
                      value={funding}
                      onChange={(e) => setFunding(e.target.value)}
                      placeholder="e.g., Bootstrapped / $50k pre-seed"
                      className="w-full bg-bg-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-border-primary mt-8">
                  <button
                    type="submit"
                    disabled={loading || attempts <= 0}
                    className="w-full bg-accent-primary text-white py-4 rounded-lg font-semibold hover:bg-accent-secondary transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 shadow-md hover:shadow-accent-primary/10"
                  >
                    {loading ? (
                      <>
                        <span>Starting Analysis...</span>
                      </>
                    ) : (
                      <>
                        <span>Validate My Startup</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
