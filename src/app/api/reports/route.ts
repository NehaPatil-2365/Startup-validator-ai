import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let anonUser = await prisma.user.findFirst({
      where: { email: 'anonymous@validateai.local' },
    });

    if (!anonUser) {
      return Response.json([]);
    }

    const reports = await prisma.report.findMany({
      where: { userId: anonUser.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        idea: true,
        createdAt: true,
        data: true,
      },
    });

    const parsedReports = reports.map((r) => {
      try {
        const fullData = JSON.parse(r.data);
        return {
          id: r.id,
          title: r.title,
          idea: r.idea,
          createdAt: r.createdAt,
          score: fullData.scores?.overall?.score || 0,
          industry: fullData.startup?.industry || 'CleanTech',
        };
      } catch {
        return {
          id: r.id,
          title: r.title,
          idea: r.idea,
          createdAt: r.createdAt,
          score: 0,
          industry: 'CleanTech',
        };
      }
    });

    return Response.json(parsedReports);
  } catch (error: any) {
    console.error('Failed to get reports list:', error);
    return Response.json({ error: 'Failed to list reports' }, { status: 500 });
  }
}
