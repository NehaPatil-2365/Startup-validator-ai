import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

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
        console.log("Loaded GROQ_API_KEY from .env.local via absolute path fail-safe in Chat Route.");
      }
    }
  } catch (e) {
    console.error("Chat Route fail-safe env loader error:", e);
  }
}

const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const { message, reportData, chatHistory } = await req.json();

    if (!message || !reportData) {
      return Response.json(
        { error: 'Missing message or report context.' },
        { status: 400 }
      );
    }

    if (!groq) {
      console.warn("GROQ_API_KEY is not defined. Using mock chatbot replies.");
      await new Promise((resolve) => setTimeout(resolve, 800));
      const replies = [
        "Based on your report, I recommend focusing on Shopify POS integration first. That reduces friction for small merchants.",
        "Your unit economics look strong, but keep an eye on SME churn. A 5% monthly churn is common in retail SaaS; try to target larger merchants to offset this.",
        "To improve your investor pitch, emphasize the TAM ($12.4B) and explain how the carbon offsetting marketplace can scale as a high-margin secondary revenue stream.",
        "For your GTM strategy, SEO on Shopify app store is highly prioritized because merchants actively search for 'carbon badges' there.",
        "I suggest adding a feature that exports automated PDF summaries that merchants can directly email to their enterprise suppliers to satisfy compliance reporting."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return Response.json({ reply: randomReply });
    }

    const systemPrompt = `
You are an expert AI startup advisor specializing in the Indian startup ecosystem and consumer market. 
The user has generated a validation report for their startup idea.
Here is the full structured startup report context:
${JSON.stringify(reportData, null, 2)}

CRITICAL INSTRUCTIONS FOR YOUR RESPONSE:
1. Tailor all advice, marketing strategies, and operational plans specifically for the Indian market, Indian consumer behavior, and Indian regulatory standards.
2. Use ONLY Indian Rupees (INR, ₹) for all monetary values, pricing suggestions, and cost estimates. NEVER use USD ($).
3. Ensure pricing suggestions are realistic for India (e.g. basic momos/snacks should be ₹50-₹100 per plate, premium options ₹120-₹200, rather than Western prices of $6-$10).
4. Incorporate Indian payment integrations (like UPI, PayTM/PhonePe), delivery services (Swiggy, Zomato, Zepto, Blinkit), and local terminology (Lakhs, Crores, Kiranas, metros).
5. Identify gaps and call out estimates clearly. Use markdown format.
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(chatHistory || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || 'Sorry, I was unable to generate a response.';
    return Response.json({ reply });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
