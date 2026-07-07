import { z } from 'zod';

const ScoreWithReasoningSchema = z.object({
  score: z.number().min(0).max(100),
  label: z.enum(['Excellent', 'Strong', 'Promising', 'Moderate', 'Needs Work', 'High Risk']),
  reasoning: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
});

const SimilarBusinessSchema = z.object({
  company: z.string(),
  industry: z.string(),
  stage: z.string(),
  businessModel: z.string(),
  outcome: z.string(),
  keyLessons: z.string(),
  isVerified: z.boolean(),
  source: z.string().optional(),
});

const CompetitorSchema = z.object({
  name: z.string(),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  marketShare: z.string().optional(),
  differentiator: z.string(),
});

const SwotSchema = z.object({
  strengths: z.array(z.object({ point: z.string(), detail: z.string() })),
  weaknesses: z.array(z.object({ point: z.string(), detail: z.string() })),
  opportunities: z.array(z.object({ point: z.string(), detail: z.string() })),
  threats: z.array(z.object({ point: z.string(), detail: z.string() })),
});

const FinancialProjectionSchema = z.object({
  year: z.number(),
  revenue: z.number(),
  costs: z.number(),
  profit: z.number(),
  users: z.number(),
  isEstimate: z.boolean().default(true),
});

const RoadmapPhaseSchema = z.object({
  phase: z.string(),
  timeline: z.string(),
  goals: z.array(z.string()),
  keyMilestones: z.array(z.string()),
  estimatedCost: z.string().optional(),
});

const RiskSchema = z.object({
  category: z.string(),
  risk: z.string(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  mitigation: z.string(),
});

export const ReportSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  startup: z.object({
    name: z.string(),
    idea: z.string(),
    industry: z.string(),
    targetMarket: z.string(),
    stage: z.string().optional(),
    teamSize: z.string().optional(),
    funding: z.string().optional(),
  }),

  scores: z.object({
    overall: ScoreWithReasoningSchema,
    innovation: ScoreWithReasoningSchema,
    marketPotential: ScoreWithReasoningSchema,
    scalability: ScoreWithReasoningSchema,
    risk: ScoreWithReasoningSchema,
    investmentReadiness: ScoreWithReasoningSchema,
  }),

  executiveSummary: z.object({
    hook: z.string(),
    overview: z.string(),
    keyInsights: z.array(z.string()),
    recommendation: z.string(),
  }),

  marketAnalysis: z.object({
    marketSize: z.object({
      tam: z.string(),
      sam: z.string(),
      som: z.string(),
      isEstimate: z.boolean().default(true),
    }),
    trends: z.array(z.string()),
    targetAudience: z.string(),
    marketGaps: z.array(z.string()),
  }),

  similarBusinesses: z.array(SimilarBusinessSchema),
  competitors: z.array(CompetitorSchema),
  swot: SwotSchema,

  businessModel: z.object({
    type: z.string(),
    revenueStreams: z.array(z.object({ stream: z.string(), description: z.string() })),
    pricingStrategy: z.string(),
    unitEconomics: z.object({
      cac: z.string(),
      ltv: z.string(),
      paybackPeriod: z.string(),
      isEstimate: z.boolean().default(true),
    }),
  }),

  financials: z.object({
    projections: z.array(FinancialProjectionSchema),
    fundingNeeded: z.string(),
    breakEvenTimeline: z.string(),
    keyAssumptions: z.array(z.string()),
  }),

  roadmap: z.array(RoadmapPhaseSchema),
  risks: z.array(RiskSchema),

  investorPitch: z.object({
    elevatorPitch: z.string(),
    problemStatement: z.string(),
    solution: z.string(),
    whyNow: z.string(),
    askAmount: z.string(),
    useOfFunds: z.array(z.object({ category: z.string(), percentage: z.number() })),
  }),

  goToMarket: z.object({
    strategy: z.string(),
    channels: z.array(z.object({ channel: z.string(), priority: z.string(), rationale: z.string() })),
    launchPlan: z.string(),
    metricsToTrack: z.array(z.string()),
  }),

  generationMeta: z.object({
    model: z.string(),
    totalTokens: z.number().optional(),
    generationTimeMs: z.number().optional(),
    sectionsGenerated: z.array(z.string()),
    errors: z.array(z.string()).optional(),
  }),
});

export type Report = z.infer<typeof ReportSchema>;
export type ScoreWithReasoning = z.infer<typeof ScoreWithReasoningSchema>;
export type SimilarBusiness = z.infer<typeof SimilarBusinessSchema>;
export type Competitor = z.infer<typeof CompetitorSchema>;
export type FinancialProjection = z.infer<typeof FinancialProjectionSchema>;
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;
export type Risk = z.infer<typeof RiskSchema>;
