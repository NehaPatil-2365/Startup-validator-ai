import { Report } from '../schema';

export interface StartupInput {
  name: string;
  idea: string;
  industry: string;
  targetMarket: string;
  stage?: string;
  teamSize?: string;
  funding?: string;
}

export function startupProfilePrompt(input: StartupInput): string {
  return `
You are an expert startup advisor and Venture Capital analyst specializing in the Indian startup ecosystem. 
Standardize, refine, and structure the following startup input to make it suitable for further Indian market research and financial analysis.

STARTUP NAME: ${input.name}
STARTUP IDEA: ${input.idea}
INDUSTRY: ${input.industry}
TARGET MARKET: ${input.targetMarket}
STAGE: ${input.stage || 'Idea'}
TEAM SIZE: ${input.teamSize || 'Not specified'}
FUNDING: ${input.funding || 'Bootstrapped'}

CRITICAL INSTRUCTIONS:
1. Refine the startup idea into a concise 2-sentence description of the core value proposition and core technology/delivery mechanism.
2. Tailor descriptions to address how it operates within the Indian business landscape.
3. Return ONLY a valid JSON object matching the schema below. No markdown formatting, backticks, or explanations.

OUTPUT SCHEMA (JSON):
{
  "name": "string",
  "idea": "string (refined 2-sentence value proposition)",
  "industry": "string",
  "targetMarket": "string (e.g., Metro Indian cities, Tier-2 towns)",
  "stage": "string",
  "teamSize": "string",
  "funding": "string"
}
`;
}

export function marketAnalysisPrompt(startup: any): string {
  return `
You are a senior market intelligence researcher specializing in the Indian consumer and B2B markets.
Analyze the market sizing, trends, audience segments, and unmet market gaps in India for:
Startup Name: ${startup.name}
Core Idea: ${startup.idea}
Industry: ${startup.industry}
Target Market: ${startup.targetMarket}

CRITICAL INSTRUCTIONS:
1. Provide realistic market size figures (TAM, SAM, SOM) specifically for the Indian market. Use Crore (Cr) currency units (INR ₹) or clear USD equivalents relevant to India (e.g., '₹4,500 Cr ($540M) annual market'). Mark "isEstimate" as true.
2. Target audience must define the Indian customer archetype (e.g., middle-class households, Tier-1 tech workers, Kirana shop owners), their price sensitivity, purchasing power, and local pain points.
3. Market gaps must highlight underserved areas or inefficiencies in the Indian market (e.g., unorganized local sectors, lack of cold chains, digital distribution gaps).
4. Calculate a market potential score (0-100) reflecting Indian macroeconomic tailwinds (like digital India, UPI adoption) and competitive intensity.
5. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "marketSize": {
    "tam": "string (Total Addressable Market size in INR, e.g., '₹12,000 Cr ($1.4B) Indian market')",
    "sam": "string (Serviceable Addressable Market in INR, e.g., '₹1,500 Cr target urban segment')",
    "som": "string (Serviceable Obtainable Market in INR, e.g., '₹120 Cr within first 2 years')",
    "isEstimate": true
  },
  "trends": [
    "string (detailed Indian market trend, e.g., rapid penetration of UPI and digital payments)",
    "string (detailed Indian market trend, e.g., demand shift towards premium health-conscious choices in metros)",
    "string (detailed Indian market trend, e.g., tier-2/3 consumption growth driven by rising disposable income)"
  ],
  "targetAudience": "string (comprehensive Indian buyer persona, priorities, and price sensitivity characteristics)",
  "marketGaps": [
    "string (specific gap left by unorganized players in India)",
    "string (specific gap left by traditional Indian incumbents)",
    "string (specific gap in infrastructure or local trust)"
  ],
  "sectionScore": {
    "score": number (0-100),
    "reasoning": "string (1-2 sentence explanation of the Indian market potential rating)"
  }
}
`;
}

