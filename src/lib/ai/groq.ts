import Groq from 'groq-sdk';
import { demoReport } from '../demo-data';
import fs from 'fs';

let groqApiKey = process.env.GROQ_API_KEY;

// Fail-safe absolute path loader for local dev server
if (!groqApiKey) {
  try {
    const envPath = '/home/yash/Projects/bahin ka startup/.env.local';
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GROQ_API_KEY="([^"]+)"/) || content.match(/GROQ_API_KEY=([^\s\n]+)/);
      if (match) {
        groqApiKey = match[1];
        console.log("Loaded GROQ_API_KEY from .env.local via absolute path fail-safe.");
      }
    }
  } catch (e) {
    console.error("Fail-safe env loader error:", e);
  }
}

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
