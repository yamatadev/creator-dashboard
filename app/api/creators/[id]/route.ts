import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const creator = await prisma.creator.findUnique({
    where: { id },
    include: {
      earnings: { orderBy: { date: "desc" }, take: 60 },
      metrics: { orderBy: { date: "desc" }, take: 60 },
    },
  });

  if (!creator) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }

  // Calcular totais
  const totalEarnings = await prisma.earning.aggregate({
    where: { creatorId: id },
    _sum: { amount: true },
  });

  const monthlyEarnings = await prisma.earning.aggregate({
    where: {
      creatorId: id,
      date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    _sum: { amount: true },
  });

  const latestMetric = await prisma.metric.findFirst({
    where: { creatorId: id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({
    ...creator,
    totalEarnings: totalEarnings._sum.amount || 0,
    monthlyEarnings: monthlyEarnings._sum.amount || 0,
    latestFollowers: latestMetric?.followers || 0,
    latestViews: latestMetric?.views || 0,
    latestEngagement: latestMetric?.engagement || 0,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const creator = await prisma.creator.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      platform: body.platform,
      status: body.status,
      bio: body.bio,
    },
  });

  return NextResponse.json(creator);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.creator.delete({ where: { id } });

  return NextResponse.json({ success: true });
}