export function swotPrompt(startup: any): string {
  return `
You are a senior business strategist expert in the Indian market dynamics.
Perform a detailed, objective SWOT analysis for the following business:
Startup Name: ${startup.name}
Idea: ${startup.idea}
Industry: ${startup.industry}

CRITICAL INSTRUCTIONS:
1. Provide exactly 2 points for each quadrant (Strengths, Weaknesses, Opportunities, Threats).
2. Each point must have a concise title ("point") and a detailed explanatory context ("detail") explaining its strategic significance under Indian operating conditions.
3. Address factors like Indian logistics networks, local regulatory environments (GST, FSSAI, RBI), labor dynamics, and price sensitivity.
4. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "strengths": [
    { "point": "Concise Strength 1", "detail": "Detailed explanation of why this is a strength in the Indian ecosystem." },
    { "point": "Concise Strength 2", "detail": "Detailed explanation of why this is a strength in the Indian ecosystem." }
  ],
  "weaknesses": [
    { "point": "Concise Weakness 1", "detail": "Detailed explanation of this bottleneck, e.g. thin margins due to heavy Indian discount expectations." },
    { "point": "Concise Weakness 2", "detail": "Detailed explanation of this bottleneck, e.g. fragmented distribution networks." }
  ],
  "opportunities": [
    { "point": "Concise Opportunity 1", "detail": "Detailed explanation of how to leverage India's digital growth, UPI, or government initiatives." },
    { "point": "Concise Opportunity 2", "detail": "Detailed explanation of how to leverage India's digital growth, UPI, or government initiatives." }
  ],
  "threats": [
    { "point": "Concise Threat 1", "detail": "Detailed explanation of this competitor, local policy shift, or inflation challenge in India." },
    { "point": "Concise Threat 2", "detail": "Detailed explanation of this competitor, local policy shift, or inflation challenge in India." }
  ]
}
`;
}

export function similarBusinessesPrompt(startup: any): string {
  return `
You are a venture partner researching historical Indian startup benchmarks.
Identify exactly 3 real or highly realistic comparable startups in the Indian ecosystem (e.g. successful Indian unicorns, mid-market brands, or failed Indian startups) to serve as case studies for:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Benchmark against Indian startups (e.g., Wow! Momo, Chaayos, Licious, Zerodha, Dunzo, etc.) or regional players.
2. For each company, state the industry, stage, business model, outcome (e.g. valuation, funding, or shutdown), and key strategic lessons learned in the Indian context.
3. Set "isVerified" to true if the case is a well-known public Indian startup, or false if it is a representative archetype or estimate.
4. Return ONLY a valid JSON array matching the schema below.

OUTPUT SCHEMA (JSON):
[
  {
    "company": "string (Company Name, e.g. Chaayos or Wow! Momo)",
    "industry": "string (e.g., FoodTech, D2C, FinTech)",
    "stage": "string (e.g., Series C, Bootstrapped, Failed, IPO)",
    "businessModel": "string (e.g., QSR Franchise, D2C, B2B SaaS)",
    "outcome": "string (e.g., 'Profitable with ₹400 Cr ARR' or 'Shut down in 2024 due to high cash burn')",
    "keyLessons": "string (core takeaway regarding customer retention, product-market fit, or margin management in India)",
    "isVerified": boolean,
    "source": "string (e.g., 'Public Information' or 'AI Historical Estimate')"
  }
]
`;
}

export function competitorsPrompt(startup: any): string {
  return `
You are a competitive intelligence analyst focusing on the Indian market.
Identify exactly 2 key direct or indirect competitors (either organized brands or unorganized local players) in India:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. For each competitor, specify their description, strengths, weaknesses, estimated market share in India, and your specific differentiator.
2. Differentiators must be concrete and suited to the Indian customer (e.g., pricing, convenience, hyper-local distribution, UPI checkout speed, localized taste/preferences).
3. Return ONLY a valid JSON array matching the schema below.

OUTPUT SCHEMA (JSON):
[
  {
    "name": "string (Indian Competitor Name, e.g. Wow! Momo or local street vendors)",
    "description": "string (Core product offering)",
    "strengths": ["string (Competitor strength 1)", "string (Competitor strength 2)"],
    "weaknesses": ["string (Competitor weakness 1)", "string (Competitor weakness 2)"],
    "marketShare": "string (e.g. '~8% organized market' or 'Highly fragmented unorganized street vendors')",
    "differentiator": "string (Your specific competitive advantage, e.g. 20% lower pricing, premium packaging, or healthier ingredients)"
  }
]
`;
}

