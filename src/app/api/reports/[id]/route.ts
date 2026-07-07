import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }

    return Response.json(JSON.parse(report.data));
  } catch (error: any) {
    console.error('Failed to get report:', error);
    return Response.json({ error: 'Failed to retrieve report' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.report.delete({
      where: { id: params.id },
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete report:', error);
    return Response.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
