import { Report } from './schema';

export const demoReport: Report = {
  id: "d3b07384-d113-4ec5-a58e-0b1e13717281",
  createdAt: "2026-07-07T14:00:00.000Z",
  updatedAt: "2026-07-07T14:00:00.000Z",
  startup: {
    name: "EcoTrack",
    idea: "An AI-powered carbon footprint tracking and reduction recommendation software tailored specifically for small and medium-sized retail businesses. It integrates with existing POS systems and utility bills to automatically track emissions and provides actionable energy-saving recommendations.",
    industry: "CleanTech",
    targetMarket: "Small and medium retail businesses in urban cities.",
    stage: "Idea",
    teamSize: "2 Co-founders",
    funding: "Bootstrapped"
  },
  scores: {
    overall: {
      score: 76,
      label: "Strong",
      reasoning: "Strong value proposition targeting an underserved niche (SME retail) under growing ESG compliance pressure, with clear unit economics.",
      confidence: "high"
    },
    innovation: {
      score: 72,
      label: "Promising",
      reasoning: "AI recommendations and automated POS integrations are clever, though the underlying tracking algorithms use established standards.",
      confidence: "high"
    },
    marketPotential: {
      score: 80,
      label: "Strong",
      reasoning: "SMEs represent 90% of businesses and increasingly need green credentials to retain eco-conscious consumers, despite lower individual budget.",
      confidence: "medium"
    },
    scalability: {
      score: 78,
      label: "Strong",
      reasoning: "Pure SaaS model with automated API integrations allows low-touch onboarding and global scaling potential.",
      confidence: "high"
    },
    risk: {
      score: 45,
      label: "Moderate",
      reasoning: "Data integration complexity and SME churn are moderate risks. Regulatory tailwinds help offset customer acquisition costs.",
      confidence: "medium"
    },
    investmentReadiness: {
      score: 74,
      label: "Strong",
      reasoning: "Ready for pre-seed. A working prototype of POS integration will rapidly de-risk the technical feasibility.",
      confidence: "high"
    }
  },
  executiveSummary: {
    hook: "Empowering local retailers to turn environmental compliance into a competitive advantage using seamless AI-driven carbon tracking.",
    overview: "EcoTrack simplifies carbon accounting for small and medium retail businesses. By automating data ingestion from Point of Sale (POS) terminals and utility API providers, EcoTrack calculates Scope 1 and Scope 2 emissions without manual data entry. Its core differentiator is a lightweight AI recommendation engine that suggests operational tweaks (like LED transitions or smart thermostats) that reduce carbon while lowering electricity bills.",
    keyInsights: [
      "SMEs face rising consumer pressure to go green but cannot afford expensive enterprise carbon accounting platforms.",
      "POS integration eliminates manual data entry, the primary churn driver in early SME carbon trackers.",
      "SaaS model with low pricing (~$49/mo) matches typical SMB SaaS budgets."
    ],
    recommendation: "Focus first on a single POS ecosystem (like Shopify or Clover) to build a tight integration and validate customer onboarding."
  },
  marketAnalysis: {
    marketSize: {
      tam: "$12.4 Billion (Global Carbon Accounting Market)",
      sam: "$1.8 Billion (Global SME Green Tech Market)",
      som: "$45 Million (Urban SME Retailers in North America & Europe)",
      isEstimate: true
    },
    trends: [
      "Increasing consumer preference for eco-friendly brands (up 70% in Gen Z).",
      "Stricter supply-chain disclosures forced onto small merchants by enterprise suppliers.",
      "Rising commercial electricity tariffs incentivizing immediate energy audits."
    ],
    targetAudience: "Indie boutique owners, local grocery stores, and multi-location retail brands aiming to display carbon-neutral certifications to their eco-conscious customers.",
    marketGaps: [
      "Enterprise systems (e.g., Watershed) cost $20k+/yr and require manual consulting.",
      "Free calculators require tedious manual input and offer no automated recommendations or integration."
    ]
  },
  similarBusinesses: [
    {
      company: "Watershed",
      industry: "CleanTech",
      stage: "Series C",
      businessModel: "Enterprise B2B SaaS + Consulting",
      outcome: "Highly successful, valued at $1B+",
      keyLessons: "Enterprise ESG is lucrative, but high sales friction makes it unsuited for SMEs. A self-serve, automated alternative is missing.",
      isVerified: true,
      source: "Public Information"
    },
    {
      company: "Greenly",
      industry: "CleanTech",
      stage: "Series B",
      businessModel: "B2B SaaS",
      outcome: "Growing rapidly, raised $20M+",
      keyLessons: "Successfully expanded into mid-market by focusing on software-first assessments. Proves appetite for automated integrations.",
      isVerified: true,
      source: "Public Information"
    },
    {
      company: "CarbonCount (Mock Example)",
      industry: "CleanTech",
      stage: "Failed",
      businessModel: "Ad-hoc auditing",
      outcome: "Shut down in 2024",
      keyLessons: "Manual spreadsheets don't scale. Retailers will not log in weekly to enter utility meter data. Automation is mandatory.",
      isVerified: false,
      source: "AI Historical Estimate"
    }
  ],
  competitors: [
    {
      name: "Greenly",
      description: "Standard carbon tracking software targeting European mid-market companies.",
      strengths: ["Strong framework compliance", "Established brand"],
      weaknesses: ["Too complex for mom-and-pop shops", "Lack of direct POS integrations"],
      marketShare: "~5% (Mid-Market EU)",
      differentiator: "EcoTrack focuses strictly on retail POS systems to automate tracking."
    },
    {
      name: "Manual Consultants",
      description: "Local green auditors who run manual spreadsheet analyses.",
      strengths: ["Highly personalized service"],
      weaknesses: ["Expensive upfront costs", "One-off static report rather than continuous tracking"],
      marketShare: "~60% (SME segment)",
      differentiator: "EcoTrack is 10x cheaper and works continuously."
    }
  ],
  swot: {
    strengths: [
      { point: "API Automation", detail: "Zero manual data entry after POS/utility link." },
      { point: "ROI-Focused", detail: "Connects carbon cuts to utility bill reductions." }
    ],
    weaknesses: [
      { point: "POS Dependency", detail: "Reliant on POS API stability and store co-operation." },
      { point: "Low ACV", detail: "SME pricing limits high-touch customer support." }
    ],
    opportunities: [
      { point: "Green Badges", detail: "Storefront badges for retailers to display to shoppers." },
      { point: "Carbon Offsetting", detail: "Taking a percentage fee on micro-offsets bought by retailers." }
    ],
    threats: [
      { point: "POS Consolidation", detail: "Shopify or Square releasing built-in carbon widgets." },
      { point: "SME Churn", detail: "High mortality rates of boutique retail businesses." }
    ]
  },
  businessModel: {
    type: "SaaS",
    revenueStreams: [
      { stream: "Starter Subscription", description: "$29/mo for single POS integration, basic recommendations." },
      { stream: "Pro Subscription", description: "$79/mo for multi-location, custom ESG badges, and utility integrations." },
      { stream: "Offset Marketplace Fee", description: "10% commission on carbon offset projects purchased through the dashboard." }
    ],
    pricingStrategy: "Low-touch SaaS subscription, pricing aligned with popular Shopify apps.",
    unitEconomics: {
      cac: "$120",
      ltv: "$900 (assuming 18 months retention at $50/mo average ARPU)",
      paybackPeriod: "2.4 months",
      isEstimate: true
    }
  },
  financials: {
    projections: [
      { year: 2026, revenue: 45000, costs: 30000, profit: 15000, users: 120, isEstimate: true },
      { year: 2027, revenue: 180000, costs: 95000, profit: 85000, users: 400, isEstimate: true },
      { year: 2028, revenue: 640000, costs: 220000, profit: 420000, users: 1200, isEstimate: true }
    ],
    fundingNeeded: "$150,000 pre-seed funding for software engineering and early merchant marketing.",
    breakEvenTimeline: "14 months after launch",
    keyAssumptions: [
      "Shopify app store listing drives 40% of early organic signups.",
      "Churn rate is kept below 5% monthly.",
      "Integration with Clover/Lightspeed can be built by a single developer in 3 months."
    ]
  },
  roadmap: [
    {
      phase: "Phase 1: MVP & POS Link",
      timeline: "Months 1-3",
      goals: ["Complete Shopify integration", "Obtain first 10 pilot merchants"],
      keyMilestones: ["Beta launch on Shopify App Store", "Completed automatic carbon calculator logic"],
      estimatedCost: "$30,000"
    },
    {
      phase: "Phase 2: Recommendation & Badges",
      timeline: "Months 4-6",
      goals: ["Introduce AI recommendation engine", "Roll out 'EcoTrack Carbon Verified' badge"],
      keyMilestones: ["100 active retail locations", "50 merchant badges deployed"],
      estimatedCost: "$45,000"
    },
    {
      phase: "Phase 3: Utility Sync",
      timeline: "Months 7-12",
      goals: ["Integrate utility APIs (Arc, Urjanet)", "Launch offset marketplace"],
      keyMilestones: ["$20k MRR reached", "Launch Lightspeed POS app"],
      estimatedCost: "$75,000"
    }
  ],
  risks: [
    {
      category: "Technical",
      risk: "Difficulty in standardizing gas/electric data across fragmented local utility providers.",
      severity: "High",
      mitigation: "Use pre-built aggregators like Arc instead of custom plumbing for each utility company."
    },
    {
      category: "Market",
      risk: "Mom-and-pop retailers refuse to pay for carbon software during economic downturns.",
      severity: "Medium",
      mitigation: "Position the software as an energy-saving expense-reduction tool first, and carbon tracker second."
    }
  ],
  investorPitch: {
    elevatorPitch: "EcoTrack is the carbon accounting SaaS for small merchants. We turn compliance into revenue by linking retail registers to emissions tracking in one click.",
    problemStatement: "Small merchants want to prove green credentials to customers and suppliers but enterprise ESG platforms are prohibitively expensive and complex. Simple spreadsheet audits are static and error-prone.",
    solution: "A plug-and-play app that links to POS (Shopify/Clover) to track transactions and utility APIs to calculate real-time carbon footprints, presenting it as an interactive merchant dashboard and verifiable digital customer badge.",
    whyNow: "Supply chain disclosures are trickling down to SMBs, and retail consumer surveys show eco-friendliness is now a top 3 decision driver.",
    askAmount: "$150,000",
    useOfFunds: [
      { category: "Product Development", percentage: 60 },
      { category: "Marketing & POS Integration Partnerships", percentage: 25 },
      { category: "Legal & ESG Compliance Certification", percentage: 15 }
    ]
  },
  goToMarket: {
    strategy: "App Store ecosystem placement (Shopify, Clover, Square) coupled with localized green merchant association partnerships.",
    channels: [
      { channel: "Shopify App Store SEO", priority: "High", rationale: "Captures active merchants looking for sustainability banners." },
      { channel: "Local Business Associations", priority: "Medium", rationale: "Leverages green chamber of commerce groups to build regional clusters." }
    ],
    launchPlan: "Launch private beta with 10 Shopify merchants. Iterate feedback on the automated recommendations dashboard, then release publicly with a 14-day free trial.",
    metricsToTrack: ["Monthly Recurring Revenue (MRR)", "Merchant Churn Rate", "Active Badges Embedded on Storefronts", "Kilograms of CO2 Mitigated"]
  },
  generationMeta: {
    model: "gemini-2.0-flash",
    totalTokens: 2500,
    generationTimeMs: 4200,
    sectionsGenerated: ["startup", "marketAnalysis", "similarBusinesses", "competitors", "swot", "businessModel", "financials", "roadmap", "risks", "investorPitch", "goToMarket"]
  }
};