export function businessModelPrompt(startup: any): string {
  return `
You are a business model designer and unit economics expert specializing in Indian commerce.
Develop a proposed business model, pricing strategy, and unit economics estimates for the Indian market:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Define the overall model type (e.g. QSR Franchise, D2C, Subscription, B2B SaaS).
2. Outline exactly 2-3 specific revenue streams with pricing/mechanisms in Indian Rupees (₹).
3. Estimate customer acquisition cost (CAC), lifetime value (LTV), and payback period based on Indian standards (addressing UPI, cash-on-delivery (COD) return rates, and high price sensitivity). Set "isEstimate" to true.
4. Calculate a business model scalability/viability score (0-100) reflecting gross margins, complexity, and recurring potential in India.
5. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "type": "string (e.g. QSR Franchise, D2C, B2B SaaS, Marketplace)",
  "revenueStreams": [
    { "stream": "string (Stream Name, e.g., Franchise Royalty)", "description": "string (Pricing in ₹, e.g., 6% royalty fee on monthly franchise sales)" },
    { "stream": "string (Stream Name, e.g., Direct-to-Consumer retail)", "description": "string (Pricing in ₹, e.g., average order value of ₹250 per box)" }
  ],
  "pricingStrategy": "string (Concise description of the pricing philosophy and positioning tailored to Indian consumer price sensitivity)",
  "unitEconomics": {
    "cac": "string (in ₹, e.g., '₹80 - ₹120 per customer acquisition')",
    "ltv": "string (in ₹, e.g., '₹1,500 (based on repeat purchases over 12mo)')",
    "paybackPeriod": "string (e.g., '4 months')",
    "isEstimate": true
  },
  "sectionScore": {
    "score": number (0-100),
    "reasoning": "string (1-2 sentence explanation of the business model viability rating in the Indian market)"
  }
}
`;
}

export function financialsPrompt(startup: any): string {
  return `
You are a chief financial officer focusing on Indian SME and startup scaling.
Generate a 3-year financial projection model (revenue, costs, profit, users) and capital assumptions in Indian Rupees (₹):
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Projections must be mathematically consistent: Profit = Revenue - Costs.
2. Currency values should be represented as raw numbers representing INR ₹.
3. Outline the funding needed in ₹ (e.g. ₹50 Lakhs seed, ₹2 Crore Series A), break-even timeline, and core assumptions relevant to the Indian context (e.g. staff salaries, commercial rent, local channel CAC).
4. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "projections": [
    { "year": 2026, "revenue": number (in ₹), "costs": number (in ₹), "profit": number (in ₹), "users": number, "isEstimate": true },
    { "year": 2027, "revenue": number (in ₹), "costs": number (in ₹), "profit": number (in ₹), "users": number, "isEstimate": true },
    { "year": 2028, "revenue": number (in ₹), "costs": number (in ₹), "profit": number (in ₹), "users": number, "isEstimate": true }
  ],
  "fundingNeeded": "string (in ₹, e.g., '₹50 Lakhs (pre-seed)')",
  "breakEvenTimeline": "string (e.g., '12 months')",
  "keyAssumptions": [
    "string (Assumption 1, e.g. Average order value increases by 10% annually)",
    "string (Assumption 2, e.g. Raw ingredient sourcing costs remain stable via direct contracts)"
  ]
}
`;
}

export function roadmapPrompt(startup: any): string {
  return `
You are an agile product manager coordinating operations in India.
Create a strategic 3-phase execution roadmap for:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Divide the roadmap into exactly 3 sequential phases (e.g., Phase 1: MVP & FSSAI Licensing, Phase 2: Local Franchise Pilot, Phase 3: Pan-India Expansion).
2. For each phase, define specific goals, milestones, timelines, and estimated costs in ₹.
3. Incorporate Indian operational checkpoints: FSSAI registration, GST compliance, local municipal trade licenses, UPI integration, and local supply chain setups.
4. Return ONLY a valid JSON array matching the schema below.

OUTPUT SCHEMA (JSON):
[
  {
    "phase": "string (Phase Title, e.g., Phase 1: MVP & Licensing)",
    "timeline": "string (e.g., Months 1-3)",
    "goals": ["string (Goal 1, e.g. Secure FSSAI and municipal trade licenses)", "string (Goal 2)"],
    "keyMilestones": ["string (Milestone 1)", "string (Milestone 2)"],
    "estimatedCost": "string (in ₹, e.g., '₹5 Lakhs')"
  }
]
`;
}

