import { NextRequest } from 'next/server';
import { runPipeline } from '@/lib/ai/pipeline';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, idea, industry, targetMarket, stage, teamSize, funding } = body;

    if (!name || !idea || !industry || !targetMarket) {
      return Response.json(
        { error: 'Missing required validation fields.' },
        { status: 400 }
      );
    }

    const reportId = uuidv4();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: any) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          const pipeline = runPipeline(
            { name, idea, industry, targetMarket, stage, teamSize, funding },
            reportId
          );

          let finalReport: any = null;

          for await (const event of pipeline) {
            if (event.type === 'section') {
              send('section', { key: event.key, data: event.data });
            } else if (event.type === 'status') {
              send('status', { message: event.message });
            } else if (event.type === 'error') {
              send('error', { message: event.message });
            } else if (event.type === 'complete') {
              finalReport = event.data;
            }
          }

          if (finalReport) {
            // Save to DB under a dummy/anonymous user for local hosting
            let anonUser = await prisma.user.findFirst({
              where: { email: 'anonymous@validateai.local' },
            });

            if (!anonUser) {
              const bcrypt = require('bcryptjs');
              const passwordHash = await bcrypt.hash('anon-pass-123', 10);
              anonUser = await prisma.user.create({
                data: {
                  email: 'anonymous@validateai.local',
                  name: 'Local User',
                  passwordHash,
                },
              });
            }

            await prisma.report.create({
              data: {
                id: reportId,
                userId: anonUser.id,
                title: finalReport.startup.name,
                idea: finalReport.startup.idea,
                data: JSON.stringify(finalReport),
              },
            });

            send('complete', { reportId });
          }
        } catch (err: any) {
          console.error('Error in streaming pipeline:', err);
          send('error', { message: err.message || 'Fatal pipeline error.' });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Validate route error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
