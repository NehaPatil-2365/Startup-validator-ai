import { ScoreWithReasoning } from '../schema';

export function computeOverallScore(sectionScores: {
  marketScore: number;
  businessModelScore: number;
  innovationScore?: number;
  scalabilityScore?: number;
}): {
  overall: ScoreWithReasoning;
  innovation: ScoreWithReasoning;
  marketPotential: ScoreWithReasoning;
  scalability: ScoreWithReasoning;
  risk: ScoreWithReasoning;
  investmentReadiness: ScoreWithReasoning;
} {
  const market = sectionScores.marketScore || 70;
  const bizModel = sectionScores.businessModelScore || 70;
  const innovation = sectionScores.innovationScore || 72;
  const scalability = sectionScores.scalabilityScore || 75;

  // Weighted formula
  const overallVal = Math.round(
    market * 0.35 +
    bizModel * 0.25 +
    innovation * 0.20 +
    scalability * 0.20
  );

  const getLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 55) return 'Promising';
    if (score >= 40) return 'Moderate';
    if (score >= 25) return 'Needs Work';
    return 'High Risk';
  };

  const overall: ScoreWithReasoning = {
    score: overallVal,
    label: getLabel(overallVal) as any,
    reasoning: `Weighted score based on Market Potential (35%), Business Model (25%), Innovation (20%), and Scalability (20%).`,
    confidence: 'high',
  };

  const innovationScore: ScoreWithReasoning = {
    score: innovation,
    label: getLabel(innovation) as any,
    reasoning: `Measures differentiation and technology/concept uniqueness.`,
    confidence: 'medium',
  };

  const marketPotential: ScoreWithReasoning = {
    score: market,
    label: getLabel(market) as any,
    reasoning: `Determined from TAM size, addressable audience demand, and regulatory/market trends.`,
    confidence: 'high',
  };

  const scalabilityScore: ScoreWithReasoning = {
    score: scalability,
    label: getLabel(scalability) as any,
    reasoning: `Assesses operational leverage, recurring revenue potential, and market expansion friction.`,
    confidence: 'medium',
  };

  // Inverted: higher means less risk, so if risk score is low, actual risk is low. Let's make a standard risk score (lower = better)
  const riskValue = Math.max(10, Math.min(90, Math.round(100 - (overallVal * 0.7 + innovation * 0.3))));
  const risk: ScoreWithReasoning = {
    score: riskValue,
    label: (riskValue > 60 ? 'High Risk' : riskValue > 40 ? 'Moderate' : 'Needs Work') as any,
    reasoning: `Aggregated score of operational, technical, and financial vulnerabilities. Lower is better.`,
    confidence: 'medium',
  };

  const readinessVal = Math.round(overallVal * 0.8 + (100 - riskValue) * 0.2);
  const investmentReadiness: ScoreWithReasoning = {
    score: readinessVal,
    label: getLabel(readinessVal) as any,
    reasoning: `Measures commercial viability and maturity for external funding options.`,
    confidence: 'high',
  };

  return {
    overall,
    innovation: innovationScore,
    marketPotential,
    scalability: scalabilityScore,
    risk,
    investmentReadiness,
  };
}
