import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
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
              <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg transition-colors">
              My Reports
            </Link>
            <Link href="/new" className="bg-accent-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-secondary transition-all shadow-md hover:shadow-accent-primary/15 flex items-center gap-1.5">
              Try Free →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-1/2 h-[450px] bg-accent-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-secondary mb-6">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span className="text-xs font-semibold uppercase tracking-wider">AI-Powered Startup Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
                Validate Your Startup <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Idea in Minutes</span>
              </h1>
              <p className="text-base md:text-lg text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                AI-powered analysis. Market insights. Investor-ready reports. Stop guessing and start building with data-driven confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/new" className="w-full sm:w-auto bg-accent-primary text-white text-sm font-semibold px-6 py-3.5 rounded-lg shadow-lg hover:shadow-accent-primary/20 hover:bg-accent-secondary transition-all flex items-center justify-center gap-2">
                  Start Validating
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto text-text-secondary hover:text-text-primary text-sm font-semibold px-6 py-3.5 rounded-lg border border-border-primary hover:bg-bg-tertiary transition-colors flex items-center justify-center gap-2">
                  View Demo Dashboard
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="bg-bg-secondary/60 backdrop-blur-md rounded-xl overflow-hidden p-2.5 border border-border-primary hover:border-border-hover transition-colors shadow-2xl z-10 relative">
                {/* Visual mockup representation of report dashboard */}
                <div className="bg-bg-primary rounded-lg overflow-hidden border border-border-primary/50 aspect-[4/3] p-4 flex flex-col justify-between">
                  <div className="border-b border-border-primary pb-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-danger"></div>
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <div className="h-4 w-28 bg-bg-tertiary rounded ml-2"></div>
                    </div>
                    <div className="h-5 w-16 bg-accent-primary/10 text-accent-secondary text-2xs font-semibold px-2 py-0.5 rounded border border-accent-primary/20">Active</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 my-4">
                    <div className="bg-bg-secondary border border-border-primary p-3 rounded-lg flex flex-col justify-center items-center text-center">
                      <div className="text-xs text-text-secondary mb-1">Overall Score</div>
                      <div className="text-2xl font-bold text-success font-mono">76</div>
                      <div className="text-3xs text-text-tertiary mt-1">Strong</div>
                    </div>
                    <div className="bg-bg-secondary border border-border-primary p-3 rounded-lg flex flex-col justify-center items-center text-center">
                      <div className="text-xs text-text-secondary mb-1">Innovation</div>
                      <div className="text-2xl font-bold text-accent-secondary font-mono">72</div>
                      <div className="text-3xs text-text-tertiary mt-1">Promising</div>
                    </div>
                    <div className="bg-bg-secondary border border-border-primary p-3 rounded-lg flex flex-col justify-center items-center text-center">
                      <div className="text-xs text-text-secondary mb-1">Market TAM</div>
                      <div className="text-lg font-bold text-text-primary font-mono">$1.8B</div>
                      <div className="text-3xs text-text-tertiary mt-1">SME segment</div>
                    </div>
                  </div>
                  
                  <div className="bg-bg-secondary border border-border-primary rounded-lg p-3 flex-grow flex flex-col justify-between">
                    <div className="flex gap-2 items-center mb-1">
                      <div className="w-4 h-4 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-3xs font-bold">i</div>
                      <div className="text-xs font-semibold text-text-primary">Executive Summary</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-bg-tertiary rounded"></div>
                      <div className="h-2 w-5/6 bg-bg-tertiary rounded"></div>
                      <div className="h-2 w-4/5 bg-bg-tertiary rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/10 to-transparent rounded-xl transform -rotate-2 scale-102 -z-10 blur-sm"></div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-bg-secondary/40 border-t border-b border-border-primary" id="features">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-text-primary mb-3">Intelligence at Every Step</h2>
              <p className="text-base text-text-secondary">A composed, systematic approach to evaluating your business model.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-bg-secondary border border-border-primary p-6 rounded-xl hover:border-border-hover hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 text-accent-secondary rounded-lg flex items-center justify-center mb-5 group-hover:bg-accent-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Deep dive into your business model using advanced AI models to identify strengths and weaknesses objectively.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-bg-secondary border border-border-primary p-6 rounded-xl hover:border-border-hover hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 text-accent-secondary rounded-lg flex items-center justify-center mb-5 group-hover:bg-accent-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">travel_explore</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Market Intelligence</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Extract indicators on competitors, market segments and trends to ensure your idea has a viable space to grow.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-bg-secondary border border-border-primary p-6 rounded-xl hover:border-border-hover hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 text-accent-secondary rounded-lg flex items-center justify-center mb-5 group-hover:bg-accent-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Investor-Ready Reports</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Professional structured reports containing executive summaries, SWOTs, financials and roadmap phases.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-bg-secondary border border-border-primary p-6 rounded-xl hover:border-border-hover hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 text-accent-secondary rounded-lg flex items-center justify-center mb-5 group-hover:bg-accent-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Interactive AI Chat</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Chat directly with your report context to explore pricing tweaks, improve roadmaps, or rewrite your pitch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-text-primary mb-3">Structured Validation Flow</h2>
                <p className="text-base text-text-secondary mb-10">Our strict process removes the noise, providing exceptional clarity on your next steps.</p>
                
                <div className="space-y-8 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-border-primary z-0 hidden md:block"></div>
                  
                  {/* Step 1 */}
                  <div className="flex gap-6 relative z-10 group">
                    <div className="w-12 h-12 rounded-full bg-bg-secondary border-2 border-accent-primary flex items-center justify-center text-accent-secondary font-bold shrink-0 group-hover:bg-accent-primary group-hover:text-white transition-colors">1</div>
                    <div>
                      <h4 className="text-lg font-bold text-text-primary mb-1">Describe Your Idea</h4>
                      <p className="text-sm text-text-secondary">Enter your concept, target market, and proposed solution in our simple, distraction-free form.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6 relative z-10 group">
                    <div className="w-12 h-12 rounded-full bg-bg-secondary border-2 border-border-primary flex items-center justify-center text-text-secondary font-bold shrink-0 group-hover:border-accent-primary group-hover:text-accent-secondary transition-colors">2</div>
                    <div>
                      <h4 className="text-lg font-bold text-text-primary mb-1">AI Analyzes</h4>
                      <p className="text-sm text-text-secondary">Our engine systematically scans global markets, active competitors, and potential operational risks.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6 relative z-10 group">
                    <div className="w-12 h-12 rounded-full bg-bg-secondary border-2 border-border-primary flex items-center justify-center text-text-secondary font-bold shrink-0 group-hover:border-accent-primary group-hover:text-accent-secondary transition-colors">3</div>
                    <div>
                      <h4 className="text-lg font-bold text-text-primary mb-1">Get Your Report</h4>
                      <p className="text-sm text-text-secondary">Receive a comprehensive, objective validation analysis formatted for immediate review and action.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="bg-bg-secondary/40 p-6 rounded-xl border border-border-primary shadow-xl">
                  <div className="border-b border-border-primary pb-4 mb-4 flex justify-between items-center">
                    <div className="h-4 w-24 bg-bg-tertiary rounded"></div>
                    <div className="h-4 w-12 bg-accent-primary/20 rounded"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 w-3/4 bg-bg-tertiary rounded"></div>
                    <div className="h-24 w-full bg-bg-tertiary rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 flex-grow bg-bg-tertiary rounded"></div>
                      <div className="h-10 w-28 bg-accent-primary rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-bg-secondary/20 border-t border-border-primary text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Ready to validate your next big idea?</h2>
            <p className="text-text-secondary text-base md:text-lg mb-8">Join thousands of founders making data-driven decisions.</p>
            <Link href="/new" className="inline-flex bg-accent-primary text-white text-sm font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-accent-secondary hover:shadow-accent-primary/20 transition-all gap-2">
              Get Started Free
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary/30 border-t border-border-primary py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <div className="font-bold text-text-primary">ValidateAI</div>
          <div>© {new Date().getFullYear()} ValidateAI. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text-primary transition-colors">Built for Hackathon</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