export function risksPrompt(startup: any): string {
  return `
You are a risk management consultant specializing in Indian regulations and market entry.
Identify exactly 2 critical risks and corresponding mitigation strategies in India for:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Focus on real Indian market risks: High price sensitivity, unorganized sector competition, supply chain breakdowns, and regulatory compliance (FSSAI, GST, local labor laws).
2. Mitigations must be actionable and cost-effective.
3. Return ONLY a valid JSON array matching the schema below.

OUTPUT SCHEMA (JSON):
[
  {
    "category": "string (e.g., Regulatory, Operational, Financial, Market)",
    "risk": "string (Detailed description of the threat in India)",
    "severity": "string (e.g., High, Medium, Low)",
    "mitigation": "string (Detailed actionable mitigation plan)"
  }
]
`;
}

export function investorPitchPrompt(startup: any): string {
  return `
You are an advisor helping prepare a pitch deck for Indian Angel Networks (IAN, Mumbai Angels) and seed VCs.
Develop an investor pitch structure and proposed use of funds allocation for:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Synthesize a compelling elevator pitch, problem statement, and solution relevant to Indian consumers.
2. Outline the 'why now' tailwinds (e.g. rising middle-class consumption, quick-commerce expansion).
3. Itemize the use of funds (percentage breakdown among 3 categories totaling 100%).
4. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "elevatorPitch": "string (1-sentence high-impact pitch)",
  "problemStatement": "string (core customer pain point in India)",
  "solution": "string (how this startup uniquely addresses the pain point)",
  "whyNow": "string (Indian market shifts creating urgency)",
  "askAmount": "string (total ask size in ₹, e.g. '₹50 Lakhs')",
  "useOfFunds": [
    { "category": "string (e.g. Commercial Kitchen Setup)", "percentage": number },
    { "category": "string (e.g. Local Marketing & Brand Building)", "percentage": number },
    { "category": "string (e.g. Working Capital)", "percentage": number }
  ]
}
`;
}

export function goToMarketPrompt(startup: any): string {
  return `
You are a growth marketing director.
Develop a Go-To-Market strategy, acquisition channels, and launch plan for the Indian market:
Startup Name: ${startup.name}
Idea: ${startup.idea}

CRITICAL INSTRUCTIONS:
1. Define the overall GTM strategy.
2. Identify exactly 2 key acquisition channels with priorities and rationale (e.g., WhatsApp marketing, Swiggy/Zomato listing SEO, partnerships with local colleges/offices).
3. Detail a launch timeline plan and primary metrics to track.
4. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "strategy": "string (high-level GTM approach)",
  "channels": [
    { "channel": "string (e.g., Swiggy/Zomato SEO & Ads)", "priority": "string (e.g. High)", "rationale": "string (reasoning)" },
    { "channel": "string (e.g., Hyper-local WhatsApp Communities)", "priority": "string (e.g. Medium)", "rationale": "string (reasoning)" }
  ],
  "launchPlan": "string (1-paragraph launch sequence description in metro locations)",
  "metricsToTrack": ["string (Metric 1, e.g. Weekly Orders)", "string (Metric 2, e.g. Customer Repeat Rate)"]
}
`;
}

export function executiveSummaryPrompt(startup: any, scores: any): string {
  return `
You are a senior VC managing director compiling the final investment memo for the Indian market.
Synthesize an executive summary and final investment recommendation for:
Startup Name: ${startup.name}
Idea: ${startup.idea}
Overall Score: ${scores.overall.score}/100 (${scores.overall.label})

CRITICAL INSTRUCTIONS:
1. Write a compelling 1-sentence hook and a concise overview paragraph.
2. Extract exactly 3 key strategic insights about Indian market entry, customer adoption, or competitive advantage.
3. Provide a clear go/no-go investment recommendation based on the overall score.
4. Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA (JSON):
{
  "hook": "string (1-sentence hook)",
  "overview": "string (high-level summary of the findings)",
  "keyInsights": [
    "string (Key insight 1)",
    "string (Key insight 2)",
    "string (Key insight 3)"
  ],
  "recommendation": "string (Go/No-go recommendation statement with reasoning)"
}
`;
}
