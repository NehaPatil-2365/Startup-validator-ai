import Groq from 'groq-sdk';
import { demoReport } from '../demo-data';

const groqApiKey = process.env.GROQ_API_KEY;

const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

export async function generateJSON<T>(
  prompt: string,
  model: string = 'llama-3.3-70b-versatile',
  fallbackData?: any
): Promise<T> {
  // If no API key is provided, return fallback data immediately (Demo/Mock mode)
  if (!groq) {
    console.warn("GROQ_API_KEY is not defined. Using mock demo data for development.");
    // Simulate a brief delay to make the loading screen visible
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (fallbackData !== undefined) return fallbackData as T;
    return demoReport as unknown as T;
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const text = response.choices[0]?.message?.content || '{}';
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Groq generation error:", error);
    if (fallbackData !== undefined) return fallbackData as T;
    throw error;
  }
}
