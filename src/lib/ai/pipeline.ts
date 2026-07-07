import { generateJSON } from './groq';
import * as prompts from './prompts';
import { computeOverallScore } from './scoring';
import { Report } from '../schema';
import { demoReport } from '../demo-data';

export interface PipelineEvent {
  type: 'status' | 'section' | 'error' | 'complete';
  message?: string;
  key?: string;
  data?: any;
  reportId?: string;
}

export async function* runPipeline(
  input: prompts.StartupInput,
  reportId: string
): AsyncGenerator<PipelineEvent> {
  const startTime = Date.now();
  console.log("Starting validation pipeline for:", input.name);

  // Fallback demo data template
  const fallback = demoReport;

  // Step 1: Parse and clean startup profile
  yield { type: 'status', message: 'Standardizing startup description...' };
  let profile = await generateJSON<any>(
    prompts.startupProfilePrompt(input),
    'llama-3.3-70b-versatile',
    {
      name: input.name,
      idea: input.idea,
      industry: input.industry,
      targetMarket: input.targetMarket,
      stage: input.stage || 'Idea',
      teamSize: input.teamSize || '1 founder',
      funding: input.funding || 'Bootstrapped',
    }
  );
  yield { type: 'section', key: 'startup', data: profile };

  // Step 2: Market analysis
  yield { type: 'status', message: 'Analyzing market size and trends...' };
  let market = await generateJSON<any>(
    prompts.marketAnalysisPrompt(profile),
    'llama-3.3-70b-versatile',
    fallback.marketAnalysis
  );
  yield { type: 'section', key: 'marketAnalysis', data: market };

  // Step 3: Run remaining sections in parallel
  yield { type: 'status', message: 'Analyzing financial models, competitor maps, and roadmaps...' };

  const taskMap = [
    { key: 'swot', fn: () => generateJSON(prompts.swotPrompt(profile), 'llama-3.3-70b-versatile', fallback.swot) },
    { key: 'similarBusinesses', fn: () => generateJSON(prompts.similarBusinessesPrompt(profile), 'llama-3.3-70b-versatile', fallback.similarBusinesses) },
    { key: 'competitors', fn: () => generateJSON(prompts.competitorsPrompt(profile), 'llama-3.3-70b-versatile', fallback.competitors) },
    { key: 'businessModel', fn: () => generateJSON(prompts.businessModelPrompt(profile), 'llama-3.3-70b-versatile', fallback.businessModel) },
    { key: 'financials', fn: () => generateJSON(prompts.financialsPrompt(profile), 'llama-3.3-70b-versatile', fallback.financials) },
    { key: 'roadmap', fn: () => generateJSON(prompts.roadmapPrompt(profile), 'llama-3.3-70b-versatile', fallback.roadmap) },
    { key: 'risks', fn: () => generateJSON(prompts.risksPrompt(profile), 'llama-3.3-70b-versatile', fallback.risks) },
    { key: 'investorPitch', fn: () => generateJSON(prompts.investorPitchPrompt(profile), 'llama-3.3-70b-versatile', fallback.investorPitch) },
    { key: 'goToMarket', fn: () => generateJSON(prompts.goToMarketPrompt(profile), 'llama-3.3-70b-versatile', fallback.goToMarket) },
  ];

  const results = await Promise.allSettled(taskMap.map((t) => t.fn()));

  const sectionsData: Record<string, any> = {};

  for (let index = 0; index < results.length; index++) {
    const res = results[index];
    const key = taskMap[index].key;
    if (res.status === 'fulfilled') {
      let val: any = res.value;
      if (['similarBusinesses', 'competitors', 'roadmap', 'risks'].includes(key)) {
        if (val && !Array.isArray(val) && typeof val === 'object') {
          for (const k of Object.keys(val)) {
            if (Array.isArray(val[k])) {
              val = val[k];
              break;
            }
          }
        }
      }
      sectionsData[key] = val;
      yield { type: 'section', key, data: val };
    } else {
      console.error(`Pipeline failure in ${key}:`, res.reason);
      const fallbackSection = (fallback as any)[key];
      sectionsData[key] = fallbackSection;
      yield { type: 'section', key, data: fallbackSection };
      yield { type: 'error', message: `Failed generating ${key}, using backup insights.` };
    }
  }

  // Step 4: Compute overall scores
  yield { type: 'status', message: 'Computing overall scores...' };
  const marketScore = market?.sectionScore?.score || 70;
  const bizModelScore = sectionsData.businessModel?.sectionScore?.score || 70;
  const scores = computeOverallScore({ marketScore, businessModelScore: bizModelScore });
  yield { type: 'section', key: 'scores', data: scores };

  // Step 5: Executive summary
  yield { type: 'status', message: 'Synthesizing executive summary...' };
  let executiveSummary = await generateJSON<any>(
    prompts.executiveSummaryPrompt(profile, scores),
    'llama-3.3-70b-versatile',
    fallback.executiveSummary
  );
  yield { type: 'section', key: 'executiveSummary', data: executiveSummary };

  // Assemble full report object
  const report: Report = {
    id: reportId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startup: profile,
    scores,
    executiveSummary,
    marketAnalysis: market,
    similarBusinesses: sectionsData.similarBusinesses,
    competitors: sectionsData.competitors,
    swot: sectionsData.swot,
    businessModel: sectionsData.businessModel,
    financials: sectionsData.financials,
    roadmap: sectionsData.roadmap,
    risks: sectionsData.risks,
    investorPitch: sectionsData.investorPitch,
    goToMarket: sectionsData.goToMarket,
    generationMeta: {
      model: 'groq/llama-3.3-70b-versatile',
      generationTimeMs: Date.now() - startTime,
      sectionsGenerated: ['startup', 'marketAnalysis', ...taskMap.map((t) => t.key), 'scores', 'executiveSummary'],
    },
  };

  // Yield the completed report back
  yield { type: 'complete', reportId, data: report };
}
